import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateTestPage from './components/CreateTestPage';
import AttemptTestPage from './components/AttemptTestPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-test" element={<CreateTestPage />} />
          <Route path="/attempt-test" element={<AttemptTestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
