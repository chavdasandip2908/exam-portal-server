import axios from 'axios';
import React, { useState } from 'react';

function AttemptTestPage() {
  const [testCreator, setTestCreator] = useState('sandip');
  const [testCode, setTestCode] = useState('66ea5cf8a74c20bcaf30fe9c');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reviewLater, setReviewLater] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [reviewLaterForm, setReviewLaterForm] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null); // To store the test result

  // console.log("reviewLater ::: ",reviewLater);


  const startTest = async () => {
    // Here we'll add the API call to validate test creator and code

    try {
      const response = await axios.get(`http://localhost:5000/api/test/${testCode}`);
      setTestStarted(true);
      console.log(response.data.test);

      setTestQuestions(response.data.test.questions)

    } catch (error) {
      console.error('Error creating test:', error);
    }

    // console.log({ testCreator, testCode });
    // setTestStarted(true);
  };

  // Handle when the user selects an answer
  const handleAnswer = (selectedOption) => {
    const updatedAnswers = [...answers];

    // Check if answer for this question already exists, and update it
    const existingAnswerIndex = updatedAnswers.findIndex(ans => ans.questionId === currentQ._id);
    if (existingAnswerIndex !== -1) {
      updatedAnswers[existingAnswerIndex].selectedAnswer = selectedOption;
    } else {
      updatedAnswers.push({
        questionId: currentQ._id, // Assuming each question has a unique _id
        selectedAnswer: selectedOption
      });
    }

    setAnswers(updatedAnswers); // Update the state with new answers array
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

  // Function to handle the test submission
  const handleSubmitTest = async () => {

    if (reviewLater.length > 0) {
      console.log("reviewLater.length", reviewLater.length);

      setReviewLaterForm(true);
      return true;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/test/submit/${testCode}`, {
        answers: answers
      });

      // Handle the successful response
      setResult(response.data);
      console.log('Test submitted successfully:', response.data);

    } catch (error) {
      console.error('Error submitting test:', error);
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

  if (result) {
    return (
      <div>
        <p>Correct Answers: {result.correctAnswers}</p>
        <p>Incorrect Answers: {result.incorrectAnswers}</p>
      </div>
    )
  }



  const currentQ = testQuestions[currentQuestion];

  return (
    <div className="test-in-progress">
      <h2>Question {currentQuestion + 1}</h2>
      <p>{currentQ.question}</p>
      {currentQ.options.map((option, index) => (
        <>
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
          <br />
        </>
      ))}
      <div className="navigation-buttons">
        {currentQuestion > 0 && <button onClick={handlePrevious}>Previous</button>}
        <button className='button' onClick={() => handleNext()}>Skip</button>
        <button className='button' onClick={() => handleReviewLater()}>Mark for Review</button>
        {currentQuestion < testQuestions.length - 1 ? (
          <button className='button' onClick={handleNext}>Next</button>
        ) : (
          <button className='button' onClick={handleSubmitTest}>Submit</button>
        )}
      </div>
    </div>
  );




}

export default AttemptTestPage;