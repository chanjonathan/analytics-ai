import React, { useEffect, useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import Graph from './Graph';
import './App.css';
import { useWhisper } from '@chengsokdara/use-whisper'
const { Configuration, OpenAIApi } = require("openai");

const JONATHAN_OPENAI_KEY =
  "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";

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

  const configuration = new Configuration({
    apiKey: JONATHAN_OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const [inputText, setInputText] = useState('');

  const handleRecord = () => {
    startRecording();
  };

  const handleStop = () => {
    stopRecording();
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputText(newValue);
  };

  const handleSubmit = () => {
    submit().then((response) => {
      console.log(response.data.choices[0].text);
    })
  }

async function submit() {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "input:  Pull up the dashboard for total participants in Canada who dined out at McDonalds\noutput: country=\"Canada\"?restaurant=\"McDonalds\"\n" + inputText,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response;
}
  
useEffect(() => {
  setInputText(transcript.text);
}, [transcript.text]);

  return (
    <div className="container">
      <h1 className="title">Analytics<span className="light">AI</span></h1>
      <div className="input-container">
        <input type="text" className="input" value={inputText} onChange={handleInputChange}/>
        <div>        
          {recording ?
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
