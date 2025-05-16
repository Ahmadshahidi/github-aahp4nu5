import React from 'react';
import { ExternalLink, Book, Code, Calculator } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';

interface ResourceLinkProps {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({
  title,
  description,
  url,
  icon,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {description}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Visit Resource
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UsefulLinks: React.FC = () => {
  const resources = [
    {
      title: "Statistical Learning Theory",
      description: "Comprehensive guide to statistical learning principles and applications.",
      url: "#",
      icon: <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    },
    {
      title: "Python for Data Science",
      description: "Learn Python programming specifically for statistical analysis and data science.",
      url: "#",
      icon: <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    },
    {
      title: "Statistical Calculators",
      description: "Online tools for various statistical calculations and analyses.",
      url: "#",
      icon: <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Useful Resources
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our curated collection of statistical learning resources and tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {resources.map((resource, index) => (
          <ResourceLink key={index} {...resource} />
        ))}
      </div>
    </div>
  );
};

export default UsefulLinks;