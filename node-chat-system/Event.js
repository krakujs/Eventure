const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  creatorId: { type: String, required: true },
  participantCount: { type: Number, default: 0 },
  tasks: [{
    title: String,
    description: String,
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'], default: 'TODO' }
  }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;