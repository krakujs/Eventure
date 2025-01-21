import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { connectWebSocket, disconnectWebSocket } from '../services/websocket';

interface WebSocketManagerProps {
  onMessageReceived: (message: any) => void;
}

const WebSocketManager: React.FC<WebSocketManagerProps> = ({ onMessageReceived }) => {
  const { user } = useAuth();

  const handleConnect = useCallback(() => {
    if (user) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        console.log(`Connecting WebSocket for user: ${user.id}`);
        connectWebSocket(token, user.id, onMessageReceived);
      } else {
        console.error('No JWT token found in localStorage');
      }
    }
  }, [user, onMessageReceived]);

  useEffect(() => {
    handleConnect();

    return () => {
      console.log('Disconnecting WebSocket');
      disconnectWebSocket();
    };
  }, [handleConnect]);

  return null; // This component doesn't render anything
};

export default WebSocketManager;