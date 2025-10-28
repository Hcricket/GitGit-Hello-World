const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  videoUrl: String,
  audioUrl: String,
  exercises: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  vocabulary: [{
    word: String,
    definition: String,
    example: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);