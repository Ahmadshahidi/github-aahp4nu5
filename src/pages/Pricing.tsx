import React from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useStripe } from '../hooks/useStripe';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../contexts/AuthContext';

const Pricing: React.FC = () => {
  const { createCheckoutSession, loading, error } = useStripe();
  const { hasActiveSubscription, getSubscriptionPlan } = useSubscription();
  const { user } = useAuth();

  const handlePurchase = (productKey: 'course' | 'membership') => {
    createCheckoutSession(productKey);
  };

  const features = {
    course: [
      'Access to single course',
      'Course materials and resources',
      'Basic support',
      'Certificate of completion',
    ],
    membership: [
      'Access to all courses',
      'Premium course materials',
      'Priority support',
      'All certificates',
      'Early access to new content',
      'Community access',
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Choose Your Learning Path
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="block text-blue-400">Pricing</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Choose the plan that fits your learning goals. Start with individual courses or get unlimited access with our membership.
          </p>

          {user && hasActiveSubscription() && (
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium mb-6">
              <Crown className="w-4 h-4 mr-2" />
              Active Plan: {getSubscriptionPlan()}
            </div>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Course Purchase */}
          <Card className="relative hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Course Purchase
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Pay per course
                </p>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $10
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/course</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.course.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                fullWidth
                onClick={() => handlePurchase('course')}
                disabled={loading}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900 py-3 text-lg font-semibold"
              >
                {loading ? 'Processing...' : 'Purchase Course'}
              </Button>
            </CardContent>
          </Card>

          {/* Membership */}
          <Card className="relative hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-700 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Membership
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You get access to all courses
                </p>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $5
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.membership.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="primary"
                fullWidth
                onClick={() => handlePurchase('membership')}
                disabled={loading || (user && hasActiveSubscription())}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {loading ? 'Processing...' : 
                 user && hasActiveSubscription() ? 'Current Plan' : 'Start Membership'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel my membership anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can cancel your membership at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What's included in the membership?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Membership gives you unlimited access to all courses, premium materials, priority support, and early access to new content.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do I get certificates?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, both individual course purchases and membership include certificates of completion for all courses you finish.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer several free courses to get you started. You can explore these before deciding on a paid plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;