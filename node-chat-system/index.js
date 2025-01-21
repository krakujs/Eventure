const express = require('express');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const { findMessages, saveMessage } = require('./chatService');
const cors = require('cors');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });
app.use(cors());
app.use(express.json());

let clients = {};

app.post('/sendMessage', async (req, res) => {
  const { senderId, recipientId, content } = req.body;
  if (!senderId || !recipientId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const message = await saveMessage(senderId, recipientId, content);
    res.status(200).json(message);
  } catch (error) {
    console.error('Error handling /sendMessage:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/messages/:senderId/:recipientId', async (req, res) => {
  const { senderId, recipientId } = req.params;
  try {
    const messages = await findMessages(senderId, recipientId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

wss.on('connection', (ws, request) => {
  const { senderId } = url.parse(request.url, true).query;
  
  if (!senderId) {
    ws.close(1008, 'SenderId is required');
    return;
  }

  clients[senderId] = ws;
  console.log(`Client connected: ${senderId}`);

  ws.on('message', (message) => {
    console.log(`Received message from ${senderId}: ${message}`);
    const parsedMessage = JSON.parse(message);
    const { recipientId, content } = parsedMessage;

    if (clients[recipientId]) {
      console.log(`Sending message from ${senderId} to ${recipientId}: ${content}`);
      clients[recipientId].send(JSON.stringify({
        senderId: senderId,
        content,
      }));
    } else {
      console.log(`Recipient ${recipientId} not found.`);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${senderId}`);
    delete clients[senderId];
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

mongoose.connect('mongodb://localhost:27017/eventure', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(5000, () => {
  console.log('WebSocket server is running on ws://localhost:5000/ws');
});