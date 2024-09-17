const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Create a new test
router.post('/create', async (req, res) => {
  try {
    const { name, creator, questions } = req.body;
    const code = Math.random().toString(36).substring(7);
    const newTest = new Test({ name, creator, code, questions });
    await newTest.save();
    res.status(201).json({ message: 'Test created successfully', code });
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error });
  }
});

// Get test by code
router.get('/:code', async (req, res) => {
  try {
    const test = await Test.findOne({ code: req.params.code });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test', error });
  }
});

module.exports = router;