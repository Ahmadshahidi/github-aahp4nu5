import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { supabase, ContentItem } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const ContentEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Partial<ContentItem>>({
    title: '',
    content: '',
    category: 'blog',
    status: 'draft'
  });

  useEffect(() => {
    if (id) {
      const fetchContent = async () => {
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching content:', error);
          navigate('/admin');
        } else {
          setContent(data);
        }
      };

      fetchContent();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const contentData = {
      ...content,
      author_id: user?.id,
      last_edited_at: new Date().toISOString(),
      published_at: content.status === 'published' ? new Date().toISOString() : null
    };

    const { error } = id
      ? await supabase
          .from('content_items')
          .update(contentData)
          .eq('id', id)
      : await supabase
          .from('content_items')
          .insert([contentData]);

    setLoading(false);

    if (error) {
      console.error('Error saving content:', error);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={content.category}
            onChange={(e) => setContent({ ...content, category: e.target.value as ContentItem['category'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="blog">Blog</option>
            <option value="course">Course</option>
            <option value="notebook">Notebook</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <MDEditor
            value={content.content}
            onChange={(value) => setContent({ ...content, content: value || '' })}
            preview="edit"
            height={400}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            value={content.status}
            onChange={(e) => setContent({ ...content, status: e.target.value as ContentItem['status'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentEditor;