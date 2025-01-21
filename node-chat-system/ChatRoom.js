const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  chatId: { type: String },
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true }
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;