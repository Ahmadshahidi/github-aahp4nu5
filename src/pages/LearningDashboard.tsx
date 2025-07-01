import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Search, Filter, Play, CheckCircle } from 'lucide-react';
import { CourseService } from '../services/courseService';
import { Course } from '../models/Course';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import clsx from 'clsx';

interface CourseCardProps {
  course: Course & { progress?: any };
  onStartCourse: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onStartCourse }) => {
  const navigate = useNavigate();
  const hasProgress = course.progress && course.progress.started_at;
  const isCompleted = course.progress?.progress_percentage === 100;

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty_level)}`}>
                {course.difficulty_level}
              </span>
              {course.category && (
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                  {course.category}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {course.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
              {course.description}
            </p>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <BookOpen className="w-4 h-4 mr-1" />
          <span className="mr-4">{course.total_sections} sections</span>
          {course.estimated_duration && (
            <>
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.estimated_duration}</span>
            </>
          )}
        </div>

        {hasProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {course.progress.progress_percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress.progress_percentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant={hasProgress ? "outline" : "primary"}
            onClick={() => hasProgress ? navigate(`/learning/course/${course.id}`) : onStartCourse(course.id)}
            className={clsx(
              "flex items-center",
              hasProgress 
                ? "border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Review
              </>
            ) : hasProgress ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Continue
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Course
              </>
            )}
          </Button>

          {isCompleted && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Award className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const LearningDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allCourses, enrolledCourses] = await Promise.all([
        CourseService.getCourses(),
        CourseService.getUserCourses()
      ]);
      
      setCourses(allCourses);
      setUserCourses(enrolledCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = async (courseId: string) => {
    try {
      await CourseService.startCourse(courseId);
      navigate(`/learning/course/${courseId}`);
    } catch (error) {
      console.error('Error starting course:', error);
    }
  };

  const filteredCourses = (activeTab === 'enrolled' ? userCourses : courses).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Learning Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Continue your learning journey with our comprehensive courses
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Available Courses</div>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userCourses.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Enrolled Courses</div>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userCourses.filter(c => c.progress?.progress_percentage === 100).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('all')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'all'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'enrolled'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            My Courses
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onStartCourse={handleStartCourse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'enrolled' 
                ? "You haven't enrolled in any courses yet."
                : "No courses match your search criteria."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningDashboard;