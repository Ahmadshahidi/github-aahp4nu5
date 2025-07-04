import React, { useState } from 'react';
import CourseRenderer from '../components/course/CourseRenderer';
import { CourseSection } from '../models/Course';
import { BookOpen, Play, CheckCircle } from 'lucide-react';

const TestCourseRenderer: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Sample course sections based on the storage-samples directory structure
  const sampleSections: CourseSection[] = [
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

  const handleSectionComplete = (sectionId: string, timeSpent: number) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    console.log(`Section ${sectionId} completed in ${timeSpent} seconds`);
  };

  const handleSectionSelect = (section: CourseSection) => {
    setSelectedSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Course Renderer Test
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Testing CourseRenderer component with sample MDX content
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Section List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sample Sections
              </h3>
              <div className="space-y-2">
                {sampleSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionSelect(section)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedSection?.id === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
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
                          {section.estimated_duration}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedSection ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <CourseRenderer
                  section={selectedSection}
                  storagePath={`courses/${selectedSection.course_id}`}
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

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How to Test
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Select a section from the sidebar to load its MDX content
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              The CourseRenderer will attempt to load content from the storage-samples directory
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Click "Mark Complete\" to test the completion functionality
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Check the browser console for any errors or debug information
            </li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Debug Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Selected Section:</strong>
              <pre className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border text-xs overflow-auto">
                {selectedSection ? JSON.stringify(selectedSection, null, 2) : 'None'}
              </pre>
            </div>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Completed Sections:</strong>
              <pre className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border text-xs overflow-auto">
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