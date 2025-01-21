const ChatMessage = require("./ChatMessage");
const ChatRoom = require("./ChatRoom");

const saveMessage = async (senderId,recipientId,content) => {
  const chatId = `${senderId}_${recipientId}`;
  const chatMessage = new ChatMessage({
    chatId,
    senderId,recipientId,content,
    timestamp: new Date()
  });
  return await chatMessage.save();
};

const findMessages = async (senderId, recipientId) => {
  const chatId = `${senderId}_${recipientId}`;
  return await ChatMessage.find({ chatId }).sort({ timestamp: 1 });
};

const getChatRoomId = async (senderId, recipientId, createIfNotExists) => {
  let chatRoom = await ChatRoom.findOne({ senderId, recipientId });
  
  if (!chatRoom && createIfNotExists) {
    const chatId = `${senderId}_${recipientId}`;
    chatRoom = await new ChatRoom({ chatId, senderId, recipientId }).save();
    await new ChatRoom({ chatId, senderId: recipientId, recipientId: senderId }).save();
  }

  return chatRoom ? chatRoom.chatId : null;
};

module.exports = {
  saveMessage,
  findMessages,
  getChatRoomId
};
