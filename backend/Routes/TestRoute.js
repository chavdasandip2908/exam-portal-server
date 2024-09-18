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
    console.log(code);
    
    if (!code) {
      return res.status(400).json({ message: 'Code parameter is required' });
    }

    const test = await Test.findOne({ code }).select('-__v'); // Excludes the version key
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


module.exports = router;