import React from 'react';
import { GraduationCap, Clock, Star, Users } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  imageUrl: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  level,
  enrolled,
  rating,
  imageUrl,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {duration}
          </div>
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            {level}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {enrolled} enrolled
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            {rating.toFixed(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Courses: React.FC = () => {
  const courses = [
    {
      title: "Statistical Inference Fundamentals",
      description: "Master the core concepts of statistical inference, hypothesis testing, and confidence intervals.",
      duration: "8 weeks",
      level: "Intermediate",
      enrolled: 1234,
      rating: 4.8,
      imageUrl: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg"
    },
    {
      title: "Machine Learning Statistics",
      description: "Learn the statistical foundations behind modern machine learning algorithms.",
      duration: "10 weeks",
      level: "Advanced",
      enrolled: 892,
      rating: 4.9,
      imageUrl: "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg"
    },
    {
      title: "Bayesian Data Analysis",
      description: "Explore Bayesian statistics and its applications in real-world data analysis.",
      duration: "6 weeks",
      level: "Advanced",
      enrolled: 567,
      rating: 4.7,
      imageUrl: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Statistical Learning Courses
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Enhance your statistical knowledge with our comprehensive courses taught by industry experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;