import React, { useState, useEffect } from "react";
const servicesModule = require('../modules/services');
const services = servicesModule.services;
//these don't work - will need another solution...
// const timeDataModule = require('./timeData');
// const timeData = timeDataModule.timeData;
// const newServerModule = require('./../newServerInstance');
// const createNewApolloServer = newServerModule.allanExportTest;

import Heading from './Heading';

const schemaDisplay = (props) => {
  // These are the react hooks
  // const [currentSchema, changeCurrentSchema] = useState(""); 
  const [input, inputChange] = useState("");
  const [uriInput, changeUri] = useState("");
  const {currentSchema} = props;
  const {changeCurrentSchema} = props;
  const { schemaList } = props;
  const { updateSchemaList } = props;
  const { handleQuery } = props;
  //not getting used - delete?
  const { fetchURL } = props;
  const { setFetchURL } = props;
  const { currentPort } = props;
  const { setCurrentPort } = props;

  useEffect(() => {
    //this functionality is in useEffect rather than handleQuery due to the async nature of updating state.
    // let gqlApiString;
    //   for (let i = 0; i < services.length; i++) {
    //     if (services[i].label === currentSchema) {
    //       gqlApiString = `http://localhost:${services[i].port}/graphql`;
    //       break;
    //     }
    //   }
    //   //this conditional exists to get round a browser console error, it assumes that we'll have at least 1 object in services.js array
    //   if (schemaList.length > 1) {
    //   setFetchURL(gqlApiString);
    // }
  })

  // These are all the button methods:
  //TO DO: COME BACK AND REFACTOR
  // function handleDelete(e) {
  //   //When we click the delete button we want to do the following:
  //   //remove the button from the schemaList (where the name corresponds to the currentSchema)
  //   //reset currentSchema to none selected / blank string
  //   updateSchemaList(schemaList.filter((el) => {return el !== currentSchema}));
  //   //you're probably going to want to do the kill port bit before you erase the reference to currentSchema in state
  //    //kill the node process for the corresponding port specified in the services array where the property 
  //    //'label' matches the schema name - see this article: https://melvingeorge.me/blog/kill-nodejs-process-at-specific-port-linux
  //   changeCurrentSchema("");
      
  //    //TBD on this fetch method...was just an idea, not sure if could work.
  //   // fetch("", {
  //   //   method: "DELETE",
  //   // })
  //   //   .then((res) => res.json())
  //   //   .then((data) => {})
  //   //   .catch((err) => console.log(err));
  // }

  function handleDelete(e) {
    setFetchURL(`http://localhost:${services[0].port}/graphql`)
    //When we click the delete button we want to do the following:
    //remove the button from the schemaList (where the name corresponds to the currentSchema)
    //reset currentSchema to none selected / blank string
    fetch(`http://localhost:3333/deleteServer/${currentPort}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(data => {
        data.json();
        console.log(data);
      })
    updateSchemaList(schemaList.filter((el) => {return el !== currentSchema}));
    //you’re probably going to want to do the kill port bit before you erase the reference to currentSchema in state
     //kill the node process for the corresponding port specified in the services array where the property
     //‘label’ matches the schema name - see this article: https://melvingeorge.me/blog/kill-nodejs-process-at-specific-port-linux
    changeCurrentSchema('');
    setCurrentPort(4000);
     //TBD on this fetch method...was just an idea, not sure if could work.
    // fetch(“”, {
    //   method: “DELETE”,
    // })
    //   .then((res) => res.json())
    //   .then((data) => {})
    //   .catch((err) => console.log(err));
  }

  //LINKED TO BUTTON CLICKS FROM SCHEMA BUTTONS
  // function handleQuery(e) {
  //     e.preventDefault();
  //     console.log('here is the handlequery button', e); 
  //     console.log(e.target)     
  //     changeCurrentSchema(e.target.value);
  // }

  function handleDbUri(e) {
      //add uri from database hear when set up
      changeUri(e.target.value);
      console.log('this is the value from the db uri box', uriInput);
  }

  function handleAdd(e) {
    console.log('this is the event for the add schema buttton', e);
    e.preventDefault();


    if (input !== '' && uriInput !== '') {   

    // console.log(timeData);
    // let lastTimeData = timeData[timeData.length - 1].hash;
    // console.log(`last time data is ${lastTimeData}`);

    let lastAddedPort = services[services.length - 1].port;
    console.log(`last added port is ${lastAddedPort}`)
    const newPort = lastAddedPort + 1;

    const newService = {
      label: input,
      db_uri: uriInput,
      port: newPort,
    };

    services.push(newService);

    fetch('http://localhost:3333/newServer', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newService)
    })
    .then((data => data.json()))
    .then(results => {
      console.log('these are the results from the fetch request in the handle add', results)
    }) 

  // if (input === '' && uriInput === '') {
  //   setClickable(false);
  //  } else {
  //   setClickable(true);
  //  }
  // if (input === '' && uriInput === '') {
  //   document.getElementById("Button").disabled = true;
  // }
   //else {
    //disabled = false;
  // }
  // if (uriInput === '') {
  //   document. getElementById("Button"). disabled = true;
  // } else {
  //   disabled = false;
  // }

  
    
    updateSchemaList((prevState) => [...prevState, input]);    
    inputChange("");
    changeUri("");
  } else {
    alert('enter info');
  }
  }

  function handleSchemaNameChange(e) {
    inputChange(e.target.value);       
  }

  //--------------------------------------------------------------------
  
  // This is to iterate over each schemaList which is the state for the schemaList box and this also renders the buttons for schemaList
  
  //ALLAN NOTE: Russ, I got rid of the 'list' variable. The map method returns a new array, so no need to create a new array and push into it.
  //Have also updated the reference to it on line 163
  // const list = [];

  // const schemaButtonList = schemaList.map((item, index) => { 
  //   // console.log("here's the list")
  //   //   console.log(list)    
  //   return (      
  //    <li className="schemaList" key={`key${index}`}>{" "}<button id={"schemaList"} value={item} onClick={handleQuery}>{item}</button></li>
  //   );
  // });
  
  //---------------------------------------

  // Html and form below

  return (
    <div className='selector'>
        <Heading/>
        <div className="inputDiv">       
          <span type="text" className="schemaInput">                
          Current Schema:  {currentSchema}  
          </span>        
          <button onClick={handleDelete}>Delete</button>
        </div>
      <div className="mainForm">       
        <form id="mainForm">
            <label className="label-text">
              Schema Name:
            </label>
            <input
              value={input}
              type="text"
              onChange={handleSchemaNameChange}
              name="schema-name"
            ></input>
            <br></br>
            <label className="label-text">
              DB URI:
            </label>
            <input value={uriInput} type="text" onChange={handleDbUri} name="db-uri"></input>
            <br></br>
            <button id="addschema" type="submit" onClick={handleAdd}>
              Add Schema
            </button>
        </form>
        {/* this is going to live above the GraphiQL component and below the metrics visualizer */}
        {/* <ul>{schemaButtonList}</ul> */}
      </div>
    </div>
  );
}

// export const SchemaButtons = () => (<ul>{schemaButtonList}</ul>);
export default schemaDisplay;
