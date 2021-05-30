import React, { useEffect, useState } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import 'codemirror/theme/material-ocean.css';
import socketIOClient from 'socket.io-client';
let ENDPOINT = 'http://localhost:3333'
const regeneratorRuntime = require("regenerator-runtime");

const servicesModule = require('./modules/services');
const services = servicesModule.services;

import SchemaSelector from './components/SchemaSelector';
import MetricsVisualizer from './components/MetricsVisualizer';
import SchemaButtonsContainer from './components/SchemaButtonsContainer';


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
  const [lastQuerySpeed, setLastQuerySpeed] = useState("-");
  const [lastQuery, setLastQuery] = useState("");
  const [currentPort, setCurrentPort] = useState(services[0].port);
  const [dataSet, setDataSet] = useState([]);
  const [lastHash, setLastHash] = useState("");
 

  
  useEffect(() => {

    //ALLAN'S SOCKET IO BITS
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      if (typeof data.totalDuration === 'number') {
        setLastQuerySpeed(Math.round(data.totalDuration / 1000000));
        setLastQuery(data.clientQuery);
        setLastHash(data.hash);
      }
    });


    //this conditional is required to make sure we don't overwrite the default state of fetchURL before a schema has been selected
    // console.log("inside the userEffect which fires the setTimeout")
  
    // const execButton = document.getElementsByClassName('execute-button');

    // async function fetcher() {
    //   const response = await fetch(
    //     'http://localhost:4000/redis',
    //     {
    //       method: 'GET',
    //       credentials: 'same-origin',
    //     }
    //   )
    //   const responseJson = await response.json();
    //   // console.log(responseJson);
    //   const resolversArr = JSON.parse(responseJson.resolvers);
    //   console.log(resolversArr);
    //   setLastQuerySpeed(Math.round(responseJson.totalDuration / 1000000));

      
    //         // do not put anything above this line!! setTimeout in clicked will give you an innacurate reading for lastQuerySpeed!
    //   let queryNumber;
    //   if (dataSet.length === 0) {
    //     queryNumber = 1;
    //   } else {
    //     queryNumber = dataSet.length + 1;
    //   }
    //   setLastQuery(responseJson.clientQuery);
    //   const dataObj = {
    //     queryNumber: queryNumber,
    //     //resolver3: ....
    //     //...
    //     //resolver1: ...
    //     totalReponseTime: Math.round(responseJson.totalDuration / 1000000)
    //   }
    //   resolversArr.forEach((obj, index) => {
    //     console.log(`resolvers array at index ${index}`)
    //     console.log(obj.duration);
    //     if (!dataObj[`resolver ${index + 1}`]) {
    //       //this is going to be a dumb way to present the data because the data for the reamining resolvers is so small... they'll mostly round out to zero...
    //       dataObj[`resolver${index + 1}`] = Math.round(obj.duration / 1000000);
    //     }
    //   });
    //   setDataSet(prevState => [...prevState, dataObj]);
    // }

    // async function clicked() {
    //   console.log('inside clicked!')
    //   return setTimeout(fetcher, 500);
    //   // responseJson is the metrics object, go ahead and pass it around to the components from here! :)
    // }
    // execButton[0].addEventListener('click', clicked);


  }, []);

  useEffect(() => {
    console.log('inside the gqlApiString useEffect')
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
            console.log('did not find a matching label');
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
    console.log('here is the handlequery button', e); 
    console.log(e.target);
    console.log(e.target.innerText);
    changeCurrentSchema(e.target.innerText);
    console.log(e.target.id);
    const allSchemaButtons = document.getElementsByClassName('schema-button');
    console.log(allSchemaButtons.length);
    for (let i = 0; i < allSchemaButtons.length; i++) {
      allSchemaButtons[i].classList.remove('selected-button');
    }
    // allSchemaButtons.forEach((button) => button.classList.remove('selected-button'));
    e.target.classList.add('selected-button');
  }

  // xAxis uses the 'weekday' as a key to build itself
      // you can change it to anything you want
      const data = [
        // {
        //   queryNumber: 1,
        //   //dogs represe
        //   'dogs': 1,
        //   'cats': 2,
        //   'pets': 3,
        // },
        // {
        //   queryNumber: 2,
        //   'mice': 4,
        //   'dogs': 6,
        //   'cats': 3,
        //   'pets': 9,
        // },
        // {
        //   queryNumber: 3,
        //   'dogs': 8,
        //   'cats': 4,
        //   'pets': 12,
        // },      
      ]

      const [testData, setTestData] = useState(data);

  const handleSaveClick = () => {
   //delete if this works
  //  setDataSet([...dataSet, 
  //   {distance:lastQuerySpeed,
  //    colors:[
  //     "#fd1d1d",
  //     "#833ab4"],
  //     query: lastQuery,
  //   }
  //   ])
    setTestData([...testData, 
    {
      queryNumber: 4,
          'dogs': 3,
          'cats': 7,
          'pets': lastQuerySpeed,
    }])
  console.log("testing for handleSaveClick");

  }

  const handleCacheClick = async () => {
    console.log('fetching from redis');
    const response = await fetch(
      `http://localhost:4000/redis/${lastHash}`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    )
    const responseJson = await response.json();
    console.log(responseJson);
  }

  return (
    //this outermost div MUST have the id of 'graphiql' in order for graphiql to render properly
    //the defaultQuery prop currently relates to the default 'Users' DB - not currently working as intended
    <div id='graphiql' className="main-container">
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
      <SchemaButtonsContainer
        schemaList={schemaList}
        handleQuery={handleQuery}
      />
      <MetricsVisualizer 
      lastQuerySpeed={lastQuerySpeed}
      dataSet={dataSet}
      setDataSet={setDataSet}
      handleSaveClick={handleSaveClick}
      handleCacheClick={handleCacheClick}
      testData={testData}
      setTestData={setTestData}
      />
      <GraphiQL clasName="graphiql"
      editorTheme="material-ocean"
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