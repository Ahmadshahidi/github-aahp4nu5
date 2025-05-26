import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

app.use(cors());
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});