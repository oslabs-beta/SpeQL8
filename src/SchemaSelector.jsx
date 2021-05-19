import React, { useState } from "react";

const schemaDisplay = (props) => {
  //const [currentSchema, removeSchema] = useState([]);
  const [currentSchema, changeCurrentSchema] = useState("");
  const [addSchema, addAnotherSchema] = useState([]);
  const [input, inputChange] = useState("");

  const { fetchURL } = props;
  const { setFetchURL } = props;

  function handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    setSchema((prevState) => [...prevState, changeVal]);
    setchangeVal("");
  }

  function handleDelete(e) {
    fetch("", {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {})
      .catch((err) => console.log(err));
  }

  function handleQuery(e) {}

  function handleAdd(e) {
    console.log(e);
    e.preventDefault();
    addAnotherSchema((prevState) => [...prevState, input]);
    inputChange("");
  }

  function handleInputFormChange(e) {
    inputChange(e.target.value);
  }

  function handleSchemaChange(e) {
    console.log(e.target.type);
    setchangeVal(e.target.value);
  }

  function allanTest(){
    setFetchURL('http://localhost:4000/graphql');
    console.log('allanTest Clicked')
  }

  const schemaButtonList = addSchema.map((item, index) => {
    return (
      <li key={`key${index}`}>
        {" "}
        <button onClick={allanTest}>{item}</button>
      </li>
    );
  });

  return (
    <div>
      <div className="inputDiv">
      <label className="label-text" for="current-schema">
      Current Schema:
          </label>
        <span
          value={currentSchema}
          type="text"
          name="current-schema"
          className="schemaInput"
          onChange={handleSchemaChange}
        /><span/>
        <button onClick={handleDelete}>Delete</button>
      </div>
      <div>
        {/* <form>
            <input value={input} type="text" onChange={handleInputFormChange}></input>
            <button onClick={handleAdd}>Add Schema</button>
            <ul>{schemaButtonList}</ul>
            </form> */}
        <form>
          <label className="label-text" for="schema-name">
            Schema Name:
          </label>
          <input
            value={input}
            type="text"
            onChange={handleInputFormChange}
            name="schema-name"
          ></input>
          <br></br>
          <label className="label-text" for="db-uri">
            DB URI:
          </label>
          <input type="text" name="db-uri"></input>
          <br></br>
          <button type="submit" onClick={handleAdd}>
            Add Schema
          </button>
        </form>
        <ul>{schemaButtonList}</ul>
      </div>

      {/* <ul>
          {schemaButtonList}
        </ul> */}
      {/* <button>Schema 1</button>
      <button>Schema 2</button>
      <button>Schema 3</button> */}
    </div>
  );
}

export default schemaDisplay;
