import React, { useState, useEffect } from 'react';
import CourseRenderer from '../components/course/CourseRenderer';
import { CourseSection } from '../models/Course';
import { BookOpen, Play, CheckCircle, Settings, Database, Folder, RefreshCw } from 'lucide-react';
import { CourseService } from '../services/courseService';
import clsx from 'clsx';

type StorageMode = 'local' | 'supabase';

const TestCourseRenderer: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [storageMode, setStorageMode] = useState<StorageMode>('local');
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample course sections based on the storage-samples directory structure
  const localSampleSections: CourseSection[] = [
    {
      id: 'intro-stats-1',
      course_id: 'intro-statistics', 
      title: 'What is Statistics?',
      file_name: 'intro.mdx',
      order_index: 1,
      estimated_duration: '20 minutes',
      created_at: new Date().toISOString(),
      is_completed: completedSections.has('intro-stats-1'),
      completed_at: completedSections.has('intro-stats-1') ? new Date().toISOString() : undefined,
      time_spent: 0
    },
    {
      id: 'intro-stats-2',
      course_id: 'intro-statistics',
      title: 'Descriptive Statistics',
      file_name: 'descriptive-stats.mdx',
      order_index: 2,
      estimated_duration: '25 minutes',
      created_at: new Date().toISOString(),
      is_completed: completedSections.has('intro-stats-2'),
      completed_at: completedSections.has('intro-stats-2') ? new Date().toISOString() : undefined,
      time_spent: 0
    },
    {
      id: 'ml-basics-1',
      course_id: 'ml-basics',
      title: 'Introduction to Machine Learning',
      file_name: 'intro.mdx',
      order_index: 1,
      estimated_duration: '25 minutes',
      created_at: new Date().toISOString(),
      is_completed: completedSections.has('ml-basics-1'),
      completed_at: completedSections.has('ml-basics-1') ? new Date().toISOString() : undefined,
      time_spent: 0
    },
    {
      id: 'advanced-data-1',
      course_id: 'advanced-data-analysis',
      title: 'Advanced Statistical Methods',
      file_name: 'advanced-stats.mdx',
      order_index: 1,
      estimated_duration: '35 minutes',
      created_at: new Date().toISOString(),
      is_completed: completedSections.has('advanced-data-1'),
      completed_at: completedSections.has('advanced-data-1') ? new Date().toISOString() : undefined,
      time_spent: 0
    }
  ];

  const [currentSections, setCurrentSections] = useState<CourseSection[]>(localSampleSections);

  useEffect(() => {
    if (storageMode === 'supabase') {
      loadSupabaseCourses();
    } else {
      setCurrentSections(localSampleSections);
      setError(null);
    }
  }, [storageMode]);

  const loadSupabaseCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load courses from Supabase
      const courses = await CourseService.getCourses();
      setAvailableCourses(courses);
      
      if (courses.length > 0) {
        // Load sections for the first course
        const firstCourse = courses[0];
        const courseWithProgress = await CourseService.getCourseWithProgress(firstCourse.id);
        setCurrentSections(courseWithProgress.sections);
      } else {
        setCurrentSections([]);
        setError('No courses found in Supabase. Please ensure courses are properly set up in your database.');
      }
    } catch (err) {
      console.error('Error loading Supabase courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load courses from Supabase');
      setCurrentSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionComplete = (sectionId: string, timeSpent: number) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    console.log(`Section ${sectionId} completed in ${timeSpent} seconds`);
  };

  const handleSectionSelect = (section: CourseSection) => {
    setSelectedSection(section);
  };

  const handleModeSwitch = (mode: StorageMode) => {
    setStorageMode(mode);
    setSelectedSection(null);
    setError(null);
  };

  const refreshSupabaseData = () => {
    if (storageMode === 'supabase') {
      loadSupabaseCourses();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Course Renderer Test
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Testing CourseRenderer component with {storageMode === 'local' ? 'local samples' : 'Supabase Storage'}
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Mode:</span>
              </div>
              
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => handleModeSwitch('local')}
                  className={clsx(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    storageMode === 'local'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  )}
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Local Samples
                </button>
                <button
                  onClick={() => handleModeSwitch('supabase')}
                  className={clsx(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    storageMode === 'supabase'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  )}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Supabase Storage
                </button>
              </div>

              {storageMode === 'supabase' && (
                <button
                  onClick={refreshSupabaseData}
                  disabled={loading}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <RefreshCw className={clsx('w-4 h-4 mr-2', loading && 'animate-spin')} />
                  Refresh
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading courses from Supabase...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Content
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            {storageMode === 'supabase' && (
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="mb-2">Possible solutions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure your Supabase project is properly configured</li>
                  <li>Check that the database migrations have been applied</li>
                  <li>Verify that sample courses exist in the mdx_courses table</li>
                  <li>Try switching to "Local Samples" mode to test with local files</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Section List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {storageMode === 'local' ? 'Sample Sections' : 'Course Sections'}
                  </h3>
                  <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {currentSections.length} sections
                  </div>
                </div>

                {/* Supabase Course Selector */}
                {storageMode === 'supabase' && availableCourses.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Course:
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      onChange={async (e) => {
                        const courseId = e.target.value;
                        if (courseId) {
                          try {
                            setLoading(true);
                            const courseWithProgress = await CourseService.getCourseWithProgress(courseId);
                            setCurrentSections(courseWithProgress.sections);
                            setSelectedSection(null);
                          } catch (err) {
                            setError(err instanceof Error ? err.message : 'Failed to load course sections');
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                    >
                      {availableCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  {currentSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionSelect(section)}
                      className={clsx(
                        'w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group',
                        selectedSection?.id === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 mr-3">
                          {section.is_completed ? (
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <Play className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {section.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {section.estimated_duration} • {section.course_id}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {currentSections.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {storageMode === 'supabase' ? 'No courses available' : 'No sections available'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedSection ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <CourseRenderer
                    section={selectedSection}
                    storagePath={selectedSection.course_id}
                    onSectionComplete={handleSectionComplete}
                    className="p-8"
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a Section
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a section from the sidebar to test the CourseRenderer component.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How to Test
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Local Samples Mode</h4>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Uses sample MDX files from the public/storage-samples directory
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  No database connection required
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Perfect for testing the CourseRenderer component
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Supabase Storage Mode</h4>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Loads courses and sections from your Supabase database
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tests the full integration with CourseService
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Requires proper database setup and authentication
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Debug Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Storage Mode:</strong>
              <pre className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border text-xs">
                {storageMode}
              </pre>
            </div>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Selected Section:</strong>
              <pre className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border text-xs overflow-auto max-h-32">
                {selectedSection ? JSON.stringify(selectedSection, null, 2) : 'None'}
              </pre>
            </div>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Available Courses:</strong>
              <pre className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border text-xs overflow-auto max-h-32">
                {JSON.stringify(availableCourses.map(c => ({ id: c.id, title: c.title })), null, 2)}
              </pre>
            </div>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Completed Sections:</strong>
              <pre className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border text-xs overflow-auto max-h-32">
                {JSON.stringify(Array.from(completedSections), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCourseRenderer;