import React from 'react';
import { Database, Download, FileSpreadsheet } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface DatasetCardProps {
  title: string;
  description: string;
  size: string;
  format: string;
  downloadUrl: string;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
  title,
  description,
  size,
  format,
  downloadUrl,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {format}
              </div>
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                {size}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(downloadUrl, '_blank')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Datasets: React.FC = () => {
  const datasets = [
    {
      title: "Time Series Analysis Dataset",
      description: "Historical stock market data for practicing time series analysis and forecasting.",
      size: "2.3 GB",
      format: "CSV",
      downloadUrl: "#"
    },
    {
      title: "Machine Learning Classification Dataset",
      description: "Labeled dataset for binary and multi-class classification problems.",
      size: "1.5 GB",
      format: "CSV",
      downloadUrl: "#"
    },
    {
      title: "Regression Analysis Dataset",
      description: "Real estate data for practicing various regression techniques.",
      size: "800 MB",
      format: "CSV",
      downloadUrl: "#"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Statistical Datasets
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Download curated datasets for practice, research, and analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {datasets.map((dataset, index) => (
          <DatasetCard key={index} {...dataset} />
        ))}
      </div>
    </div>
  );
}

export default Datasets;