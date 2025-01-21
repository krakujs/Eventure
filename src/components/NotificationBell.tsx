import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell: React.FC = () => {
  const { notifications, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleNotifications}
        className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <span className="sr-only">View notifications</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {notifications.length}
        </span>
      )}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 flex justify-between items-center">
              <span>Notifications</span>
              <button 
                onClick={clearNotifications}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                Clear All
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="px-4 py-2 text-sm text-gray-700 border-b last:border-b-0">
                  <p>{notification.message}</p>
                  <small className="text-gray-500">{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;