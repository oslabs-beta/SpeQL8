import React, { useState } from "react";
const servicesModule = require('./services');
const services = servicesModule.services;

const schemaDisplay = (props) => {
  // These are the react hooks
  const [currentSchema, changeCurrentSchema] = useState("");
  const [addSchema, addAnotherSchema] = useState([]);
  const [input, inputChange] = useState("");
  const [uriInput, changeUri] = useState("");
  const { fetchURL } = props;
  const { setFetchURL } = props;

  // These are all the button methods:
  
  function handleDelete(e) {
    //When we click the delete button we want to do the following:
    //remove the button from the unordered list (where the name corresponds to the current schema name)
    //TBD on which order to approach this
    changeCurrentSchema('');
    console.log('this is the list of button from the addschmema',addSchema[0]);
    if (addSchema[addSchema.length - 1] === addSchema[0]) {
      delete addSchema[0];
    } 
    delete addSchema[addSchema.length - 1];
    if (input === e.target.value) {
      delete addSchema[addSchema.length - 1];
    }

    for (let i = 0; i < addSchema.length; i ++) {
      console.log(addSchema[i]);
       if (addSchema[i] === currentSchema) {
         delete addSchema[i];
       }
    }    
       
    fetch("", {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {})
      .catch((err) => console.log(err));
    //remove the object element form the services array, where the schema name correponds to the property of label
     //kill the node process for the corresponding port specified in the services array where the property 
     //'label' matches the schema name - see this article: https://melvingeorge.me/blog/kill-nodejs-process-at-specific-port-linux
  }

  function handleQuery(e) {
      e.preventDefault();
      console.log('here is the handlequery button', e); 
      console.log(e.target)     
      changeCurrentSchema(e.target.value);
      //add connection to graphiql here when backend is setup
  }

  function handleDbUri(e) {
      //add uri from database hear when set up
      changeUri(e.target.value);
      console.log('this is the value from the db uri box', uriInput);
  }

  function handleAdd(e) {
    console.log('this is the event for the add schema buttton', e);
    e.preventDefault();
    let lastAddedPort = services[services.length - 1].port;
    const newPort = lastAddedPort + 1;
    services.push({
      label: input,
      db_uri: uriInput,
      port: newPort
    });
    const testObj = {label: input,
    db_uri: uriInput,
    port: newPort}

    fetch('http://localhost:3333/newServer', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testObj)
    })
    .then((data => data.json()))
    .then(results => {
      console.log('these are the results from the fetch request in the handle add', results)
    })  
    
    addAnotherSchema((prevState) => [...prevState, input]);    
    inputChange("");
  }

  function handleSchemaNameChange(e) {
    inputChange(e.target.value);       
  }

  //--------------------------------------------------------------------
  
  // This is to iterate over each addschema which is the state for the addschema box and this also renders the buttons for addschema
  
  const list = [];

  const schemaButtonList = addSchema.map((item, index) => { 
      console.log(list)    
    return (      
      list.push(<li className="schemaList" key={`key${index}`}>{" "}<button id={"addSchema"} value={item} onClick={handleQuery}>{item}</button></li>)
    );
  });
  
  //---------------------------------------

  // Html and form below

  return (
    <div>
        <div className="inputDiv">       
          <span type="text" className="schemaInput">                
          Current Schema:  {currentSchema}  
          </span>        
          <button onClick={handleDelete}>Delete</button>
        </div>
      <div>       
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
            <button type="submit" onClick={handleAdd}>
              Add Schema
            </button>
        </form>
        <ul>{list}</ul>
      </div>
    </div>
  );
}

export default schemaDisplay;
