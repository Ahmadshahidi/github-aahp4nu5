import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ExternalLink } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface UserCourse {
  course_id: string;
  title: string;
  description: string | null;
  course_url: string;
  purchase_date: string;
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserCourses();
  }, []);

  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_user_courses');

      if (error) {
        throw error;
      }

      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching user courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessCourse = (courseUrl: string) => {
    window.open(courseUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={fetchUserCourses} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Courses Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven't purchased any courses yet. Browse our course catalog to get started!
        </p>
        <Button 
          variant="primary"
          onClick={() => window.location.href = '/courses'}
        >
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Courses ({courses.length})
        </h2>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/courses'}
        >
          Browse More Courses
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.course_id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {course.description}
                    </p>
                  )}
                </div>
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-4" />
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Purchased on {new Date(course.purchase_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={() => handleAccessCourse(course.course_url)}
                className="flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Access Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;