import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import ContentList from './ContentList';
import ContentEditor from './ContentEditor';
import { ContentItem } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ContentItem['category']>('blog');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
        <button
          onClick={() => navigate('new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Content
        </button>
      </div>

      <Tabs defaultValue={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ContentItem['category'])}>
        <TabsList className="mb-8">
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="course">Courses</TabsTrigger>
          <TabsTrigger value="notebook">Notebooks</TabsTrigger>
        </TabsList>

        <Routes>
          <Route path="/" element={
            <TabsContent value={selectedCategory}>
              <ContentList category={selectedCategory} />
            </TabsContent>
          } />
          <Route path="/new" element={<ContentEditor />} />
          <Route path="/edit/:id" element={<ContentEditor />} />
        </Routes>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;