import React, { useEffect, useState } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
const regeneratorRuntime = require("regenerator-runtime");

const timeDataModule = require('./timeData');
const timeData = timeDataModule.timeData;

import Heading from './Heading';
import SchemaSelector from './SchemaSelector'
import MetricsVisualizer from './MetricsVisualizer';

/*
minified CSS is currently being pulled from the graphiql module. If we want to get more
granular, we can: https://github.com/graphql/graphiql/tree/main/packages/graphiql/src/css 

The graphiql/packages/graphiql repo has info in the readme pertaining 
to the props that GraphiQL can accept: https://github.com/graphql/graphiql/blob/main/packages/graphiql/README.md
*/

const App = () => {
  const [fetchURL, setFetchURL] = useState('http://localhost:4001/graphql');
  const [lastQuerySpeed, setLastQuerySpeed] = useState("");

  useEffect(() => {
    const execButton = document.getElementsByClassName('execute-button');
    function clicked() {
      //console.log(timeData);
      // const resultWrap = document.getElementsByClassName('resultWrap');
      // console.log(resultWrap);
      // const durationSpans = document.getElementsByClassName('cm-number');
      // console.log(durationSpans[2])
      //console.log('this is the span for the duration button', document.querySelectorAll('[role="presentation"]:last-of-type'.innerText)
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
      setLastQuerySpeed(Math.round(durationSpans[2].innerText / 1000000 ));
      // console.log(lastQuerySpeed);
    }

    // const durationSpan = document.getElementsByClassName('cm-number');
    // console.log(durationSpan[0]);

    // function listenToLastData() {
    //   // if (timeData.length > 1) //may not need this as we're inside useEffect
    //   console.log(`timeData inside func: ${timeData}`);

    // }
    execButton[0].addEventListener('click', clicked);
  }, [])

  // console.log(`timeData outside of func: ${timeData}`)
  // console.log(Array.isArray(timeData))


  return (
    //this outermost div MUST have the id of 'graphiql' in order for graphiql to render properly
    <div id='graphiql' className="main-container">
    

    <Heading/>
    <SchemaSelector fetchURL={fetchURL} setFetchURL={setFetchURL}/>
    <MetricsVisualizer lastQuerySpeed={lastQuerySpeed}/>
    <GraphiQL
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