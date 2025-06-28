import React, { useState } from 'react';
import { GraduationCap, Clock, Star, Users, BookOpen, Award, TrendingUp, Target } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useStripe } from '../hooks/useStripe';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import AuthForm from '../components/auth/AuthForm';
import { X } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  imageUrl: string;
  price: string;
  instructor: string;
  skills: string[];
  courseId: string;
  setAuthMode: (mode: 'signin' | 'signup') => void;
  setShowAuthModal: (show: boolean) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  level,
  enrolled,
  rating,
  imageUrl,
  price,
  instructor,
  skills,
  courseId,
  setAuthMode,
  setShowAuthModal,
}) => {
  const { createCheckoutSession, loading } = useStripe();
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  const handleEnrollClick = () => {
    if (!user) {
      setAuthMode('signin');
      setShowAuthModal(true);
      return;
    }

    // If user has active subscription, they can access all courses
    if (hasActiveSubscription()) {
      // Redirect to course content or show access granted message
      alert('You already have access to all courses with your membership!');
      return;
    }

    // Create checkout session for individual course purchase
    createCheckoutSession('course', {
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
      cancelUrl: `${window.location.origin}/courses`
    });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(level)}`}>
            {level}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 shadow-lg">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{price}</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Instructor: {instructor}</p>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-md">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            {duration}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-green-500" />
            {enrolled.toLocaleString()} enrolled
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
            {rating.toFixed(1)} rating
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-2 text-purple-500" />
            Certificate
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleEnrollClick}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 
           user && hasActiveSubscription() ? 'Access Course' : 
           user ? 'Enroll Now' : 'Sign In to Enroll'}
        </Button>
      </CardContent>
    </Card>
  );
};

const Courses: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const courses = [
    {
      courseId: 'course-statistical-inference',
      title: "Statistical Inference Fundamentals",
      description: "Master the core concepts of statistical inference, hypothesis testing, and confidence intervals with real-world applications.",
      duration: "8 weeks",
      level: "Intermediate",
      enrolled: 1234,
      rating: 4.8,
      imageUrl: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "$299",
      instructor: "Dr. Sarah Chen",
      skills: ["Hypothesis Testing", "Confidence Intervals", "P-values", "Statistical Power", "ANOVA"]
    },
    {
      courseId: 'course-machine-learning-stats',
      title: "Machine Learning Statistics",
      description: "Learn the statistical foundations behind modern machine learning algorithms and how to apply them effectively.",
      duration: "10 weeks",
      level: "Advanced",
      enrolled: 892,
      rating: 4.9,
      imageUrl: "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "$399",
      instructor: "Prof. Michael Rodriguez",
      skills: ["Regression", "Classification", "Cross-validation", "Feature Selection", "Model Evaluation"]
    },
    {
      courseId: 'course-bayesian-analysis',
      title: "Bayesian Data Analysis",
      description: "Explore Bayesian statistics and its applications in real-world data analysis and decision making.",
      duration: "6 weeks",
      level: "Advanced",
      enrolled: 567,
      rating: 4.7,
      imageUrl: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "$349",
      instructor: "Dr. Emily Watson",
      skills: ["Bayesian Inference", "MCMC", "Prior Distributions", "Posterior Analysis", "Hierarchical Models"]
    },
    {
      courseId: 'course-time-series',
      title: "Time Series Analysis",
      description: "Master time series forecasting techniques and learn to analyze temporal data patterns effectively.",
      duration: "7 weeks",
      level: "Intermediate",
      enrolled: 743,
      rating: 4.6,
      imageUrl: "https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "$279",
      instructor: "Dr. James Liu",
      skills: ["ARIMA", "Seasonal Decomposition", "Forecasting", "Trend Analysis", "Stationarity"]
    },
    {
      courseId: 'course-experimental-design',
      title: "Experimental Design",
      description: "Learn to design robust experiments and analyze experimental data with statistical rigor.",
      duration: "5 weeks",
      level: "Beginner",
      enrolled: 1156,
      rating: 4.5,
      imageUrl: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "$199",
      instructor: "Dr. Anna Thompson",
      skills: ["A/B Testing", "Randomization", "Control Groups", "Sample Size", "Effect Size"]
    },
    {
      courseId: 'course-deep-learning-math',
      title: "Deep Learning Mathematics",
      description: "Understand the mathematical foundations of deep learning and neural network architectures.",
      duration: "12 weeks",
      level: "Advanced",
      enrolled: 456,
      rating: 4.8,
      imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "$499",
      instructor: "Prof. David Kim",
      skills: ["Neural Networks", "Backpropagation", "Optimization", "Regularization", "CNN/RNN"]
    }
  ];

  const stats = [
    { icon: <BookOpen size={24} />, value: "50+", label: "Expert-Led Courses" },
    { icon: <Users size={24} />, value: "10K+", label: "Active Students" },
    { icon: <Award size={24} />, value: "95%", label: "Completion Rate" },
    { icon: <TrendingUp size={24} />, value: "4.8/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4 mr-2" />
            Professional Statistical Education
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Statistical Learning
            <span className="block text-blue-400">Courses</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Enhance your statistical knowledge with our comprehensive courses taught by industry experts. 
            From foundational concepts to advanced techniques, master the skills that matter.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3 backdrop-blur-sm">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Section */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-200">
              All Courses
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Beginner
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Intermediate
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Advanced
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard 
              key={index} 
              {...course} 
              setAuthMode={setAuthMode}
              setShowAuthModal={setShowAuthModal}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
            <Target className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Advance Your Career?
            </h3>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers through our expert-led statistical learning programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              >
                View All Courses
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {authMode === 'signin' ? 'Sign In to Enroll' : 'Create Account'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>
              <AuthForm
                mode={authMode}
                onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                onSuccess={() => setShowAuthModal(false)}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Courses;