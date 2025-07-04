import { supabase } from '../lib/supabase';
import { Course, CourseWithProgress, CourseSection } from '../models/Course';

export class CourseService {
  // Get all published courses
  static async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('mdx_courses')
      .select(`
        *,
        course_categories(name)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }

    return data.map(course => ({
      ...course,
      category: course.course_categories?.name
    }));
  }

  // Get course with user progress
  static async getCourseWithProgress(courseId: string): Promise<CourseWithProgress> {
    const { data, error } = await supabase.rpc('get_course_with_progress', {
      course_uuid: courseId
    });

    if (error) {
      throw new Error(`Failed to fetch course: ${error.message}`);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  }

  // Get MDX content from Supabase Storage
  static async getCourseContent(storagePath: string, fileName: string): Promise<string> {
    // In development, try to load from local storage-samples first
    if (import.meta.env.DEV) {
      try {
        // Use the correct path structure based on our storage-samples directory
        const localPath = `/storage-samples/courses/${storagePath}/${fileName}`;
        const response = await fetch(localPath);
        
        if (response.ok) {
          const content = await response.text();
          
          // Check if we got a module export instead of raw content
          if (content.includes('export default') && content.includes('sourceMappingURL')) {
            throw new Error('Got compiled module instead of raw content');
          }
          
          console.log(`Successfully loaded content from: ${localPath}`);
          return content;
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (localError) {
        console.warn('Local file not found or invalid, trying Supabase Storage...', localError);
      }
    }

    // Fallback to Supabase Storage
    const filePath = `${storagePath}/${fileName}`;
    
    try {
      console.log(`Attempting to load from Supabase Storage: ${filePath}`);
      const { data, error } = await supabase.storage
        .from('courses')
        .download(filePath);

      if (error) {
        throw new Error(`Failed to fetch course content: ${error.message}`);
      }

      return await data.text();
    } catch (storageError) {
      throw new Error(`Failed to load content: ${storageError instanceof Error ? storageError.message : 'Unknown error'}`);
    }
  }

  // Mark section as completed
  static async completeSection(sectionId: string, timeSpent: number = 0): Promise<void> {
    const { data, error } = await supabase.rpc('complete_section', {
      section_uuid: sectionId,
      time_spent_seconds: timeSpent
    });

    if (error) {
      throw new Error(`Failed to complete section: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to complete section');
    }
  }

  // Get user's course progress
  static async getUserCourseProgress(courseId: string) {
    const { data, error } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to fetch progress: ${error.message}`);
    }

    return data;
  }

  // Start course (create initial progress record)
  static async startCourse(courseId: string): Promise<void> {
    const { error } = await supabase
      .from('user_course_progress')
      .insert({
        course_id: courseId,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error && error.code !== '23505') { // 23505 is unique constraint violation
      throw new Error(`Failed to start course: ${error.message}`);
    }
  }

  // Get user's enrolled courses
  static async getUserCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('user_course_progress')
      .select(`
        *,
        mdx_courses(
          *,
          course_categories(name)
        )
      `)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user courses: ${error.message}`);
    }

    return data.map(item => ({
      ...item.mdx_courses,
      category: item.mdx_courses.course_categories?.name,
      progress: {
        completed_sections: item.completed_sections,
        progress_percentage: item.progress_percentage,
        last_accessed_at: item.last_accessed_at,
        started_at: item.started_at,
        completed_at: item.completed_at
      }
    }));
  }

  // Search courses
  static async searchCourses(query: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('mdx_courses')
      .select(`
        *,
        course_categories(name)
      `)
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search courses: ${error.message}`);
    }

    return data.map(course => ({
      ...course,
      category: course.course_categories?.name
    }));
  }
}