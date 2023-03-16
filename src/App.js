import React, { useEffect, useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import Graph from "./Graph";
import "./App.css";
import { useWhisper } from "@chengsokdara/use-whisper";
const { Configuration, OpenAIApi } = require("openai");

const JONATHAN_OPENAI_KEY =
  "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";

const PROMPT = `give me nps score count for mcdonald survey completion
{\"query\":\"select \\\"NPS\\\", count(*) from public.\\\"McDonald_Survey\\\" group by \\\"NPS\\\"\",\"title\":\"NPS\",\"x-label\":\"NPS Score\",\"y-label\":\"Count\",\"chart-type\":\"bar\"}

give me the csat score for mcdonald survey
{\"query\":\"select mds.\\\"name\\\", count(*) from public.\\\"McDonald_Survey\\\" as ms join public.\\\"McDonald_DataSet\\\" as mds on ms.\\\"id\\\"= mds.\\\"entity_data_id\\\" and mds.\\\"attribute_id\\\"=10 group by mds.\\\"name\\\"\",\"title\":\"CSAT\",\"x-label\":\"CSAT Score\",\"y-label\":\"Count\",\"chart-type\":\"pie\"}

give me the csat score
{\"query\":\"select mds.\\\"name\\\", count(*) from public.\\\"McDonald_Survey\\\" as ms join public.\\\"McDonald_DataSet\\\" as mds on ms.\\\"id\\\"= mds.\\\"entity_data_id\\\" and mds.\\\"attribute_id\\\"=10 group by mds.\\\"name\\\"\",\"title\":\"CSAT\",\"x-label\":\"CSAT Score\",\"y-label\":\"Count\",\"chart-type\":\"pie\"}

give me nps score count
{\"query\":\"select \\\"NPS\\\", count(*) from public.\\\"McDonald_Survey\\\" group by \\\"NPS\\\"\",\"title\":\"NPS\",\"x-label\":\"NPS Score\",\"y-label\":\"Count\",\"chart-type\":\"bar\"}

give me nps score count for mcdonald survey"
{\"query\":\"select \\\"NPS\\\", count(*) from public.\\\"McDonald_Survey\\\" group by \\\"NPS\\\"\",\"title\":\"NPS\",\"x-label\":\"NPS Score\",\"y-label\":\"Count\",\"chart-type\":\"bar\"}

hey pull up the csat score the the mcdonalds survey
{\"query\":\"select mds.\\\"name\\\", count(*) from public.\\\"McDonald_Survey\\\" as ms join public.\\\"McDonald_DataSet\\\" as mds on ms.\\\"id\\\"= mds.\\\"entity_data_id\\\" and mds.\\\"attribute_id\\\"=10 group by mds.\\\"name\\\"\",\"title\":\"CSAT\",\"x-label\":\"CSAT Score\",\"y-label\":\"Count\",\"chart-type\":\"pie\"}`

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
    setContainerStatus('animated-container full')
    setInputText('');
    muteChange = true;
    startRecording();
  };

  const handleStop = () => {
    muteChange = false;
    stopRecording();
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputText(newValue);
  };

  const [dataState, setDataState] = useState({ label: [], count: [] });
  let muteChange = false;
  const [config, setConfig] = useState({});

  async function handleSubmit(input) {
    const sqlString = await getSQL(input);
    const jsonQuery = JSON.stringify({ query: sqlString })
    const jsonResponse = await fetch('http://10.20.77.37:8080/runquery', {
      method: 'POST',
      body: jsonQuery,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    jsonResponse.json().then((responseData) => { 
      setDataState(responseData);
    })
    handleContainerStatus();
  };

  async function getSQL(input) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        PROMPT +
        '\n' + input,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const json = response.data.choices[0].text
    const answerObject = JSON.parse(json);
    let answer = answerObject.query;
    setConfig(answerObject);
    return answer;
  }

  useEffect(() => {
    const transcriptText = transcript.text ||'';
    setInputText(transcriptText);
    if (transcriptText && !muteChange) {
      handleSubmit(transcriptText);
    }
  }, [transcript.text]);

  const [containerStatus, setContainerStatus] = useState("animated-container full");

  const handleContainerStatus = () => {
    setContainerStatus("animated-container top-container");
  };


  return (
    <div className="center">
      <div className={containerStatus}>
        <div className="center center-box">
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
        </div>
      </div>
      <div className="graph-container">
      <Graph props={ { dataState, config } }/>
      </div>
    </div>
  );
}

export default App;
