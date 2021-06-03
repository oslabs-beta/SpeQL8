import React, { useState, useEffect } from "react";
const servicesModule = require("../modules/services");
const services = servicesModule.services;

import Heading from "./Heading";

const schemaDisplay = (props) => {
  const [input, inputChange] = useState("");
  const [uriInput, changeUri] = useState("");
  const { currentSchema, changeCurrentSchema } = props;
  const { schemaList, updateSchemaList } = props;
  const { setFetchURL } = props;
  const { currentPort, setCurrentPort } = props;

  function handleDelete(e) {
    //hard coding back to SWAPI so GraphiQL does not throw an error due to not having a valid fetch URL
    setFetchURL(`http://localhost:${services[0].port}/graphql`);

    fetch(`http://localhost:3333/deleteServer/${currentPort}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {
      data.json();
    });
    updateSchemaList(
      schemaList.filter((el) => {
        return el !== currentSchema;
      })
    );

    changeCurrentSchema("");
    setCurrentPort(4000);
  }

  function handleDbUri(e) {
    changeUri(e.target.value);
    // console.log("this is the value from the db uri box", uriInput);
  }

  function handleAdd(e) {
    // console.log("this is the event for the add schema buttton", e);
    e.preventDefault();

    if (input !== "" && uriInput !== "") {
      let lastAddedPort = services[services.length - 1].port;
      // console.log(`last added port is ${lastAddedPort}`);
      const newPort = lastAddedPort + 1;
      const newService = {
        label: input,
        db_uri: uriInput,
        port: newPort,
      };
      services.push(newService);
      console.log(services);

      fetch("http://localhost:3333/newServer", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      })
        .then((data) => data.json())
        //can probably get rid of this .then
        .then((results) => {
          console
            .log(
              "these are the results from the fetch request in the handle add",
              results
            )
            .catch((err) => {
              console.log(err);
            });
        });

      updateSchemaList((prevState) => [...prevState, input]);
      inputChange("");
      changeUri("");
    } else {
      alert(
        "Please ensure 'Schema Name' and 'PostgreSQL URI' fields are populated"
      );
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

  //---------------------------------------

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
        <form id="mainForm" className="forms">
          <label htmlFor="schemaNameFromDbUri" className="label-text">
            Schema Name:
          </label>
          <input
            value={input}
            type="text"
            onChange={handleSchemaNameChange}
            id="schemaNameFromDbUri"
            name="schema-name"
          ></input>
          <label htmlFor="dbUri" className="label-text">
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
          encType="multipart/form-data"
          id="uploadFileForm"
          className="forms"
          onSubmit={(e) => handleFileSubmit(e)}
        >
          <label htmlFor="schemaNameFromFile" className="label-text">
            Schema Name:
          </label>
          <input
            type="text"
            id="schemaNameFromFile"
            name="schema-name-from-file"
          ></input>
          <label htmlFor="myFileId" className="label-text">
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

export default schemaDisplay;
