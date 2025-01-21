import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';

interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp?: Date;
}

const Chat: React.FC = () => {
  const { recipientId } = useParams<{ recipientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && recipientId) {
      const fetchMessages = async () => {
        try {
          const chatMessages = await api.getChatMessages(user.id, recipientId);
          setMessages(chatMessages);
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      };
      fetchMessages();

      // Initialize WebSocket connection
      const newSocket = new WebSocket(`ws://localhost:5000/ws?senderId=${user.id}`);
      newSocket.onopen = () => {
        console.log('WebSocket Connected');
      };
      newSocket.onmessage = (event) => {
        const newMessage: ChatMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && recipientId && socket && socket.readyState === WebSocket.OPEN && newMessage.trim()) {
      const message: ChatMessage = {
        id: '', // ID will be assigned by the server
        senderId: user.id,
        recipientId,
        content: newMessage.trim(),
        timestamp: new Date(),
      };
      try {
        socket.send(JSON.stringify(message));
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Please log in to use the chat.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 flex items-center">
        <button className="mr-4" onClick={() => navigate(-1)}>
          &#8592; {/* Left arrow Unicode character */}
        </button>
        <div className="flex items-center">
          <span className="text-2xl mr-2">&#128100;</span> {/* User icon Unicode character */}
          <span className="font-semibold text-lg">Chat with {recipientId}</span>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`mb-4 flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                message.senderId === user.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow'
              }`}
            >
              <p>{message.content}</p>
              <span className={`text-xs mt-1 ${message.senderId === user.id ? 'text-blue-200' : 'text-gray-500'}`}>
                {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="bg-white p-4 shadow-md">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow mr-2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            &#10148; {/* Right arrow Unicode character */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;