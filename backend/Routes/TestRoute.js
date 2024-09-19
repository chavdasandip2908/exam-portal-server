const express = require('express');
const router = express.Router();
const Test = require('../model/TestModel');

// Create a new test
router.post('/create', async (req, res) => {
  try {
    const { name, creator, questions } = req.body;
    const newTest = new Test({ name, creator, questions });
    const savedTest = await newTest.save();
    
    // Send the ID of the newly created test
    res.status(201).json({ message: 'Test created successfully', code: savedTest._id });

  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error });
  }
});


// Get test by code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ message: 'Code parameter is required' });
    }

    const test = await Test.findOne({
      _id: code
    }).select('-__v'); // Excludes the version key

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Test fetched successfully', test });

  } catch (error) {
    console.error('Error fetching test:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid code format' });
    }

    res.status(500).json({ message: 'Error fetching test', error });
  }
});


// Test submission route
router.post('/submit/:code', async (req, res) => {
  try {
    const { code } = req.params; // Test code from URL params
    const { answers } = req.body; // User's answers from the request body
    
    // Fetch the test from the database
    const test = await Test.findOne({ code });
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    const correctAnswers = test.questions.map(q => q.correctOption);
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    // Loop through user's answers and compare with correct answers
    answers.forEach((userAnswer, index) => {
      const question = test.questions.find(q => q._id.toString() === userAnswer.questionId);
      if (question) {
        if (question.correctOption === userAnswer.selectedAnswer) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });
    
    // Return result
    res.status(200).json({
      message: 'Test submitted successfully',
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount
    });
    
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Error submitting test', error });
  }
});



module.exports = router;