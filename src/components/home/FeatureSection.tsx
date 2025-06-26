import React from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { LineChart, Database, GraduationCap, Brain, Target, Users, Zap, Award, TrendingUp, MessageSquare, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, gradient }) => {
  return (
    <Card className="group h-full flex flex-col hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg overflow-hidden relative">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`}></div>
      <CardHeader className="flex items-center relative z-10 pb-4">
        <div className={`p-4 rounded-2xl ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center text-center relative z-10 px-6 pb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "Statistical Modeling",
      description: "Master advanced statistical techniques from regression analysis to time series forecasting with hands-on practice using real-world datasets and industry-standard methodologies.",
      icon: <LineChart size={28} />,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Machine Learning",
      description: "Dive deep into ML algorithms, neural networks, and AI systems. Learn the mathematical foundations and practical implementations that power modern data science.",
      icon: <Brain size={28} />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "LLM Models",
      description: "Master Large Language Models and transformer architectures. Understand the statistical principles behind GPT, BERT, and other state-of-the-art language models.",
      icon: <MessageSquare size={28} />,
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600"
    },
    {
      title: "Generative AI",
      description: "Explore generative artificial intelligence techniques including GANs, VAEs, and diffusion models. Learn to create and fine-tune AI systems that generate content.",
      icon: <Sparkles size={28} />,
      gradient: "bg-gradient-to-br from-pink-500 to-pink-600"
    },
    {
      title: "Data Analysis",
      description: "Master data manipulation, exploratory analysis, and visualization techniques using industry-standard tools and cutting-edge methodologies for actionable insights.",
      icon: <Database size={28} />,
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Expert Instruction",
      description: "Learn from experienced statisticians and data scientists with proven track records in both academia and industry, bringing real-world expertise to your learning journey.",
      icon: <GraduationCap size={28} />,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      title: "Practical Applications",
      description: "Apply your knowledge to real business problems and research challenges. Build a portfolio of projects that demonstrate your expertise to potential employers.",
      icon: <Target size={28} />,
      gradient: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      title: "Community Support",
      description: "Join a vibrant community of learners and professionals. Collaborate on projects, share insights, and build lasting professional relationships in the field.",
      icon: <Users size={28} />,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { icon: <Zap size={24} />, value: "99%", label: "Course Completion Rate" },
    { icon: <Award size={24} />, value: "4.9/5", label: "Average Rating" },
    { icon: <TrendingUp size={24} />, value: "85%", label: "Career Advancement" },
    { icon: <Users size={24} />, value: "10K+", label: "Active Students" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <Award className="w-4 h-4 mr-2" />
            Comprehensive Learning Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Master Statistics, ML, and AI
            <span className="block text-blue-600 dark:text-blue-400 mt-2">
              with Expert Guidance
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            From foundational concepts to advanced modeling techniques, we provide everything you need to become proficient in statistical analysis and machine learning.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
                <div className="text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gradient={feature.gradient}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of professionals who have advanced their careers through our comprehensive statistical learning programs.
            </p>
            <button
              onClick={() => window.location.href = '/courses'}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Learning Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;