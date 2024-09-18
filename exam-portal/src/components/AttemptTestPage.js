import axios from 'axios';
import React, { useState } from 'react';

function AttemptTestPage() {
  const [testCreator, setTestCreator] = useState('');
  const [testCode, setTestCode] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [reviewLater, setReviewLater] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Dummy test data (replace with actual API call)
  const testQuestions = [
    { id: 1, question: "What is 2 + 2?", options: ["3", "4", "5", "6"] },
    { id: 2, question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"] },
    // Add more questions...
  ];

  const startTest = async () => {
    // Here we'll add the API call to validate test creator and code

    try {
      const response = await axios.get(`http://localhost:5000/api/test/${testCode}`);
      setTestStarted(true);
      console.log(response.data.code);
    } catch (error) {
      console.error('Error creating test:', error);
    }

    // console.log({ testCreator, testCode });
    // setTestStarted(true);
  };

  const handleAnswer = (answer) => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
  };

  const handleReviewLater = () => {
    if (!reviewLater.includes(currentQuestion)) {
      setReviewLater([...reviewLater, currentQuestion]);
    }
    handleNext();
  };

  const handleNext = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (!testStarted) {
    return (
      <div className="attempt-test-page">
        <h1>Attempt Test</h1>
        <input
          type="text"
          value={testCreator}
          onChange={(e) => setTestCreator(e.target.value)}
          placeholder="Test Creator"
          required
        />
        <input
          type="text"
          value={testCode}
          onChange={(e) => setTestCode(e.target.value)}
          placeholder="Test Code"
          required
        />
        <button className='button' onClick={startTest}>Start Test</button>
      </div>
    );
  }

  if (testCompleted) {
    // Display test results here
    return (
      <div className="test-completed">
        <h1>Test Completed</h1>
        {/* Display results */}
      </div>
    );
  }

  const currentQ = testQuestions[currentQuestion];

  return (
    <div className="test-in-progress">
      <h2>Question {currentQuestion + 1}</h2>
      <p>{currentQ.question}</p>
      {currentQ.options.map((option, index) => (
        <button className='button' key={index} onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
      <div className="navigation-buttons">
        {currentQuestion > 0 && <button onClick={handlePrevious}>Previous</button>}
        <button onClick={() => handleNext()}>Skip</button>
        <button onClick={handleReviewLater}>Mark for Review</button>
        {currentQuestion < testQuestions.length - 1 ? (
          <button className='button' onClick={handleNext}>Next</button>
        ) : (
          <button className='button' onClick={() => setTestCompleted(true)}>Submit</button>
        )}
      </div>
    </div>
  );
}

export default AttemptTestPage;