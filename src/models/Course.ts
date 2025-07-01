export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  storage_path: string;
  total_sections: number;
  estimated_duration?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: string;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  file_name: string;
  order_index: number;
  estimated_duration?: string;
  created_at: string;
  is_completed?: boolean;
  completed_at?: string;
  time_spent?: number;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_sections: number;
  progress_percentage: number;
  last_accessed_at: string;
  started_at: string;
  completed_at?: string;
}

export interface UserSectionProgress {
  id: string;
  user_id: string;
  section_id: string;
  is_completed: boolean;
  completed_at?: string;
  time_spent: number;
}

export interface CourseWithProgress {
  course: Course;
  sections: CourseSection[];
  progress: UserCourseProgress;
}