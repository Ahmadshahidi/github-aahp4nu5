import React from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { LineChart, Database, GraduationCap } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
      <CardHeader className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">{icon}</div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "Statistical Modeling",
      description: "Learn advanced statistical techniques from regression analysis to time series forecasting with hands-on practice using real-world datasets.",
      icon: <LineChart size={24} />
    },
    {
      title: "Data Analysis",
      description: "Master data manipulation, exploratory analysis, and visualization techniques using industry-standard tools and methodologies.",
      icon: <Database size={24} />
    },
    {
      title: "Expert Instruction",
      description: "Learn from experienced statisticians and data scientists with proven track records in both academia and industry.",
      icon: <GraduationCap size={24} />
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Stat, ML, and AI Services
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            From foundational concepts to advanced modeling techniques, we provide everything you need to become proficient in statistical analysis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;