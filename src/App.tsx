import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Blog from './pages/Blog';
import Datasets from './pages/Datasets';
import UsefulLinks from './pages/UsefulLinks';
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import Notebooks from './pages/Notebooks';
import Consultation from './pages/Consultation';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/notebooks" element={<Notebooks />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/useful-links" element={<UsefulLinks />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/success" element={<Success />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App