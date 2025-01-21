import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../services/websocket';
import { useAuth } from '../hooks/useAuth';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const userId = useAuth().user?.id;

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        connectWebSocket(token, userId || "", (notification) => {
          addNotification(notification);
        });
      }
    }

    return () => {
      disconnectWebSocket();
    };
  }, [user]);

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
