import React, { useState } from 'react';
import Button from '../ui/Button';
import { TrendingUp, BarChart3, Brain, ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [showFullText, setShowFullText] = useState(false);
  
  const shortText = "Master statistical modeling techniques, leverage tailored modeling suggestions, insightful peer reviews, and thorough validation to enhance your work and obtain strategic second opinions...";
  const fullText = "Master statistical modeling techniques, leverage tailored modeling suggestions, insightful peer reviews, and thorough validation to enhance your work and obtain strategic second opinions. Please refer to this white paper for detailed services we can offer and why we are sure it will benefit you and your company.";
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center min-h-[80vh]">
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Advanced Statistical Learning Platform
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
              <span className="block">Master AI through</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Math & Statistics
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2 text-gray-300">
                Model Data Correctly
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
              {showFullText ? fullText : shortText}
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-blue-400 hover:text-blue-300 font-medium ml-2 focus:outline-none transition-colors duration-200 underline decoration-blue-400/50 hover:decoration-blue-300"
              >
                {showFullText ? 'Read less' : 'Read more'}
              </button>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/courses'}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Browse Courses
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/consultation'}
                className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold transition-all duration-300 hover:border-white/40"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-gray-400 text-sm">Students Trained</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-gray-400 text-sm">Expert Instructors</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual elements */}
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <div className="relative">
              {/* Main image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-auto object-cover"
                  src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Data visualization and statistical analysis"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transform scale-110"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </section>
  );
};

export default HeroSection;