import React, { useEffect, useState } from "react";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import "codemirror/theme/material-ocean.css";
import socketIOClient from "socket.io-client";
let ENDPOINT = "http://localhost:3333";
const regeneratorRuntime = require("regenerator-runtime");

const servicesModule = require("./modules/services");
const services = servicesModule.services;
const barDataOptionsModule = require("./modules/barDataOptions");
const data = barDataOptionsModule.data;
const defaultOptions = barDataOptionsModule.defaultOptions;

import SchemaSelector from "./components/SchemaSelector";
import MetricsVisualizer from "./components/MetricsVisualizer";
import SchemaButtonsContainer from "./components/SchemaButtonsContainer";

const App = () => {
  const [currentSchema, changeCurrentSchema] = useState("");
  const [schemaList, updateSchemaList] = useState(["SWAPI", "Users"]);
  const [fetchURL, setFetchURL] = useState(
    `http://localhost:${services[0].port}/graphql`
  );
  const [lastQuerySpeed, setLastQuerySpeed] = useState("-");
  const [lastQuery, setLastQuery] = useState("");
  const [currentPort, setCurrentPort] = useState(services[0].port);
  const [dataSet, setDataSet] = useState([]);
  const [lastHash, setLastHash] = useState("");
  const [testData, setTestData] = useState(data);
  const [queryNumber, setQueryNumber] = useState(1);
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      if (typeof data.totalDuration === "number") {
        setLastQuerySpeed(Math.round(data.totalDuration / 1000000));
        setLastQuery(data.clientQuery);
        setLastHash(data.hash);
      }
    });
  }, []);

  useEffect(() => {
    //this conditional is required to make sure we don't overwrite the default state of fetchURL before a schema has been selected
    if (currentSchema !== "") {
      let gqlApiString;
      let port;
      for (let i = 0; i < services.length; i++) {
        // console.log(`LABEL for ${i} iteration: ${services[i].label}`);
        if (services[i].label === currentSchema) {
          port = services[i].port;
          gqlApiString = `http://localhost:${port}/graphql`;
          break;
        } else {
          console.log("did not find a matching label");
        }
      }
      setCurrentPort(port);
      setFetchURL(gqlApiString);
    }
  });

  const handleSchemaButtonClick = (e) => {
    e.preventDefault();
    changeCurrentSchema(e.target.innerText);
    const allSchemaButtons = document.getElementsByClassName(
      "schema-list-element"
    );
    console.log(allSchemaButtons.length);
    for (let i = 0; i < allSchemaButtons.length; i++) {
      allSchemaButtons[i].children[0].classList.remove(
        "schema-button-selected"
      );
    }
    e.target.classList.add("schema-button-selected");
  };

  const handleSaveClick = () => {
    const copy = [...testData.datasets];
    copy[0].data = [...copy[0].data, lastQuerySpeed];
    copy[0].queries = [...copy[0].queries, lastQuery];
    copy[0].cacheTime = [...copy[0].cacheTime, ""];
    setTestData((prevState) => ({
      ...prevState,
      labels: [...prevState.labels, `Query #${queryNumber}: ${currentSchema}`],
      datasets: copy,
    }));
    setQueryNumber(queryNumber + 1);
  };

  const handleCacheClick = async () => {
    const response = await fetch(`http://localhost:4000/redis/${lastHash}`, {
      method: "GET",
      credentials: "same-origin",
    });
    const responseJson = await response.json();
    const cacheTime = responseJson.cacheTime;
    const copy = [...testData.datasets];
    copy[0].cacheTime[
      copy[0].cacheTime.length - 1
    ] = `Cached Query Response Time: ${cacheTime} microseconds`;
    setTestData((prevState) => ({
      ...prevState,
      datasets: copy,
    }));
  };

  return (
    //this outermost div MUST have the id of 'graphiql' in order for graphiql to render properly
    <div id="graphiql" className="main-container">
      <SchemaSelector
        currentSchema={currentSchema}
        changeCurrentSchema={changeCurrentSchema}
        schemaList={schemaList}
        updateSchemaList={updateSchemaList}
        fetchURL={fetchURL}
        setFetchURL={setFetchURL}
        currentPort={currentPort}
        setCurrentPort={setCurrentPort}
      />
      <SchemaButtonsContainer
        schemaList={schemaList}
        handleSchemaButtonClick={handleSchemaButtonClick}
      />
      <MetricsVisualizer
        lastQuerySpeed={lastQuerySpeed}
        dataSet={dataSet}
        setDataSet={setDataSet}
        handleSaveClick={handleSaveClick}
        handleCacheClick={handleCacheClick}
        testData={testData}
        setTestData={setTestData}
        options={options}
      />
      <GraphiQL
        clasName="graphiql"
        editorTheme="material-ocean"
        fetcher={async (graphQLParams) => {
          const data = await fetch(fetchURL, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(graphQLParams),
            credentials: "same-origin",
          });
          return data.json().catch(() => data.text());
        }}
      />
    </div>
  );
};

export default App;
