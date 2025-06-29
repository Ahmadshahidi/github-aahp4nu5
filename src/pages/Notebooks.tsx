import React from 'react';
import { Code, Download, ExternalLink, Star, Clock, Users, BookOpen } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface NotebookCardProps {
  title: string;
  description: string;
  author: string;
  language: string;
  difficulty: string;
  downloadUrl: string;
  viewUrl: string;
  stars: number;
  lastUpdated: string;
  tags: string[];
}

const NotebookCard: React.FC<NotebookCardProps> = ({
  title,
  description,
  author,
  language,
  difficulty,
  downloadUrl,
  viewUrl,
  stars,
  lastUpdated,
  tags,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case 'python': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'r': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'julia': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'sql': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Code className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(language)}`}>
                {language}
              </span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {description}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              <span>{stars}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(viewUrl, '_blank')}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Notebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(downloadUrl, '_blank')}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Notebooks: React.FC = () => {
  const notebooks = [
    {
      title: "Statistical Inference with Python",
      description: "Comprehensive notebook covering hypothesis testing, confidence intervals, and statistical power analysis using Python and scipy.stats.",
      author: "Dr. Sarah Chen",
      language: "Python",
      difficulty: "Intermediate",
      downloadUrl: "#",
      viewUrl: "#",
      stars: 4.8,
      lastUpdated: "2 days ago",
      tags: ["statistics", "hypothesis-testing", "scipy", "pandas"]
    },
    {
      title: "Time Series Analysis in R",
      description: "Complete guide to time series forecasting using ARIMA, seasonal decomposition, and advanced forecasting techniques in R.",
      author: "Prof. Michael Rodriguez",
      language: "R",
      difficulty: "Advanced",
      downloadUrl: "#",
      viewUrl: "#",
      stars: 4.9,
      lastUpdated: "1 week ago",
      tags: ["time-series", "forecasting", "arima", "ggplot2"]
    },
    {
      title: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts with practical implementations of regression, classification, and clustering algorithms.",
      author: "Dr. Emily Watson",
      language: "Python",
      difficulty: "Beginner",
      downloadUrl: "#",
      viewUrl: "#",
      stars: 4.7,
      lastUpdated: "3 days ago",
      tags: ["machine-learning", "scikit-learn", "regression", "classification"]
    },
    {
      title: "Bayesian Statistics with PyMC",
      description: "Explore Bayesian inference, MCMC sampling, and probabilistic programming using PyMC for real-world statistical problems.",
      author: "Dr. James Liu",
      language: "Python",
      difficulty: "Advanced",
      downloadUrl: "#",
      viewUrl: "#",
      stars: 4.6,
      lastUpdated: "5 days ago",
      tags: ["bayesian", "mcmc", "pymc", "probabilistic-programming"]
    },
    {
      title: "Data Visualization Best Practices",
      description: "Learn to create compelling and informative visualizations using matplotlib, seaborn, and plotly with statistical data.",
      author: "Dr. Anna Thompson",
      language: "Python",
      difficulty: "Beginner",
      downloadUrl: "#",
      viewUrl: "#",
      stars: 4.5,
      lastUpdated: "1 week ago",
      tags: ["visualization", "matplotlib", "seaborn", "plotly"]
    },
    {
      title: "Advanced SQL for Data Analysis",
      description: "Master complex SQL queries, window functions, and statistical functions for advanced data analysis and reporting.",
      author: "Prof. David Kim",
      language: "SQL",
      difficulty: "Intermediate",
      downloadUrl: "#",
      viewUrl: "#",
      stars: 4.8,
      lastUpdated: "4 days ago",
      tags: ["sql", "data-analysis", "window-functions", "statistics"]
    }
  ];

  const stats = [
    { icon: <BookOpen size={24} />, value: "50+", label: "Notebooks Available" },
    { icon: <Users size={24} />, value: "15K+", label: "Downloads" },
    { icon: <Star size={24} />, value: "4.7/5", label: "Average Rating" },
    { icon: <Code size={24} />, value: "5", label: "Languages Supported" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            <Code className="w-4 h-4 mr-2" />
            Interactive Learning Notebooks
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Statistical
            <span className="block text-blue-400">Notebooks</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore our collection of interactive Jupyter notebooks covering statistical analysis, machine learning, and data science. 
            Learn by doing with real datasets and practical examples.
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

      {/* Notebooks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Section */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-200">
              All Notebooks
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Python
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              R
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              SQL
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Beginner
            </button>
            <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Advanced
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notebooks.map((notebook, index) => (
            <NotebookCard key={index} {...notebook} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
            <Code className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Start Learning with Interactive Notebooks
            </h3>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Download and run these notebooks locally, or view them online to learn statistical concepts through hands-on practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              >
                Browse All Notebooks
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebooks;