import React, { useEffect, useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import Graph from "./Graph";
import "./App.css";
import { useWhisper } from "@chengsokdara/use-whisper";
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
    apiKey: JONATHAN_OPENAI_KEY,
    stopTimeout: 1000,
  });

  const configuration = new Configuration({
    apiKey: JONATHAN_OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const [inputText, setInputText] = useState("");

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

  const [dataState, setDataState] = useState({ labels: [], counts: [] });

  async function handleSubmit() {
    const sqlString = JSON.stringify({ query: 'select \"NPS\" as label, count(*) from public.\"McDonald_Survey\" group by \"NPS\";' });
    // const sqlString = await getSQL();
    const jsonResponse = await fetch('http://10.20.77.37:8080/runquery', {
      method: 'POST',
      body: sqlString,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // const graphData = await fetch(jsonResponse.json());
    jsonResponse.json().then((responseData) => { setDataState(responseData) })
  };

  async function getSQL() {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        'input:  Pull up the dashboard for total participants in Canada who dined out at McDonalds\noutput: country="Canada"?restaurant="McDonalds"\n' +
        inputText,
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

  const [containerStatus, setContainerStatus] = useState("animated-container full");

  const handleContainerStatus = () => {
    setContainerStatus("animated-container top-container");
  };

  return (
    <div className="container">
      <div className={containerStatus}>
        <h1 className="title">
          Analytics<span className="light">AI</span>
        </h1>
        <div className="input-container">
          <input
            type="text"
            className="input"
            value={inputText}
            onChange={handleInputChange}
          />
          {recording ? (
            <FaStop className="stop-icon" onClick={handleStop} />
          ) : (
            <FaMicrophone className="microphone-icon" onClick={handleRecord} />
          )}
        </div>
      <button onClick={handleSubmit}>Submit</button>
      </div>
      <div className="graph-container">
      <Graph props={ dataState }/>
      </div>
    </div>
  );
}

export default App;
