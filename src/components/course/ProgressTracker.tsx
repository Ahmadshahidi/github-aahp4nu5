import React from 'react';
import { CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';
import { UserCourseProgress, CourseSection } from '../../models/Course';
import clsx from 'clsx';

interface ProgressTrackerProps {
  progress: UserCourseProgress;
  sections: CourseSection[];
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  sections,
  className
}) => {
  const completedSections = sections.filter(section => section.is_completed);
  const totalSections = sections.length;
  const progressPercentage = progress.progress_percentage || 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Course Progress
        </h3>
        {progressPercentage === 100 && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Award className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Completed!</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className={clsx('text-sm font-bold', getProgressColor(progressPercentage))}>
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={clsx(
              'h-3 rounded-full transition-all duration-500 ease-out',
              getProgressBgColor(progressPercentage)
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {completedSections.length}
            </span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Completed
          </span>
        </div>

        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {totalSections}
            </span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Sections
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Timeline
        </h4>
        
        {progress.started_at && (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">
              Started: {new Date(progress.started_at).toLocaleDateString()}
            </span>
          </div>
        )}

        {progress.last_accessed_at && (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">
              Last accessed: {new Date(progress.last_accessed_at).toLocaleDateString()}
            </span>
          </div>
        )}

        {progress.completed_at && (
          <div className="flex items-center text-sm">
            <Award className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-green-600 dark:text-green-400 font-medium">
              Completed: {new Date(progress.completed_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {progressPercentage < 100 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Next Steps
          </h4>
          {(() => {
            const nextSection = sections.find(section => !section.is_completed);
            if (nextSection) {
              return (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Continue with: <span className="font-medium">{nextSection.title}</span>
                </div>
              );
            }
            return (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                All sections completed! 🎉
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;