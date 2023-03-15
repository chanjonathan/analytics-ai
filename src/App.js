import React from 'react';
import { FaMicrophone } from 'react-icons/fa';
import Graph from './Graph';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="input-container">
        <input type="text" className="input" />
        <FaMicrophone className="microphone-icon" />
      </div>
      <Graph />
    </div>
  );
}

export default App;
