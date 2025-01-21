import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-2xl font-bold">Eventure</Link>
          <nav className="hidden md:flex space-x-4 items-center">
            <Link to="/dashboard" className="hover:text-blue-200 transition duration-300">Dashboard</Link>
            <Link to="/events/create" className="hover:text-blue-200 transition duration-300">Create Event</Link>
            <Link to="/profile" className="hover:text-blue-200 transition duration-300">Profile</Link>
            {user && user.role === 'ADMIN' && (
              <Link to="/admin" className="hover:text-blue-200 transition duration-300">Admin Panel</Link>
            )}
            <NotificationBell />
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span>{user?.name}</span>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={() => { logout(); toggleMenu(); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <Link to="/dashboard" className="block py-2 hover:text-blue-200 transition duration-300">Dashboard</Link>
            <Link to="/events/create" className="block py-2 hover:text-blue-200 transition duration-300">Create Event</Link>
            <Link to="/profile" className="block py-2 hover:text-blue-200 transition duration-300">Profile</Link>
            {user && user.role === 'ADMIN' && (
              <Link to="/admin" className="block py-2 hover:text-blue-200 transition duration-300">Admin Panel</Link>
            )}
            <button 
              onClick={logout}
              className="block w-full text-left py-2 hover:text-blue-200 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;