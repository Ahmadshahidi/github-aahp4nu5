import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { checkPermission } from './middleware/checkPermission.js';
import { ACTIONS, RESOURCES } from './permissions/roles.js';
import { mockUsers } from './users/mockUsers.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

app.use(express.json());

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${process.env.VITE_APP_URL}/auth/callback`
      }
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    res.json({ session });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Content endpoints
app.get('/api/content/:category', async (req, res) => {
  const { category } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, profiles:author_id(username)')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/content', async (req, res) => {
  const { title, content, category, status, author_id } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('content_items')
      .insert([{
        title,
        content,
        category,
        status,
        author_id,
        published_at: status === 'published' ? new Date().toISOString() : null
      }]);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Profile endpoints
app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// RBAC protected routes
app.get('/api/public', (req, res) => {
  res.json({ message: 'Public content accessible to all' });
});

app.get('/api/premium', 
  checkPermission(ACTIONS.READ, RESOURCES.PREMIUM),
  (req, res) => {
    res.json({ message: 'Premium content for paid or active users' });
  }
);

app.post('/api/premium',
  checkPermission(ACTIONS.WRITE, RESOURCES.PREMIUM),
  (req, res) => {
    res.json({ message: 'Successfully created premium content' });
  }
);

app.get('/api/dashboard',
  checkPermission(ACTIONS.READ, RESOURCES.DASHBOARD),
  (req, res) => {
    res.json({ message: 'Dashboard access granted' });
  }
);

// Mock user endpoint for testing
app.get('/api/mock-users', (req, res) => {
  res.json(mockUsers);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});