import React, { useEffect, useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
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

  const [inputText, setInputText] = useState('');
  const [recordingState, setRecordingState] = useState(false);

  const handleRecord = () => {
    setRecordingState(true);
    startRecording();
  }

  const handleStop = () => {
    setRecordingState(false);
    stopRecording();
  }

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  const handleSubmit = () => {
  }

  useEffect(() => {
    setInputText(transcript.text);
  }, [transcript.text]);

  return (
    <div className="container">
      <h1>Text to Dashboard</h1>
      <div className="input-container">
        <input type="text" className="input" value={inputText} onChange={handleInputChange}/>
        <div>        
          {recordingState ?
                    
                    <FaStop className="stop-icon" onClick={handleStop} />
                    :
                    <FaMicrophone className="microphone-icon" onClick={handleRecord} />
          }
        </div>
      </div>
      <button onClick={handleSubmit}>Submit</button>
      <Graph />
    </div>
  );
}

export default App;