import React from 'react';

const TestCourseRenderer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Test Course Renderer
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            This is a test page for course rendering functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestCourseRenderer;