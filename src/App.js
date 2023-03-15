import React from 'react';
import { FaMicrophone } from 'react-icons/fa';
import Graph from './Graph';
import './App.css';
import { useWhisper } from '@chengsokdara/use-whisper'

const JONATHAN_OPENAI_KEY = "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";

function App() {

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: JONATHAN_OPENAI_KEY
  })

  

  return (
    <div className="container">
      <h1>Text to Dashboard</h1>
      <div className="input-container">
        <input type="text" className="input" value={transcript.text}/>
        <button onClick={startRecording}>Record</button>
        <button onClick={stopRecording}>Stop</button>
        <FaMicrophone className="microphone-icon" />
      </div>
      <Graph />
    </div>
  );
}

export default App;