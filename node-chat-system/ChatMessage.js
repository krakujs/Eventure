const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  chatId: { type: String},
  senderId: { type: String},
  recipientId: { type: String },
  content: { type: String},
  timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;