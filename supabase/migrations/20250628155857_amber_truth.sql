/*
  # Course Enrollment System

  1. New Tables
    - Update existing courses table with proper structure
    - Ensure user_courses table exists for tracking enrollments
    - Add course_purchases table for tracking individual course payments

  2. Functions
    - Function to enroll user in course after payment
    - Function to check if user has course access
    - Function to get user's enrolled courses

  3. Security
    - RLS policies for course access
    - Enrollment tracking and validation
*/

-- Ensure courses table has proper structure
DO $$
BEGIN
  -- Add missing columns to courses table if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'price'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN price numeric(10,2) DEFAULT 10.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'instructor'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN instructor text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'level'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN level text DEFAULT 'beginner';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'duration'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN duration text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'enrolled_count'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN enrolled_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'rating'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN rating numeric(2,1) DEFAULT 4.5;
  END IF;
END $$;

-- Create course_purchases table to track individual course payments
CREATE TABLE IF NOT EXISTS public.course_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  stripe_session_id text,
  stripe_payment_intent_id text,
  amount_paid numeric(10,2),
  currency text DEFAULT 'usd',
  purchase_date timestamptz DEFAULT now(),
  status text DEFAULT 'completed',
  
  -- Unique constraint to prevent duplicate purchases
  UNIQUE(user_id, course_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS course_purchases_user_id_idx ON public.course_purchases(user_id);
CREATE INDEX IF NOT EXISTS course_purchases_course_id_idx ON public.course_purchases(course_id);
CREATE INDEX IF NOT EXISTS course_purchases_session_id_idx ON public.course_purchases(stripe_session_id);

-- Enable RLS
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_purchases
CREATE POLICY "Users can view their own course purchases"
ON public.course_purchases
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course purchases"
ON public.course_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all course purchases"
ON public.course_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to enroll user in course after successful payment
CREATE OR REPLACE FUNCTION public.enroll_user_in_course(
  p_user_id uuid,
  p_course_id uuid,
  p_stripe_session_id text DEFAULT NULL,
  p_stripe_payment_intent_id text DEFAULT NULL,
  p_amount_paid numeric DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  course_record public.courses%ROWTYPE;
  result json;
BEGIN
  -- Get course details
  SELECT * INTO course_record
  FROM public.courses
  WHERE id = p_course_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Course not found or inactive'
    );
  END IF;
  
  -- Check if user is already enrolled
  IF EXISTS (
    SELECT 1 FROM public.user_courses
    WHERE user_id = p_user_id AND course_id = p_course_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User already enrolled in this course'
    );
  END IF;
  
  -- Insert into user_courses (enrollment)
  INSERT INTO public.user_courses (user_id, course_id)
  VALUES (p_user_id, p_course_id);
  
  -- Insert into course_purchases (payment tracking)
  INSERT INTO public.course_purchases (
    user_id,
    course_id,
    stripe_session_id,
    stripe_payment_intent_id,
    amount_paid
  )
  VALUES (
    p_user_id,
    p_course_id,
    p_stripe_session_id,
    p_stripe_payment_intent_id,
    COALESCE(p_amount_paid, course_record.price)
  )
  ON CONFLICT (user_id, course_id) DO NOTHING;
  
  -- Update enrolled count
  UPDATE public.courses
  SET enrolled_count = enrolled_count + 1
  WHERE id = p_course_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'User successfully enrolled in course',
    'course_id', p_course_id,
    'course_title', course_record.title
  );
END;
$$;

-- Function to check if user has access to a course
CREATE OR REPLACE FUNCTION public.user_has_course_access(
  p_user_id uuid,
  p_course_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has active subscription (access to all courses)
  IF EXISTS (
    SELECT 1 FROM public.stripe_subscriptions ss
    JOIN public.stripe_customers sc ON ss.customer_id = sc.customer_id
    WHERE sc.user_id = p_user_id
    AND ss.status = 'active'
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if user has purchased this specific course
  RETURN EXISTS (
    SELECT 1 FROM public.user_courses
    WHERE user_id = p_user_id AND course_id = p_course_id
  );
END;
$$;

-- Function to get user's accessible courses
CREATE OR REPLACE FUNCTION public.get_user_accessible_courses(p_user_id uuid)
RETURNS TABLE (
  course_id uuid,
  title text,
  description text,
  course_url text,
  instructor text,
  level text,
  duration text,
  rating numeric,
  access_type text,
  enrolled_date timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_subscription boolean;
BEGIN
  -- Check if user has active subscription
  SELECT EXISTS (
    SELECT 1 FROM public.stripe_subscriptions ss
    JOIN public.stripe_customers sc ON ss.customer_id = sc.customer_id
    WHERE sc.user_id = p_user_id
    AND ss.status = 'active'
  ) INTO has_subscription;
  
  IF has_subscription THEN
    -- Return all courses if user has subscription
    RETURN QUERY
    SELECT 
      c.id,
      c.title,
      c.description,
      c.course_url,
      c.instructor,
      c.level,
      c.duration,
      c.rating,
      'subscription'::text as access_type,
      NULL::timestamptz as enrolled_date
    FROM public.courses c
    WHERE c.is_active = true
    ORDER BY c.created_at DESC;
  ELSE
    -- Return only purchased courses
    RETURN QUERY
    SELECT 
      c.id,
      c.title,
      c.description,
      c.course_url,
      c.instructor,
      c.level,
      c.duration,
      c.rating,
      'purchase'::text as access_type,
      uc.purchase_date as enrolled_date
    FROM public.courses c
    JOIN public.user_courses uc ON c.id = uc.course_id
    WHERE uc.user_id = p_user_id
    AND c.is_active = true
    ORDER BY uc.purchase_date DESC;
  END IF;
END;
$$;

-- Insert sample courses if they don't exist
INSERT INTO public.courses (id, title, description, course_url, instructor, level, duration, price, rating, enrolled_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Statistical Inference Fundamentals', 'Master the core concepts of statistical inference, hypothesis testing, and confidence intervals with real-world applications.', '/courses/statistical-inference', 'Dr. Sarah Chen', 'intermediate', '8 weeks', 299.00, 4.8, 1234),
('550e8400-e29b-41d4-a716-446655440002', 'Machine Learning Statistics', 'Learn the statistical foundations behind modern machine learning algorithms and how to apply them effectively.', '/courses/machine-learning-stats', 'Prof. Michael Rodriguez', 'advanced', '10 weeks', 399.00, 4.9, 892),
('550e8400-e29b-41d4-a716-446655440003', 'Bayesian Data Analysis', 'Explore Bayesian statistics and its applications in real-world data analysis and decision making.', '/courses/bayesian-analysis', 'Dr. Emily Watson', 'advanced', '6 weeks', 349.00, 4.7, 567),
('550e8400-e29b-41d4-a716-446655440004', 'Time Series Analysis', 'Master time series forecasting techniques and learn to analyze temporal data patterns effectively.', '/courses/time-series', 'Dr. James Liu', 'intermediate', '7 weeks', 279.00, 4.6, 743),
('550e8400-e29b-41d4-a716-446655440005', 'Experimental Design', 'Learn to design robust experiments and analyze experimental data with statistical rigor.', '/courses/experimental-design', 'Dr. Anna Thompson', 'beginner', '5 weeks', 199.00, 4.5, 1156),
('550e8400-e29b-41d4-a716-446655440006', 'Deep Learning Mathematics', 'Understand the mathematical foundations of deep learning and neural network architectures.', '/courses/deep-learning-math', 'Prof. David Kim', 'advanced', '12 weeks', 499.00, 4.8, 456)
ON CONFLICT (id) DO NOTHING;

-- Update existing courses policies to include purchase-based access
DROP POLICY IF EXISTS "Users can only access purchased courses" ON public.courses;

CREATE POLICY "Users can access courses they have purchased or with subscription"
ON public.courses
FOR SELECT
USING (
  is_active = true AND (
    -- User has purchased this specific course
    EXISTS (
      SELECT 1 FROM public.user_courses
      WHERE user_courses.course_id = courses.id
      AND user_courses.user_id = auth.uid()
    )
    OR
    -- User has active subscription
    EXISTS (
      SELECT 1 FROM public.stripe_subscriptions ss
      JOIN public.stripe_customers sc ON ss.customer_id = sc.customer_id
      WHERE sc.user_id = auth.uid()
      AND ss.status = 'active'
    )
  )
);