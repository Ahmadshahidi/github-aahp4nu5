import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import { useSubscription } from '../hooks/useSubscription';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const { refetch } = useSubscription();

  useEffect(() => {
    // Refetch subscription data to get the latest status
    const updateSubscription = async () => {
      await refetch();
      setLoading(false);
    };

    // Add a small delay to ensure webhook has processed
    const timer = setTimeout(updateSubscription, 2000);
    return () => clearTimeout(timer);
  }, [refetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thank you for your purchase. Your payment has been processed successfully and you now have access to your content.
          </p>
          
          {sessionId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What's Next?
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your purchase is now active. Here's what you can do:
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Access Your Courses
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Visit your profile to see all available courses and start learning immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Monitor your learning journey and earn certificates as you complete courses.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Home className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Explore Resources
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Access additional learning materials, datasets, and useful links to enhance your studies.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/profile?tab=courses')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View My Courses
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-3"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Need Help?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you have any questions about your purchase or need assistance accessing your content, 
            we're here to help.
          </p>
          <Button
            variant="text"
            onClick={() => navigate('/consultation')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Contact Support
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;