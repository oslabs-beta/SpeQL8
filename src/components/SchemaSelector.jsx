import React, { useState, useEffect } from "react";
const servicesModule = require("../modules/services");
const services = servicesModule.services;
//these don't work - will need another solution...
// const timeDataModule = require('./timeData');
// const timeData = timeDataModule.timeData;
// const newServerModule = require('./../newServerInstance');
// const createNewApolloServer = newServerModule.allanExportTest;

import Heading from "./Heading";

const schemaDisplay = (props) => {
  // These are the react hooks
  // const [currentSchema, changeCurrentSchema] = useState("");
  const [input, inputChange] = useState("");
  const [uriInput, changeUri] = useState("");
  const { currentSchema } = props;
  const { changeCurrentSchema } = props;
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
  });

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
    setFetchURL(`http://localhost:${services[0].port}/graphql`);
    //When we click the delete button we want to do the following:
    //remove the button from the schemaList (where the name corresponds to the currentSchema)
    //reset currentSchema to none selected / blank string
    fetch(`http://localhost:3333/deleteServer/${currentPort}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {
      data.json();
      console.log(data);
    });
    updateSchemaList(
      schemaList.filter((el) => {
        return el !== currentSchema;
      })
    );
    //you’re probably going to want to do the kill port bit before you erase the reference to currentSchema in state
    //kill the node process for the corresponding port specified in the services array where the property
    //‘label’ matches the schema name - see this article: https://melvingeorge.me/blog/kill-nodejs-process-at-specific-port-linux
    changeCurrentSchema("");
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
    console.log("this is the value from the db uri box", uriInput);
  }

  function handleAdd(e) {
    console.log("this is the event for the add schema buttton", e);
    e.preventDefault();

    if (input !== "" && uriInput !== "") {
      // console.log(timeData);
      // let lastTimeData = timeData[timeData.length - 1].hash;
      // console.log(`last time data is ${lastTimeData}`);

      let lastAddedPort = services[services.length - 1].port;
      console.log(`last added port is ${lastAddedPort}`);
      const newPort = lastAddedPort + 1;

      const newService = {
        label: input,
        db_uri: uriInput,
        port: newPort,
      };

      //is this actually working? NO!
      services.push(newService);

      fetch("http://localhost:3333/newServer", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      })
        .then((data) => data.json())
        .then((results) => {
          console.log(
            "these are the results from the fetch request in the handle add",
            results
          );
        });

      updateSchemaList((prevState) => [...prevState, input]);
      inputChange("");
      changeUri("");
    } else {
      alert("enter info");
    }
  }

  function handleSchemaNameChange(e) {
    inputChange(e.target.value);
  }

  function handleFileSubmit(e) {
    e.preventDefault();
    const label = document.getElementById("schemaNameFromFile").value;
    const form = document.getElementById("uploadFileForm");
    const formData = new FormData(form);
    const file = formData.get("myFile");
    const indexOfDot = file.name.lastIndexOf(".");
    const fileExtension = file.name.slice(`${indexOfDot}`);
    if (fileExtension !== ".sql" && fileExtension !== ".tar") {
      alert("please upload .sql or .tar file");
      return;
    } else if (label.trim() === "" || label ==="") {
      alert("please provide a name for your database");
      return;
    } else {
      fetch("http://localhost:3333/uploadFile", {
        method: "POST",
        mode: "cors",
        body: formData,
      })
        .then((JSONdata) => JSONdata.json())
        .then((data) => services.push(data))
        // .then(() => console.log(services))
        .then(() => updateSchemaList((prevState) => [...prevState, label]));
      // .then(() => console.log(schemaList));
        // .then(() => inputChange(""))
        // .then(() => changeUri(""));
        document.getElementById("schemaNameFromFile").value = "";
    }
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
    <div className="selector">
      <Heading />
      <div className="inputDiv">
        <span type="text" className="schemaInput">
          Current Schema:
          <br />
          {currentSchema === "" && (
            <span className="none-selected-text">
              None selected. Select a schema from the tabs, or add one below
            </span>
          )}
          {currentSchema !== "" && (
            <span id="currentSchema">{currentSchema}</span>
          )}
        </span>

        {currentSchema !== "" && (
          <button id="buttonDelete" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
      <span className="sparkle-hr">✨ ✨ ✨ ✨ ✨</span>
      <div className="mainForm">
        <span id="formText">Run with connection string...</span>
        <form id="mainForm" class="forms">
          <label for="schemaNameFromDbUri" className="label-text">
            Schema Name:
          </label>
          <input
            value={input}
            type="text"
            onChange={handleSchemaNameChange}
            id="schemaNameFromDbUri"
            name="schema-name"
          ></input>
          <label for="dbUri" className="label-text">
            PostgreSQL URI:
          </label>
          <input
            value={uriInput}
            type="text"
            onChange={handleDbUri}
            id="dbUri"
            name="db-uri"
          ></input>
          <button id="addschema" type="submit" onClick={handleAdd}>
            Add Schema
          </button>
        </form>
        <span id="formText">...or upload .sql or .tar file</span>
        <form
          action=""
          enctype="multipart/form-data"
          id="uploadFileForm"
          class="forms"
          onSubmit={(e) => handleFileSubmit(e)}
        >
          <label for="schemaNameFromFile" class="label-text">
            Schema Name:
          </label>
          <input
            type="text"
            id="schemaNameFromFile"
            name="schema-name-from-file"
          ></input>
          <label for="myFileId" class="label-text">
            Select a File:
          </label>
          <input type="file" name="myFile" id="myFileId"></input>
          <button
            type="submit"
            value="submit file"
            id="submitFile"
            onClick={() => console.log("click")}
          >
            Upload file
          </button>
        </form>
      </div>
    </div>
  );
};
// export const SchemaButtons = () => (<ul>{schemaButtonList}</ul>);
export default schemaDisplay;
