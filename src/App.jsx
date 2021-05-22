import React, { useEffect, useState } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
const regeneratorRuntime = require("regenerator-runtime");

const servicesModule = require('./services');
const services = servicesModule.services;

import Heading from './Heading';
import SchemaSelector from './SchemaSelector';
import MetricsVisualizer from './MetricsVisualizer';
import SchemaButtonsContainer from './SchemaButtonsContainer';

/*
minified CSS is currently being pulled from the graphiql module. If we want to get more
granular, we can: https://github.com/graphql/graphiql/tree/main/packages/graphiql/src/css 

The graphiql/packages/graphiql repo has info in the readme pertaining 
to the props that GraphiQL can accept: https://github.com/graphql/graphiql/blob/main/packages/graphiql/README.md
*/

const App = () => {
  const [currentSchema, changeCurrentSchema] = useState(""); 
  //we probably want to give this the relevant data 'starter' object in services.js as its default state - (services[0].label) rather than hard coding this here
  const [schemaList, updateSchemaList] = useState(['SWAPI','Users']);
  const [fetchURL, setFetchURL] = useState(`http://localhost:${services[0].port}/graphql`);
  const [lastQuerySpeed, setLastQuerySpeed] = useState("");

  
  useEffect(() => {
    //this conditional is required to make sure we don't overwrite the default state of fetchURL before a schema has been selected
    if (currentSchema !== "") {
    let gqlApiString;
      for (let i = 0; i < services.length; i++) {
        if (services[i].label === currentSchema) {
          gqlApiString = `http://localhost:${services[i].port}/graphql`;
          break;
        }
      }
      //this conditional exists to get round a browser console error, it assumes that we'll have at least 1 object in services.js array
      if (schemaList.length > 1) {
      setFetchURL(gqlApiString);
    }
  }
  
    const execButton = document.getElementsByClassName('execute-button');
    function clicked() {
      let durationNode;
      const durations = document.getElementsByClassName('cm-property');
      for (let i = 0; i < durations.length; i++) {
        if (durations[i].innerText === "\"duration\"") {
          console.log("found at " + i + " index")
          durationNode = durations[i];
          break;
        }
      }
        const homeNode = durationNode.parentNode.childNodes;
        console.log(homeNode[4].innerText);
      //index 1 here, as index 0 refers to the version property in extensions in the gql result
      setLastQuerySpeed(Math.round(homeNode[4].innerText / 1000000 ));
    }
    execButton[0].addEventListener('click', clicked);


  });

  // console.log(`timeData outside of func: ${timeData}`)
  // console.log(Array.isArray(timeData))

  function handleQuery(e) {
    e.preventDefault();
    console.log('here is the handlequery button', e); 
    console.log(e.target);
    console.log(e.target.innerText);
    changeCurrentSchema(e.target.innerText);
  }

  return (
    //this outermost div MUST have the id of 'graphiql' in order for graphiql to render properly
    //the defaultQuery prop currently relates to the default 'Users' DB - not currently working as intended
    <div id='graphiql' className="main-container">
    

    <Heading/>
    
    <SchemaSelector 
    currentSchema={currentSchema}
    changeCurrentSchema={changeCurrentSchema}
    handleQuery={handleQuery} 
    schemaList={schemaList} 
    updateSchemaList={updateSchemaList} 
    fetchURL={fetchURL} 
    setFetchURL={setFetchURL}/>
    <MetricsVisualizer lastQuerySpeed={lastQuerySpeed}/>
    <SchemaButtonsContainer
      schemaList={schemaList}
      handleQuery={handleQuery}
    />
    <GraphiQL
    // defaultQuery="# Here's a sample query to get you started: \n\n{userById(id:1){\nusername\npassword\n}\n}"
    //this defaultQuery is not as easy as anticipated... see: https://github.com/graphql/graphiql/blob/fedbc6130939c1e34b29d23257aed7e858bfca0b/src/components/GraphiQL.js#L903-L931
    fetcher={async graphQLParams => {
      const data = await fetch(
        fetchURL,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphQLParams),
          credentials: 'same-origin',
        },
      );
      return data.json().catch(() => data.text());
    }}
    />
  </div>
  );
  };

export default App;