import React, { useEffect, useState } from "react";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
const regeneratorRuntime = require("regenerator-runtime");

const servicesModule = require("./services");
const services = servicesModule.services;

import Heading from "./Heading";
import SchemaSelector from "./SchemaSelector";
import MetricsVisualizer from "./MetricsVisualizer";
import SchemaButtonsContainer from "./SchemaButtonsContainer";
import ShellButton from "./ShellButton";
import UploadFile from "./uploadFile";


/*
minified CSS is currently being pulled from the graphiql module. If we want to get more
granular, we can: https://github.com/graphql/graphiql/tree/main/packages/graphiql/src/css 

The graphiql/packages/graphiql repo has info in the readme pertaining 
to the props that GraphiQL can accept: https://github.com/graphql/graphiql/blob/main/packages/graphiql/README.md
*/

const App = () => {
  const [currentSchema, changeCurrentSchema] = useState("");
  //we probably want to give this the relevant data 'starter' object in services.js as its default state - (services[0].label) rather than hard coding this here
  const [schemaList, updateSchemaList] = useState(["SWAPI", "Users"]);
  const [fetchURL, setFetchURL] = useState(
    `http://localhost:${services[0].port}/graphql`
  );
  const [lastQuerySpeed, setLastQuerySpeed] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [currentPort, setCurrentPort] = useState(services[0].port);
  const [dataSet, setDataSet] = useState([]);

  useEffect(() => {
    //this conditional is required to make sure we don't overwrite the default state of fetchURL before a schema has been selected

    const execButton = document.getElementsByClassName("execute-button");

    async function fetcher() {
      const response = await fetch("http://localhost:4000/redis", {
        method: "GET",
        credentials: "same-origin",
      });
      const responseJson = await response.json();
      console.log(responseJson);
      const arrayOfResolvers = JSON.stringify(responseJson.resolvers);
      console.log(arrayOfResolvers);
      // for(let i = 0; i < responseJson.subqueryDuration.length; i++){
      //   console.log(JSON.stringify(arrayOfDuration[i]));

      // }
      // console.log('***THIS IS RESPONSEJSON****', responseJson.subqueryDuration);
      setLastQuerySpeed(Math.round(responseJson.totalDuration / 1000000));
      setLastQuery(responseJson.clientQuery);
    }

    async function clicked() {
      return setTimeout(fetcher, 0);
      // responseJson is the metrics object, go ahead and pass it around to the components from here! :)
    }
    execButton[0].addEventListener("click", clicked);
  }, []);

  useEffect(() => {
    console.log("inside the gqlApiString useEffect");
    //this conditional is required to make sure we don't overwrite the default state of fetchURL before a schema has been selected
    if (currentSchema !== "") {
      //this does not work correctly if we delete SWAPI first and then try and click Users
      let gqlApiString;
      let port;

      for (let i = 0; i < services.length; i++) {
        console.log(`LABEL for ${i} iteration: ${services[i].label}`);
        if (services[i].label === currentSchema) {
          port = services[i].port;
          gqlApiString = `http://localhost:${port}/graphql`;
          break;
        } else {
          console.log("did not find a matching label");
        }
      }
      //this conditional exists to get round a browser console error, it assumes that we'll have at least 1 object in services.js array
      // if (schemaList.length > 1) {
      setCurrentPort(port);
      setFetchURL(gqlApiString);
      // }
    }
  });

  // console.log(`timeData outside of func: ${timeData}`)
  // console.log(Array.isArray(timeData))

  function handleQuery(e) {
    e.preventDefault();
    console.log("here is the handlequery button", e);
    console.log(e.target);
    console.log(e.target.innerText);
    changeCurrentSchema(e.target.innerText);
    console.log(e.target.id);
    const allSchemaButtons = document.getElementsByClassName("schema-button");
    console.log(allSchemaButtons.length);
    for (let i = 0; i < allSchemaButtons.length; i++) {
      allSchemaButtons[i].classList.remove("selected-button");
    }
    // allSchemaButtons.forEach((button) => button.classList.remove('selected-button'));
    e.target.classList.add("selected-button");
  }

  const handleSaveClick = () => {
    //delete if this works
    setDataSet([
      ...dataSet,
      {
        distance: lastQuerySpeed,
        colors: ["#fd1d1d", "#833ab4"],
        query: lastQuery,
      },
    ]);
  };

  const runShellScript = () => {
    fetch('http://localhost:3333/shell')
      .then(data => data.json())
      .then(data => console.log(data))
  }

  const getFilePath = () => {
    const filePath = document.getElementById("myFile").files[0];

    const formData  = new FormData();

    formData.append('file', new Blob([formData]));

    // for(const name in data) {
    //   formData.append(name, data[name]);
    // }
    // const two = 'two';
    // // const body = {}
    console.log(filePath);
    console.log(typeof filePath);
    fetch("http://localhost:3333/getFilePath", {
      method: "POST",
      body: formData,
      mode: "cors"
    })
    .then(data => data.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
      
  }

  return (
    //this outermost div MUST have the id of 'graphiql' in order for graphiql to render properly
    //the defaultQuery prop currently relates to the default 'Users' DB - not currently working as intended
    <div id="graphiql" className="main-container">
      <Heading />

      <SchemaSelector
        currentSchema={currentSchema}
        changeCurrentSchema={changeCurrentSchema}
        handleQuery={handleQuery}
        schemaList={schemaList}
        updateSchemaList={updateSchemaList}
        fetchURL={fetchURL}
        setFetchURL={setFetchURL}
        currentPort={currentPort}
        setCurrentPort={setCurrentPort}
      />
      <UploadFile getFilePath={getFilePath}/>
      <ShellButton runShellScript={runShellScript}/>
      <MetricsVisualizer
        lastQuerySpeed={lastQuerySpeed}
        dataSet={dataSet}
        setDataSet={setDataSet}
        handleSaveClick={handleSaveClick}
      />
      <SchemaButtonsContainer
        schemaList={schemaList}
        handleQuery={handleQuery}
      />
      <GraphiQL
        // defaultQuery="# Here's a sample query to get you started: \n\n{userById(id:1){\nusername\npassword\n}\n}"
        //this defaultQuery is not as easy as anticipated... see: https://github.com/graphql/graphiql/blob/fedbc6130939c1e34b29d23257aed7e858bfca0b/src/components/GraphiQL.js#L903-L931
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
