import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/main.css';

function HomePage() {
  return (
    <div className="container home-page">
    <h1>Welcome to Exam Portal</h1>
    <div className="button-container">
      <Link to="/attempt-test" className="button">
        Attempt Test
      </Link>
      <Link to="/create-test" className="button">
        Create Test
      </Link>
    </div>
  </div>
  );
}

export default HomePage;