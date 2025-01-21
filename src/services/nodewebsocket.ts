import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:5000/ws'; // URL of the WebSocket server

let stompClient: Client | null = null;

const connectWebSocket = (userId: string, onMessageReceived: (message: any) => void) => {
  if (stompClient) {
    // If there's an existing client, disconnect it before creating a new one
    stompClient.deactivate();
  }

  const socket = new SockJS(`${WS_URL}?userId=${userId}`); // Include userId in the query string

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      console.log(new Date(), str);
    },
    onConnect: () => {
      console.log('Connected to WebSocket server');
      stompClient?.subscribe(`/user/${userId}/queue/messages`, (message) => {
        const chatMessage = JSON.parse(message.body);
        onMessageReceived(chatMessage);
      });
    },
    onStompError: (frame) => {
      console.error('STOMP Error:', frame);
    },
  });

  stompClient.activate();

  // Return a function to disconnect the WebSocket
  return () => {
    if (stompClient) {
      stompClient.deactivate();
      stompClient = null;
    }
  };
};

export { connectWebSocket };
