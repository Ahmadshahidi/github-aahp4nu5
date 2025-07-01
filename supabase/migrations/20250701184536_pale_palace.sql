/*
  # Content Management System Schema

  1. New Tables
    - `content_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `category` (text) - enum: 'course', 'notebook', 'blog'
      - `status` (text) - enum: 'draft', 'published'
      - `author_id` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `published_at` (timestamptz)
      - `last_edited_at` (timestamptz)

  2. Security
    - Enable RLS on content_items table
    - Policies:
      - Everyone can view published content
      - Only admins can create/update/delete content
      - Only admins can view drafts
*/

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE content_category AS ENUM ('course', 'notebook', 'blog');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create content_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category content_category NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  last_edited_at timestamptz DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED
);

-- Create index for full-text search if it doesn't exist
CREATE INDEX IF NOT EXISTS content_items_search_idx ON content_items USING gin(search_vector);

-- Enable RLS
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON public.content_items;
DROP POLICY IF EXISTS "Only admins can view drafts" ON public.content_items;
DROP POLICY IF EXISTS "Only admins can create content" ON public.content_items;
DROP POLICY IF EXISTS "Only admins can update content" ON public.content_items;
DROP POLICY IF EXISTS "Only admins can delete content" ON public.content_items;

-- Policies for content_items
CREATE POLICY "Published content is viewable by everyone"
ON public.content_items
FOR SELECT
USING (status = 'published');

CREATE POLICY "Only admins can view drafts"
ON public.content_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can create content"
ON public.content_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can update content"
ON public.content_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can delete content"
ON public.content_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);