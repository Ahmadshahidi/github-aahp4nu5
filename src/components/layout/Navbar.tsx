import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, LineChart, Database, Calendar, Code, BookText, Sun, Moon, LogIn, LogOut, ChevronDown, Link } from 'lucide-react';
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
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors duration-200 relative group"
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
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        <span className="ml-2">{label}</span>
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
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
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      setShowAuthForm(false);
    }
  }, [authUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <LineChart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MasterStat</span>
            </a>
            <div className="hidden md:ml-6 md:flex md:space-x-2">
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
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
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
              >
                <LogIn size={18} className="mr-2" />
                Sign In
              </Button>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
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
              >
                <LogIn size={18} className="mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Auth Form Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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