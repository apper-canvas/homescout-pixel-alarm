import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { AuthContext } from '../../App';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { savedProperties } = useSavedProperties();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const navItems = [
    { to: '/', label: 'Buy', icon: 'Home' },
    { to: '/saved', label: 'Saved', icon: 'Heart' },
    { to: '/compare', label: 'Compare', icon: 'BarChart3' },
    { to: '/mortgage-calculator', label: 'Calculator', icon: 'Calculator' }
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-effect shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">
              HomeScout
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.to)
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
                {item.to === '/saved' && savedProperties.length > 0 && (
                  <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {savedProperties.length}
                  </span>
                )}
              </Link>
            ))}
</nav>
          
          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="LogOut" size={16} />
                  Logout
                </button>
              </div>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.to)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
                {item.to === '/saved' && savedProperties.length > 0 && (
                  <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                    {savedProperties.length}
                  </span>
                )}
</Link>
            ))}
            
            {/* Mobile User Menu */}
            {isAuthenticated && (
              <div className="border-t pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, {user?.firstName || 'User'}
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-3 py-3 w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="LogOut" size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;