import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient: Client | null = null;

export const connectWebSocket = (token: string, userId: string, onMessageReceived: (message: any) => void) => {
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    console.log('WebSocket Connected');
    const subscriptionTopic = `/user/${userId}/queue/notifications`;
    console.log(`Subscribing to: ${subscriptionTopic}`);
    stompClient!.subscribe(subscriptionTopic, (message) => {
      console.log(`Received message on topic: ${subscriptionTopic}`);
      const notification = JSON.parse(message.body);
      onMessageReceived(notification);
    });

    // Subscribe to event updates
    stompClient!.subscribe('/topic/event-updates', (message) => {
      console.log('Received event update');
      const eventUpdate = JSON.parse(message.body);
      onMessageReceived(eventUpdate);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('WebSocket Error:', frame);
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

export const sendEventUpdate = (eventId: string, updateType: string, data: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/event-update',
      body: JSON.stringify({ eventId, updateType, data })
    });
  }
};