import React, { useState } from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection: React.FC = () => {
  const [showFullText, setShowFullText] = useState(false);
  
  const shortText = "Master statistical modeling techniques, Leverage tailored modeling suggestions, insightful peer reviews, and thorough validation to enhance your work and obtain strategic second opinions...";
  const fullText = "Master statistical modeling techniques, Leverage tailored modeling suggestions, insightful peer reviews, and thorough validation to enhance your work and obtain strategic second opinions. Please refer to this white paper for detailed services we can offer and why we are sure it will benefit you and your company.";
  
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center mb-12">
          <span className="block">Master AI through Math&Stat</span>
          <span className="block text-blue-600 dark:text-blue-400">Model Data Correctly</span>
        </h1>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl">
              {showFullText ? fullText : shortText}
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-2 focus:outline-none"
              >
                {showFullText ? 'Read less' : 'Read more'}
              </button>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/courses'}
              >
                Browse Courses
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/about'}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-5 mt-8 lg:mt-0">
            <div className="relative mx-auto w-full h-full">
              <img
                className="w-full h-auto object-cover rounded-lg shadow-xl"
                src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Data visualization and statistical analysis"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
    </section>
  );
};

export default HeroSection;