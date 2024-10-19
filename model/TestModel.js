const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
  questions: [
    {
      text: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
    }
  ]
});

module.exports = mongoose.model('Test', TestSchema);