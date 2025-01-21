import React, { useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import * as api from '../services/api';

interface MessageListProps {
  messages: ChatMessage[];
}

interface User {
  id: string;
  name: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [userCache, setUserCache] = useState<Record<string, string>>({}); // Cache user names by ID

  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueSenderIds = Array.from(new Set(messages.map(msg => msg.senderId)));

      // Fetch user details for each unique senderId
      for (const senderId of uniqueSenderIds) {
        if (!userCache[senderId]) {
          try {
            const response = await api.getUser(senderId)
            setUserCache(prevCache => ({ ...prevCache, [senderId]: response.data.name }));
          } catch (error) {
            console.error(`Failed to fetch user for ID ${senderId}:`, error);
          }
        }
      }
    };

    fetchUserNames();
  }, [messages, userCache]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{userCache[message.senderId] || message.senderId}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
