const API_URL = 'http://localhost:5000/api';

export const api = {
  auth: {
    signUp: async (username: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!response.ok) throw new Error('Signup failed');
      return response.json();
    },

    signIn: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Sign in failed');
      return response.json();
    }
  },

  content: {
    getByCategory: async (category: string) => {
      const response = await fetch(`${API_URL}/content/${category}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(`${API_URL}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create content');
      return response.json();
    }
  },

  profile: {
    get: async (id: string) => {
      const response = await fetch(`${API_URL}/profile/${id}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    }
  }
};