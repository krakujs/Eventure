const WebSocket = require('ws');
const ChatMessage = require('./ChatMessage'); // Import your ChatMessage model

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, request) => {
  const urlParams = new URL(request.url, `http://${request.headers.host}`).searchParams;
  const userId = urlParams.get('userId'); // Assuming userId is passed as a query parameter

  if (userId) {
    ws.userId = userId; // Store userId in WebSocket object
  }

  ws.on('message', async (message) => {
    const msg = JSON.parse(message);

    if (msg.type === 'SEND_MESSAGE') {
      const { senderId, recipientId, content } = msg;

      // Save message to MongoDB using ChatMessage model
      try {
        const chatMessage = new ChatMessage({
          senderId,
          recipientId,
          content,
          timestamp: new Date(),
        });
        await chatMessage.save();

        // Forward message to recipient
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && client.userId === recipientId) {
            client.send(JSON.stringify({
              senderId,
              recipientId,
              content,
              timestamp: chatMessage.timestamp,
            }));
          }
        });
      } catch (error) {
        console.error('Error saving or sending message:', error);
      }
    } else if (msg.type === 'EVENT_UPDATE') {
      const { eventId, updateType, data } = msg;
      
      try {
        // Update the event in the database
        await Event.findByIdAndUpdate(eventId, { $set: data });

        // Broadcast the update to all connected clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'EVENT_UPDATE',
              eventId,
              updateType,
              data
            }));
          }
        });
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
  });

  ws.on('close', () => {
  });
});

module.exports = { wss };
