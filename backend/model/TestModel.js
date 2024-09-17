const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  name: String,
  creator: String,
  code: String,
  questions: [{
    question: String,
    options: [String],
    correctOption: Number
  }]
});

module.exports = mongoose.model('Test', TestSchema);