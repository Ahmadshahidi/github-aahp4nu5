import React from 'react';
import { CheckCircle, Clock, Play, Lock } from 'lucide-react';
import { CourseSection } from '../../models/Course';
import clsx from 'clsx';

interface SectionListProps {
  sections: CourseSection[];
  currentSectionId?: string;
  onSectionSelect: (section: CourseSection) => void;
  className?: string;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  currentSectionId,
  onSectionSelect,
  className
}) => {
  const canAccessSection = (section: CourseSection, index: number) => {
    // First section is always accessible
    if (index === 0) return true;
    
    // Can access if previous section is completed
    const previousSection = sections[index - 1];
    return previousSection?.is_completed || false;
  };

  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-lg', className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Course Sections
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {sections.filter(s => s.is_completed).length} of {sections.length} completed
        </p>
      </div>

      <div className="p-2">
        {sections.map((section, index) => {
          const isAccessible = canAccessSection(section, index);
          const isCurrent = section.id === currentSectionId;
          const isCompleted = section.is_completed;

          return (
            <button
              key={section.id}
              onClick={() => isAccessible && onSectionSelect(section)}
              disabled={!isAccessible}
              className={clsx(
                'w-full text-left p-3 rounded-lg mb-2 transition-all duration-200',
                'flex items-center justify-between group',
                {
                  'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700': isCurrent,
                  'hover:bg-gray-50 dark:hover:bg-gray-700': !isCurrent && isAccessible,
                  'bg-green-50 dark:bg-green-900/20': isCompleted && !isCurrent,
                  'opacity-50 cursor-not-allowed': !isAccessible,
                  'cursor-pointer': isAccessible
                }
              )}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 mr-3">
                  {isCompleted ? (
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  ) : isAccessible ? (
                    <div className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      isCurrent 
                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    )}>
                      {isCurrent ? (
                        <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          {section.order_index}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={clsx(
                    'font-medium truncate',
                    {
                      'text-blue-900 dark:text-blue-100': isCurrent,
                      'text-green-800 dark:text-green-200': isCompleted && !isCurrent,
                      'text-gray-900 dark:text-white': !isCurrent && !isCompleted && isAccessible,
                      'text-gray-500 dark:text-gray-500': !isAccessible
                    }
                  )}>
                    {section.title}
                  </h4>
                  
                  {section.estimated_duration && (
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {section.estimated_duration}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isCompleted && section.completed_at && (
                <div className="flex-shrink-0 ml-2">
                  <span className="text-xs text-green-600 dark:text-green-400">
                    {new Date(section.completed_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round((sections.filter(s => s.is_completed).length / sections.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(sections.filter(s => s.is_completed).length / sections.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionList;