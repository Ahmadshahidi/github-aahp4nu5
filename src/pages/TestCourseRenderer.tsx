import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseRenderer from '../components/course/CourseRenderer';
import { CourseSection } from '../models/Course';

const TestCourseRenderer: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSample, setSelectedSample] = useState<string>('intro-statistics');
  const [selectedSection, setSelectedSection] = useState<string>('intro.mdx');

  // Sample course sections based on storage-samples
  const sampleSections: Record<string, CourseSection[]> = {
    'intro-statistics': [
      {
        id: 'section-1',
        course_id: 'test-course',
        title: 'What is Statistics?',
        file_name: 'intro.mdx',
        order_index: 1,
        estimated_duration: '20 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      },
      {
        id: 'section-2',
        course_id: 'test-course',
        title: 'Descriptive Statistics',
        file_name: 'descriptive-stats.mdx',
        order_index: 2,
        estimated_duration: '25 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      }
    ],
    'ml-basics': [
      {
        id: 'section-3',
        course_id: 'test-course-2',
        title: 'Introduction to Machine Learning',
        file_name: 'intro.mdx',
        order_index: 1,
        estimated_duration: '25 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      }
    ],
    'advanced-data-analysis': [
      {
        id: 'section-4',
        course_id: 'test-course-3',
        title: 'Advanced Statistical Methods',
        file_name: 'advanced-stats.mdx',
        order_index: 1,
        estimated_duration: '35 minutes',
        created_at: new Date().toISOString(),
        is_completed: false
      }
    ]
  };

  const currentSection = sampleSections[selectedSample]?.find(
    section => section.file_name === selectedSection
  );

  const handleSectionComplete = (sectionId: string, timeSpent: number) => {
    console.log(`Section ${sectionId} completed in ${timeSpent} seconds`);
    alert(`Section completed! Time spent: ${Math.floor(timeSpent / 60)} minutes`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  CourseRenderer Test
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Testing with storage-samples MDX files
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Sample Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Sample Course
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course
                  </label>
                  <select
                    value={selectedSample}
                    onChange={(e) => {
                      setSelectedSample(e.target.value);
                      setSelectedSection(sampleSections[e.target.value]?.[0]?.file_name || '');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="intro-statistics">Introduction to Statistics</option>
                    <option value="ml-basics">Machine Learning Basics</option>
                    <option value="advanced-data-analysis">Advanced Data Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {sampleSections[selectedSample]?.map((section) => (
                      <option key={section.id} value={section.file_name}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Storage Path
                </h4>
                <code className="text-xs text-blue-700 dark:text-blue-300 break-all">
                  storage-samples/courses/{selectedSample}/{selectedSection}
                </code>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Note
                </h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  This test uses local storage-samples files. In production, these would be stored in Supabase Storage.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - CourseRenderer */}
          <div className="lg:col-span-3">
            {currentSection ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <CourseRenderer
                  section={currentSection}
                  storagePath={`storage-samples/courses/${selectedSample}`}
                  onSectionComplete={handleSectionComplete}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No section selected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How to Test CourseRenderer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Available Sample Files:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <code>intro-statistics/intro.mdx</code> - Basic statistics introduction</li>
                <li>• <code>intro-statistics/descriptive-stats.mdx</code> - Descriptive statistics</li>
                <li>• <code>ml-basics/intro.mdx</code> - Machine learning introduction</li>
                <li>• <code>advanced-data-analysis/advanced-stats.mdx</code> - Advanced methods</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Features to Test:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• MDX content rendering with custom components</li>
                <li>• Section completion tracking</li>
                <li>• Progress indicators</li>
                <li>• Responsive design</li>
                <li>• Dark mode support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCourseRenderer;