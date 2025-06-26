import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, LineChart, Database, Calendar, Code, BookText, Sun, Moon, LogIn, LogOut, ChevronDown, Link, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../auth/AuthForm';
import Card from '../ui/Card';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, children, onClick }) => {
  return (
    <a 
      href={href} 
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 relative group"
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </a>
  );
};

interface DropdownProps {
  label: string;
  icon: React.ReactNode;
  items: { href: string; label: string; icon: React.ReactNode }[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        <span className="ml-2">{label}</span>
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="py-2" role="menu" aria-orientation="vertical">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      setShowAuthForm(false);
    }
  }, [authUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <TrendingUp className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                <div className="absolute inset-0 bg-blue-600 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                MasterStat
              </span>
            </a>
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <NavLink href="/" icon={<LineChart size={18} />}>Home</NavLink>
              {user ? (
                <NavLink href="/profile?tab=courses" icon={<BookOpen size={18} />}>My Courses</NavLink>
              ) : (
                <NavLink href="/courses" icon={<BookOpen size={18} />}>Courses</NavLink>
              )}
              <Dropdown
                label="Resources"
                icon={<Database size={18} />}
                items={[
                  { href: '/datasets', label: 'Datasets', icon: <Database size={18} /> },
                  { href: '/useful-links', label: 'Useful Links', icon: <Link size={18} /> },
                ]}
              />
              <NavLink href="/notebooks" icon={<Code size={18} />}>Notebooks</NavLink>
              <NavLink href="/consultation" icon={<Calendar size={18} />}>Consultation</NavLink>
              <NavLink href="/blog" icon={<BookText size={18} />}>Blog</NavLink>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuthForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <LogIn size={18} className="mr-2" />
                Sign In
              </Button>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mr-2 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <NavLink href="/" icon={<LineChart size={18} />} onClick={closeMenu}>Home</NavLink>
            {user ? (
              <NavLink href="/profile?tab=courses" icon={<BookOpen size={18} />} onClick={closeMenu}>My Courses</NavLink>
            ) : (
              <NavLink href="/courses" icon={<BookOpen size={18} />} onClick={closeMenu}>Courses</NavLink>
            )}
            <NavLink href="/datasets" icon={<Database size={18} />} onClick={closeMenu}>Datasets</NavLink>
            <NavLink href="/useful-links" icon={<Link size={18} />} onClick={closeMenu}>Useful Links</NavLink>
            <NavLink href="/notebooks" icon={<Code size={18} />} onClick={closeMenu}>Notebooks</NavLink>
            <NavLink href="/consultation" icon={<Calendar size={18} />} onClick={closeMenu}>Consultation</NavLink>
            <NavLink href="/blog" icon={<BookText size={18} />} onClick={closeMenu}>Blog</NavLink>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={signOut}
                  className="border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthForm(true);
                    closeMenu();
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Form Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>
              <AuthForm
                mode={authMode}
                onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              />
            </div>
          </Card>
        </div>
      )}
    </nav>
  );
};

export default Navbar;