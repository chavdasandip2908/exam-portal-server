import React, { useState } from 'react';
import axios from 'axios';

function CreateTestPage() {
  const [testName, setTestName] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctOption: '' }]);
  const [testCode, setTestCode] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: '' }]);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctOption = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/test/create', {
        name: testName,
        creator: 'User', // In a real app, this would be the logged-in user
        questions: questions
      });
      setTestCode(response.data.code);
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  return (
    <div className="container create-test-page">
      <h1>Create Test</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={testName} 
          onChange={(e) => setTestName(e.target.value)} 
          placeholder="Test Name" 
          required 
        />
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <input 
              type="text" 
              value={q.question} 
              onChange={(e) => handleQuestionChange(qIndex, e)} 
              placeholder="Question" 
              required 
            />
            {q.options.map((option, oIndex) => (
              <input 
                key={oIndex}
                type="text" 
                value={option} 
                onChange={(e) => handleOptionChange(qIndex, oIndex, e)} 
                placeholder={`Option ${oIndex + 1}`} 
                required 
              />
            ))}
            <select 
              value={q.correctOption} 
              onChange={(e) => handleCorrectOptionChange(qIndex, e)} 
              required
            >
              <option value="">Select Correct Option</option>
              {q.options.map((_, index) => (
                <option key={index} value={index}>Option {index + 1}</option>
              ))}
            </select>
          </div>
        ))}
        <button type="button" className="button" onClick={addQuestion}>Add New Question</button>
        <button type="submit" className="button f-end">Create Test</button>
      </form>
      {testCode && (
        <div className="test-code">
          <h2>Test Created Successfully!</h2>
          <p>Your test code is: <strong>{testCode}</strong></p>
          <p>Share this code with test takers.</p>
        </div>
      )}
    </div>
  );
}

export default CreateTestPage;