import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CourseService } from '../../services/courseService';
import { CourseSection } from '../../models/Course';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface CourseRendererProps {
  section: CourseSection;
  storagePath: string;
  onSectionComplete?: (sectionId: string, timeSpent: number) => void;
  className?: string;
}

const CourseRenderer: React.FC<CourseRendererProps> = ({
  section,
  storagePath,
  onSectionComplete,
  className
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const mdxContent = await CourseService.getCourseContent(storagePath, section.file_name);
        
        // Clean up the MDX content - remove any HTML wrapper if present
        let cleanContent = mdxContent;
        
        // Remove DOCTYPE and HTML wrapper if it exists
        if (cleanContent.includes('<!DOCTYPE html>')) {
          // Extract content between <body> tags or just get the markdown part
          const bodyMatch = cleanContent.match(/<body[^>]*>(.*?)<\/body>/s);
          if (bodyMatch) {
            cleanContent = bodyMatch[1];
          }
          
          // Remove iframe and other HTML elements that shouldn't be in MDX
          cleanContent = cleanContent.replace(/<iframe[^>]*>.*?<\/iframe>/gs, '');
          cleanContent = cleanContent.replace(/<style[^>]*>.*?<\/style>/gs, '');
          cleanContent = cleanContent.replace(/<!DOCTYPE[^>]*>/g, '');
          cleanContent = cleanContent.replace(/<html[^>]*>/g, '');
          cleanContent = cleanContent.replace(/<\/html>/g, '');
          cleanContent = cleanContent.replace(/<head[^>]*>.*?<\/head>/gs, '');
          cleanContent = cleanContent.replace(/<meta[^>]*>/g, '');
        }
        
        setContent(cleanContent.trim());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        console.error('Error loading course content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [storagePath, section.file_name]);

  const handleCompleteSection = async () => {
    if (section.is_completed || isCompleting) return;

    try {
      setIsCompleting(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      // In test mode, just call the callback
      if (onSectionComplete) {
        onSectionComplete(section.id, timeSpent);
        toast.success('Section completed!');
      } else {
        // In production, this would call the actual API
        await CourseService.completeSection(section.id, timeSpent);
        toast.success('Section completed!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to complete section');
      console.error('Error completing section:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Failed to Load Content
        </h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className={clsx('max-w-none', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center mr-3',
            section.is_completed 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-blue-100 dark:bg-blue-900/30'
          )}>
            {section.is_completed ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {section.order_index}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {section.title}
            </h1>
            {section.estimated_duration && (
              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {section.estimated_duration}
              </div>
            )}
          </div>
        </div>

        {!section.is_completed && (
          <button
            onClick={handleCompleteSection}
            disabled={isCompleting}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              'bg-blue-600 hover:bg-blue-700 text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center'
            )}
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </>
            )}
          </button>
        )}
      </div>

      {/* Course Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom components for better styling
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 dark:text-gray-300">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                <div className="text-gray-700 dark:text-gray-300 italic">
                  {children}
                </div>
              </blockquote>
            ),
            code: ({ inline, children }) => (
              inline ? (
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                  {children}
                </code>
              ) : (
                <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                  {children}
                </code>
              )
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-md mb-4"
                loading="lazy"
              />
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left font-semibold text-gray-900 dark:text-white">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Completion Status */}
      {section.is_completed && section.completed_at && (
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              Completed on {new Date(section.completed_at).toLocaleDateString()}
            </span>
            {section.time_spent && section.time_spent > 0 && (
              <span className="ml-4 text-green-600 dark:text-green-400 text-sm">
                Time spent: {Math.floor(section.time_spent / 60)} minutes
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseRenderer;