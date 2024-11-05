const express = require('express');
const router = express.Router();
require('dotenv').config();

const Test = require('../model/TestModel');


const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
console.log("api key :: ", process.env.HUGGING_FACE_API_KEY);


router.post('/ai', async (req, res) => {
  const { topic } = req.body;
  const prompt = `Generate multiple-choice questions on the topic: ${topic}`;


  try {
    const response = await hf.textGeneration({
      model: "google/flan-t5-large", // or other models like "EleutherAI/gpt-neo-2.7B"
      inputs: prompt,
      parameters: { max_new_tokens: 100, temperature: 0.7 }
    });
    // Trim and split the response text
    const questions = response.generated_text.trim().split('\n').filter(q => q); // Filter out empty lines

    // Check if any questions were generated
    if (questions.length === 0) {
      return res.status(400).json({ error: 'No questions generated' });
    }

    // Transform the questions into the desired format
    const formattedQuestions = questions.map(q => {
      // Use regex to match and extract the question, options, and answer
      const questionMatch = q.match(/Question:\s*(.*?)(?=\s*Options:)/);
      const optionsMatch = q.match(/Options:\s*(.*?)(?=\s*Answer:)/);
      const answerMatch = q.match(/Answer:\s*(\w)/); // Matches single letter answer A, B, C, or D

      // If all parts were successfully matched
      if (questionMatch && optionsMatch && answerMatch) {
        const questionText = questionMatch[1].trim();
        const optionsText = optionsMatch[1].trim();
        const answerText = answerMatch[1].trim();

        // Split options into an array
        const options = optionsText.split(/(?=\s*[A-D]\s)/).map(option => option.trim());
        // Convert the answer letter to an index (0 for 'A', 1 for 'B', etc.)
        const answerIndex = answerText.charCodeAt(0) - 'A'.charCodeAt(0);

        return {
          test: questionText,
          Options: options,
          Answer: answerIndex // Presuming the answer is still labeled A, B, C, or D
        };
      } else {
        console.warn(`Skipping malformed question: ${q}`);
        return null; // Return null for this question to skip it
      }
    }).filter(Boolean); // Filter out null values

    res.json({ questions: formattedQuestions });
  } catch (error) {
    console.error("Error generating test:", error);
    res.status(500).json({ error: 'Error generating questions' });
  }
});





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

    console.log("code ::", code);


    if (!code) {
      return res.status(400).json({ message: 'Code parameter is required' });
    }

    const test = await Test.findOne({
      _id: code
    }).select('-__v'); // Excludes the version key
    console.log("test :: ", test);


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
    const test = await Test.findOne({
      _id: code
    }).select('-__v'); // Excludes the version key


    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const correctAnswers = test.questions.map(q => q.correctOption);

    console.log("correctAnswers : ", correctAnswers);


    let correctCount = 0;
    let incorrectCount = 0;

    // Loop through user's answers and compare with correct answers
    answers.forEach((userAnswer, index) => {
      const question = test.questions.find(q => q._id.toString() === userAnswer.questionId);

      console.log("question.correctOption : ", question.correctOption);
      console.log("userAnswer.selectedAnswer : ", userAnswer.selectedAnswer);


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