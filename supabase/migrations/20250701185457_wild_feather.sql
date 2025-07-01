/*
  # MDX Course Learning Platform Schema

  1. New Tables
    - `course_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique, required)
      - `description` (text, optional)
      - `created_at` (timestamptz, default now)
    
    - `mdx_courses`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `category_id` (uuid, references course_categories)
      - `storage_path` (text, required - path in Supabase Storage)
      - `total_sections` (integer, default 0)
      - `estimated_duration` (text, optional)
      - `difficulty_level` (text, enum: beginner/intermediate/advanced)
      - `is_published` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

    - `course_sections`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references mdx_courses)
      - `title` (text, required)
      - `file_name` (text, required - MDX file name)
      - `order_index` (integer, required)
      - `estimated_duration` (text, optional)
      - `created_at` (timestamptz, default now)
      - Unique constraint on (course_id, order_index)

    - `user_course_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `course_id` (uuid, references mdx_courses)
      - `completed_sections` (integer, default 0)
      - `progress_percentage` (integer, 0-100, default 0)
      - `last_accessed_at` (timestamptz, default now)
      - `started_at` (timestamptz, default now)
      - `completed_at` (timestamptz, optional)
      - Unique constraint on (user_id, course_id)

    - `user_section_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `section_id` (uuid, references course_sections)
      - `is_completed` (boolean, default false)
      - `completed_at` (timestamptz, optional)
      - `time_spent` (integer, default 0 - seconds)
      - Unique constraint on (user_id, section_id)

  2. Security
    - Enable RLS on all tables
    - Course categories viewable by everyone, manageable by admins
    - Published courses viewable by authenticated users
    - Course sections viewable with their courses
    - Progress tables: users can only access their own data

  3. Functions
    - `get_course_with_progress()` - Get course with user progress
    - `complete_section()` - Mark section as completed
    - `update_course_progress()` - Trigger to update course progress

  4. Storage
    - Create 'courses' bucket for MDX files
    - RLS policies for course file access

  5. Sample Data
    - Sample categories and courses with sections
*/

-- Create course_categories table
CREATE TABLE IF NOT EXISTS public.course_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create mdx_courses table
CREATE TABLE IF NOT EXISTS public.mdx_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES public.course_categories(id) ON DELETE SET NULL,
  storage_path text NOT NULL,
  total_sections integer DEFAULT 0,
  estimated_duration text,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_sections table
CREATE TABLE IF NOT EXISTS public.course_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.mdx_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_name text NOT NULL,
  order_index integer NOT NULL,
  estimated_duration text,
  created_at timestamptz DEFAULT now(),
  
  -- Unique constraint to prevent duplicate order within a course
  UNIQUE(course_id, order_index)
);

-- Create user_course_progress table
CREATE TABLE IF NOT EXISTS public.user_course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.mdx_courses(id) ON DELETE CASCADE,
  completed_sections integer DEFAULT 0,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at timestamptz DEFAULT now(),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  
  -- Unique constraint to ensure one progress record per user per course
  UNIQUE(user_id, course_id)
);

-- Create user_section_progress table
CREATE TABLE IF NOT EXISTS public.user_section_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  time_spent integer DEFAULT 0,
  
  -- Unique constraint to ensure one progress record per user per section
  UNIQUE(user_id, section_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS mdx_courses_category_id_idx ON public.mdx_courses(category_id);
CREATE INDEX IF NOT EXISTS mdx_courses_published_idx ON public.mdx_courses(is_published);
CREATE INDEX IF NOT EXISTS course_sections_course_id_idx ON public.course_sections(course_id);
CREATE INDEX IF NOT EXISTS course_sections_order_idx ON public.course_sections(course_id, order_index);
CREATE INDEX IF NOT EXISTS user_course_progress_user_id_idx ON public.user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS user_course_progress_course_id_idx ON public.user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS user_section_progress_user_id_idx ON public.user_section_progress(user_id);
CREATE INDEX IF NOT EXISTS user_section_progress_section_id_idx ON public.user_section_progress(section_id);

-- Enable RLS
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mdx_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_section_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Course categories are viewable by everyone" ON public.course_categories;
DROP POLICY IF EXISTS "Only admins can manage course categories" ON public.course_categories;
DROP POLICY IF EXISTS "Published courses are viewable by authenticated users" ON public.mdx_courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON public.mdx_courses;
DROP POLICY IF EXISTS "Only admins can manage courses" ON public.mdx_courses;
DROP POLICY IF EXISTS "Course sections are viewable with their courses" ON public.course_sections;
DROP POLICY IF EXISTS "Only admins can manage course sections" ON public.course_sections;
DROP POLICY IF EXISTS "Users can view their own course progress" ON public.user_course_progress;
DROP POLICY IF EXISTS "Users can update their own course progress" ON public.user_course_progress;
DROP POLICY IF EXISTS "Admins can view all course progress" ON public.user_course_progress;
DROP POLICY IF EXISTS "Users can view their own section progress" ON public.user_section_progress;
DROP POLICY IF EXISTS "Users can update their own section progress" ON public.user_section_progress;
DROP POLICY IF EXISTS "Admins can view all section progress" ON public.user_section_progress;

-- RLS Policies for course_categories
CREATE POLICY "Course categories are viewable by everyone"
ON public.course_categories
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage course categories"
ON public.course_categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- RLS Policies for mdx_courses
CREATE POLICY "Published courses are viewable by authenticated users"
ON public.mdx_courses
FOR SELECT
USING (is_published = true AND auth.role() = 'authenticated');

CREATE POLICY "Admins can view all courses"
ON public.mdx_courses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can manage courses"
ON public.mdx_courses
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- RLS Policies for course_sections
CREATE POLICY "Course sections are viewable with their courses"
ON public.course_sections
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mdx_courses
    WHERE mdx_courses.id = course_sections.course_id
    AND (
      mdx_courses.is_published = true
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    )
  )
);

CREATE POLICY "Only admins can manage course sections"
ON public.course_sections
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- RLS Policies for user_course_progress
CREATE POLICY "Users can view their own course progress"
ON public.user_course_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress"
ON public.user_course_progress
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all course progress"
ON public.user_course_progress
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- RLS Policies for user_section_progress
CREATE POLICY "Users can view their own section progress"
ON public.user_section_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own section progress"
ON public.user_section_progress
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all section progress"
ON public.user_section_progress
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Function to update course progress when section is completed
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS trigger AS $$
DECLARE
  total_sections_count integer;
  completed_sections_count integer;
  new_progress_percentage integer;
BEGIN
  -- Only proceed if section was marked as completed
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    -- Get total sections for the course
    SELECT COUNT(*)
    INTO total_sections_count
    FROM public.course_sections cs
    JOIN public.mdx_courses mc ON cs.course_id = mc.id
    WHERE cs.id = NEW.section_id;
    
    -- Get completed sections count for this user and course
    SELECT COUNT(*)
    INTO completed_sections_count
    FROM public.user_section_progress usp
    JOIN public.course_sections cs ON usp.section_id = cs.id
    WHERE usp.user_id = NEW.user_id
    AND cs.course_id = (
      SELECT course_id FROM public.course_sections WHERE id = NEW.section_id
    )
    AND usp.is_completed = true;
    
    -- Calculate progress percentage
    IF total_sections_count > 0 THEN
      new_progress_percentage := (completed_sections_count * 100) / total_sections_count;
    ELSE
      new_progress_percentage := 0;
    END IF;
    
    -- Update or insert course progress
    INSERT INTO public.user_course_progress (
      user_id,
      course_id,
      completed_sections,
      progress_percentage,
      last_accessed_at,
      completed_at
    )
    SELECT 
      NEW.user_id,
      cs.course_id,
      completed_sections_count,
      new_progress_percentage,
      now(),
      CASE WHEN new_progress_percentage = 100 THEN now() ELSE NULL END
    FROM public.course_sections cs
    WHERE cs.id = NEW.section_id
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET
      completed_sections = completed_sections_count,
      progress_percentage = new_progress_percentage,
      last_accessed_at = now(),
      completed_at = CASE WHEN new_progress_percentage = 100 THEN now() ELSE user_course_progress.completed_at END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating course progress
DROP TRIGGER IF EXISTS update_course_progress_trigger ON public.user_section_progress;
CREATE TRIGGER update_course_progress_trigger
  AFTER INSERT OR UPDATE ON public.user_section_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_progress();

-- Function to get course with user progress
CREATE OR REPLACE FUNCTION public.get_course_with_progress(course_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  course_data json;
  sections_data json;
  progress_data json;
BEGIN
  -- Check if user is authenticated
  IF auth.role() != 'authenticated' THEN
    RETURN json_build_object('error', 'Authentication required');
  END IF;
  
  -- Get course data
  SELECT json_build_object(
    'id', mc.id,
    'title', mc.title,
    'description', mc.description,
    'storage_path', mc.storage_path,
    'total_sections', mc.total_sections,
    'estimated_duration', mc.estimated_duration,
    'difficulty_level', mc.difficulty_level,
    'category', cc.name
  )
  INTO course_data
  FROM public.mdx_courses mc
  LEFT JOIN public.course_categories cc ON mc.category_id = cc.id
  WHERE mc.id = course_uuid
  AND mc.is_published = true;
  
  IF course_data IS NULL THEN
    RETURN json_build_object('error', 'Course not found or not published');
  END IF;
  
  -- Get sections with user progress
  SELECT json_agg(
    json_build_object(
      'id', cs.id,
      'title', cs.title,
      'file_name', cs.file_name,
      'order_index', cs.order_index,
      'estimated_duration', cs.estimated_duration,
      'is_completed', COALESCE(usp.is_completed, false),
      'completed_at', usp.completed_at,
      'time_spent', COALESCE(usp.time_spent, 0)
    )
    ORDER BY cs.order_index
  )
  INTO sections_data
  FROM public.course_sections cs
  LEFT JOIN public.user_section_progress usp ON cs.id = usp.section_id AND usp.user_id = auth.uid()
  WHERE cs.course_id = course_uuid;
  
  -- Get overall course progress
  SELECT json_build_object(
    'completed_sections', COALESCE(ucp.completed_sections, 0),
    'progress_percentage', COALESCE(ucp.progress_percentage, 0),
    'last_accessed_at', ucp.last_accessed_at,
    'started_at', ucp.started_at,
    'completed_at', ucp.completed_at
  )
  INTO progress_data
  FROM public.user_course_progress ucp
  WHERE ucp.user_id = auth.uid() AND ucp.course_id = course_uuid;
  
  IF progress_data IS NULL THEN
    progress_data := json_build_object(
      'completed_sections', 0,
      'progress_percentage', 0,
      'last_accessed_at', null,
      'started_at', null,
      'completed_at', null
    );
  END IF;
  
  RETURN json_build_object(
    'course', course_data,
    'sections', COALESCE(sections_data, '[]'::json),
    'progress', progress_data
  );
END;
$$;

-- Function to mark section as completed
CREATE OR REPLACE FUNCTION public.complete_section(section_uuid uuid, time_spent_seconds integer DEFAULT 0)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.role() != 'authenticated' THEN
    RETURN json_build_object('success', false, 'error', 'Authentication required');
  END IF;
  
  -- Insert or update section progress
  INSERT INTO public.user_section_progress (
    user_id,
    section_id,
    is_completed,
    completed_at,
    time_spent
  )
  VALUES (
    auth.uid(),
    section_uuid,
    true,
    now(),
    time_spent_seconds
  )
  ON CONFLICT (user_id, section_id)
  DO UPDATE SET
    is_completed = true,
    completed_at = now(),
    time_spent = user_section_progress.time_spent + time_spent_seconds;
  
  RETURN json_build_object('success', true, 'message', 'Section marked as completed');
END;
$$;

-- Create storage bucket for courses
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'courses',
  'courses',
  false, -- Private bucket, access controlled by RLS
  10485760, -- 10MB limit
  ARRAY['text/markdown', 'text/plain', 'application/octet-stream']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can read course files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage course files" ON storage.objects;

-- Storage policies for courses
CREATE POLICY "Authenticated users can read course files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'courses'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admins can manage course files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'courses'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Insert sample data
INSERT INTO public.course_categories (id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Statistics', 'Statistical analysis and methods'),
('550e8400-e29b-41d4-a716-446655440002', 'Machine Learning', 'Machine learning algorithms and applications'),
('550e8400-e29b-41d4-a716-446655440003', 'Data Science', 'Data science fundamentals and practices')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mdx_courses (id, title, description, category_id, storage_path, total_sections, estimated_duration, difficulty_level, is_published) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Introduction to Statistics', 'Learn the fundamentals of statistical analysis', '550e8400-e29b-41d4-a716-446655440001', 'intro-statistics', 5, '2 hours', 'beginner', true),
('550e8400-e29b-41d4-a716-446655440011', 'Machine Learning Basics', 'Get started with machine learning concepts', '550e8400-e29b-41d4-a716-446655440002', 'ml-basics', 8, '4 hours', 'intermediate', true),
('550e8400-e29b-41d4-a716-446655440012', 'Advanced Data Analysis', 'Deep dive into advanced data analysis techniques', '550e8400-e29b-41d4-a716-446655440003', 'advanced-data-analysis', 12, '6 hours', 'advanced', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_sections (course_id, title, file_name, order_index, estimated_duration) VALUES
-- Introduction to Statistics sections
('550e8400-e29b-41d4-a716-446655440010', 'What is Statistics?', 'intro.mdx', 1, '20 minutes'),
('550e8400-e29b-41d4-a716-446655440010', 'Descriptive Statistics', 'descriptive-stats.mdx', 2, '25 minutes'),
('550e8400-e29b-41d4-a716-446655440010', 'Probability Basics', 'probability.mdx', 3, '30 minutes'),
('550e8400-e29b-41d4-a716-446655440010', 'Distributions', 'distributions.mdx', 4, '25 minutes'),
('550e8400-e29b-41d4-a716-446655440010', 'Hypothesis Testing', 'hypothesis-testing.mdx', 5, '20 minutes'),

-- Machine Learning Basics sections
('550e8400-e29b-41d4-a716-446655440011', 'Introduction to ML', 'intro.mdx', 1, '25 minutes'),
('550e8400-e29b-41d4-a716-446655440011', 'Supervised Learning', 'supervised-learning.mdx', 2, '30 minutes'),
('550e8400-e29b-41d4-a716-446655440011', 'Unsupervised Learning', 'unsupervised-learning.mdx', 3, '30 minutes'),
('550e8400-e29b-41d4-a716-446655440011', 'Model Evaluation', 'model-evaluation.mdx', 4, '25 minutes'),
('550e8400-e29b-41d4-a716-446655440011', 'Feature Engineering', 'feature-engineering.mdx', 5, '35 minutes'),
('550e8400-e29b-41d4-a716-446655440011', 'Cross Validation', 'cross-validation.mdx', 6, '20 minutes'),
('550e8400-e29b-41d4-a716-446655440011', 'Overfitting and Regularization', 'overfitting.mdx', 7, '30 minutes'),
('550e8400-e29b-41d4-a716-446655440011', 'Practical Applications', 'applications.mdx', 8, '25 minutes'),

-- Advanced Data Analysis sections
('550e8400-e29b-41d4-a716-446655440012', 'Advanced Statistical Methods', 'advanced-stats.mdx', 1, '35 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Time Series Analysis', 'time-series.mdx', 2, '40 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Multivariate Analysis', 'multivariate.mdx', 3, '35 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Bayesian Methods', 'bayesian.mdx', 4, '45 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Experimental Design', 'experimental-design.mdx', 5, '30 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Causal Inference', 'causal-inference.mdx', 6, '40 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Big Data Analytics', 'big-data.mdx', 7, '35 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Machine Learning at Scale', 'ml-scale.mdx', 8, '40 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Deep Learning Fundamentals', 'deep-learning.mdx', 9, '45 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Natural Language Processing', 'nlp.mdx', 10, '35 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Computer Vision', 'computer-vision.mdx', 11, '40 minutes'),
('550e8400-e29b-41d4-a716-446655440012', 'Capstone Project', 'capstone.mdx', 12, '30 minutes')
ON CONFLICT (course_id, order_index) DO NOTHING;