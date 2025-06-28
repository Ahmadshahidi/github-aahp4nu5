import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ExternalLink, Lock, Globe, Crown, Star, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface UserResource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string | null;
  access_type: 'public' | 'authenticated' | 'paid';
  created_at: string;
}

interface GlobalAccess {
  id: string;
  purchased_at: string;
  valid_until: string | null;
  is_active: boolean;
}

const MyCourses: React.FC = () => {
  const [resources, setResources] = useState<UserResource[]>([]);
  const [globalAccess, setGlobalAccess] = useState<GlobalAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserResources();
    fetchGlobalAccess();
    fetchUserCourses();
  }, []);

  const fetchUserResources = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_user_accessible_resources');

      if (error) {
        throw error;
      }

      setResources(data || []);
    } catch (err) {
      console.error('Error fetching user resources:', err);
      setError(err instanceof Error ? err.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('global_access_purchases')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setGlobalAccess(data);
    } catch (err) {
      console.error('Error fetching global access:', err);
      // Don't set error state for global access as it's optional
    }
  };

  const fetchUserCourses = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_accessible_courses', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) {
        console.error('Error fetching user courses:', error);
      } else {
        console.log('User courses:', data);
        // You can add state to display these courses separately if needed
      }
    } catch (err) {
      console.error('Error fetching user courses:', err);
    }
  };

  const handleAccessResource = (resourceUrl: string) => {
    if (resourceUrl.startsWith('http')) {
      window.open(resourceUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Handle internal routes
      navigate(resourceUrl);
    }
  };

  const getAccessTypeIcon = (accessType: string) => {
    switch (accessType) {
      case 'public':
        return <Globe className="w-5 h-5 text-green-500" />;
      case 'authenticated':
        return <Lock className="w-5 h-5 text-blue-500" />;
      case 'paid':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAccessTypeLabel = (accessType: string) => {
    switch (accessType) {
      case 'public':
        return 'Free';
      case 'authenticated':
        return 'Member';
      case 'paid':
        return 'Premium';
      default:
        return 'Unknown';
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'education':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'consulting':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'workshop':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'programming':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={fetchUserResources} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const publicResources = resources.filter(r => r.access_type === 'public');
  const memberResources = resources.filter(r => r.access_type === 'authenticated');
  const premiumResources = resources.filter(r => r.access_type === 'paid');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Learning Resources
        </h2>
        <Button 
          variant="outline"
          onClick={() => navigate('/courses')}
        >
          Browse More Resources
        </Button>
      </div>

      {/* Global Access Status */}
      {globalAccess && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                    All-Access Pass Active
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300">
                    You have unlimited access to all premium resources
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {globalAccess.valid_until 
                    ? `Valid until ${new Date(globalAccess.valid_until).toLocaleDateString()}`
                    : 'Lifetime Access'
                  }
                </div>
                <div className="text-xs text-purple-500 dark:text-purple-400">
                  Purchased {new Date(globalAccess.purchased_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{publicResources.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Free Resources</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Lock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{memberResources.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Member Resources</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{premiumResources.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Premium Resources</div>
          </CardContent>
        </Card>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Resources Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't accessed any resources yet. Browse our catalog to get started!
          </p>
          <Button 
            variant="primary"
            onClick={() => navigate('/courses')}
          >
            Browse Resources
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Premium Resources */}
          {premiumResources.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Crown className="w-6 h-6 text-purple-500 mr-2" />
                Premium Resources ({premiumResources.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {premiumResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getAccessTypeIcon(resource.access_type)}
                            <span className="ml-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                              {getAccessTypeLabel(resource.access_type)}
                            </span>
                            {resource.category && (
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                                {resource.category}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {resource.title}
                          </h4>
                          {resource.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Added {new Date(resource.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleAccessResource(resource.url)}
                        className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Resource
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Member Resources */}
          {memberResources.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 text-blue-500 mr-2" />
                Member Resources ({memberResources.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memberResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getAccessTypeIcon(resource.access_type)}
                            <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                              {getAccessTypeLabel(resource.access_type)}
                            </span>
                            {resource.category && (
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                                {resource.category}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {resource.title}
                          </h4>
                          {resource.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Added {new Date(resource.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleAccessResource(resource.url)}
                        className="flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Resource
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Public Resources */}
          {publicResources.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-6 h-6 text-green-500 mr-2" />
                Free Resources ({publicResources.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publicResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getAccessTypeIcon(resource.access_type)}
                            <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                              {getAccessTypeLabel(resource.access_type)}
                            </span>
                            {resource.category && (
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                                {resource.category}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {resource.title}
                          </h4>
                          {resource.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Added {new Date(resource.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => handleAccessResource(resource.url)}
                        className="flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Resource
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;