/*
  # Course Platform Database Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key, default random UUID)
      - `title` (text, required)
      - `description` (text, optional)
      - `course_url` (text, required)
      - `created_at` (timestamptz, default now)
    
    - `user_courses`
      - `id` (uuid, primary key, default random UUID)
      - `user_id` (uuid, references auth.users.id, on delete cascade)
      - `course_id` (uuid, references courses.id, on delete cascade)
      - `purchase_date` (timestamptz, default now)
      - Unique constraint on (user_id, course_id)

  2. Security
    - Enable RLS on both tables
    - Courses policies:
      - Users can view all courses
      - Users can only access course content if they have purchased it
    - User_courses policies:
      - Users can only see their own purchase records
      - Users can insert their own purchase records (for purchasing)

  3. Indexes
    - Index on user_courses.user_id for performance
    - Index on user_courses.course_id for performance
*/

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  course_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  purchase_date timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS user_courses_user_id_idx ON public.user_courses(user_id);
CREATE INDEX IF NOT EXISTS user_courses_course_id_idx ON public.user_courses(course_id);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
DROP POLICY IF EXISTS "Users can only access purchased courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_courses;
DROP POLICY IF EXISTS "Users can purchase courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can update their own purchase records" ON public.user_courses;

-- Courses policies
CREATE POLICY "Anyone can view courses"
ON public.courses
FOR SELECT
USING (true);

CREATE POLICY "Users can only access purchased courses"
ON public.courses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_courses
    WHERE user_courses.course_id = courses.id
    AND user_courses.user_id = auth.uid()
  )
);

-- User_courses policies
CREATE POLICY "Users can view their own purchases"
ON public.user_courses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase courses"
ON public.user_courses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchase records"
ON public.user_courses
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to check if user has access to a course
CREATE OR REPLACE FUNCTION public.user_has_course_access(course_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_courses
    WHERE user_id = auth.uid()
    AND course_id = course_uuid
  );
END;
$$;

-- Function to get user's purchased courses
CREATE OR REPLACE FUNCTION public.get_user_courses()
RETURNS TABLE (
  course_id uuid,
  title text,
  description text,
  course_url text,
  purchase_date timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.course_url,
    uc.purchase_date
  FROM public.courses c
  INNER JOIN public.user_courses uc ON c.id = uc.course_id
  WHERE uc.user_id = auth.uid()
  ORDER BY uc.purchase_date DESC;
END;
$$;