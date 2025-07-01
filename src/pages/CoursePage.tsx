import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Clock, Award } from 'lucide-react';
import { CourseService } from '../services/courseService';
import { CourseWithProgress, CourseSection } from '../models/Course';
import CourseRenderer from '../components/course/CourseRenderer';
import ProgressTracker from '../components/course/ProgressTracker';
import SectionList from '../components/course/SectionList';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState<CourseWithProgress | null>(null);
  const [currentSection, setCurrentSection] = useState<CourseSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (!courseId) {
      setError('Course ID is required');
      setLoading(false);
      return;
    }

    loadCourse();
  }, [courseId, user, navigate]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await CourseService.getCourseWithProgress(courseId!);
      setCourseData(data);
      
      // Set current section to first incomplete section or first section
      const firstIncomplete = data.sections.find(section => !section.is_completed);
      setCurrentSection(firstIncomplete || data.sections[0] || null);
      
      // Start course if not already started
      if (!data.progress.started_at) {
        await CourseService.startCourse(courseId!);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course');
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionComplete = async (sectionId: string, timeSpent: number) => {
    if (!courseData) return;

    // Update local state
    setCourseData(prev => {
      if (!prev) return prev;
      
      const updatedSections = prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, is_completed: true, completed_at: new Date().toISOString(), time_spent: timeSpent }
          : section
      );
      
      const completedCount = updatedSections.filter(s => s.is_completed).length;
      const progressPercentage = Math.round((completedCount / updatedSections.length) * 100);
      
      return {
        ...prev,
        sections: updatedSections,
        progress: {
          ...prev.progress,
          completed_sections: completedCount,
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString(),
          completed_at: progressPercentage === 100 ? new Date().toISOString() : prev.progress.completed_at
        }
      };
    });

    // Move to next section if available
    const currentIndex = courseData.sections.findIndex(s => s.id === sectionId);
    const nextSection = courseData.sections[currentIndex + 1];
    if (nextSection) {
      setCurrentSection(nextSection);
    }
  };

  const handleSectionSelect = (section: CourseSection) => {
    setCurrentSection(section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Course Not Found
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'The requested course could not be found.'}
            </p>
            <button
              onClick={() => navigate('/learning')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { course, sections, progress } = courseData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/learning')}
                className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h1>
                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {course.category && (
                    <>
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span className="mr-4">{course.category}</span>
                    </>
                  )}
                  {course.difficulty_level && (
                    <>
                      <Award className="w-4 h-4 mr-1" />
                      <span className="mr-4 capitalize">{course.difficulty_level}</span>
                    </>
                  )}
                  {course.estimated_duration && (
                    <>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{course.estimated_duration}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {progress.progress_percentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProgressTracker progress={progress} sections={sections} />
            <SectionList
              sections={sections}
              currentSectionId={currentSection?.id}
              onSectionSelect={handleSectionSelect}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentSection ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <CourseRenderer
                  section={currentSection}
                  storagePath={course.storage_path}
                  onSectionComplete={handleSectionComplete}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Section Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a section from the sidebar to begin learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;