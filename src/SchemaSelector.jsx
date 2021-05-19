import React, { useState } from "react";

function schemaDisplay() {
  //const [currentSchema, removeSchema] = useState([]);
  const [currentSchema, changeCurrentSchema] = useState("");
  const [addSchema, addAnotherSchema] = useState([]);
  const [input, inputChange] = useState("");
  const [uriInput, changeUri] = useState("");
  
  

  function handleDelete(e) {
    fetch("", {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {})
      .catch((err) => console.log(err));
  }

  function handleQuery(e) {
      e.preventDefault();
      console.log('here is the handlequery button', e);      
      changeCurrentSchema(e.target.value);
      //changeCurrentSchema((prevState) => prevState, input);

      //const form = document.getElementById('mainForm');
      //form.reset();
      //add connection to graphiql here when backend is setup
  }

  function handleDbUri(e) {
      //add uri from database hear when set up
  }

  function handleAdd(e) {
    console.log('this is the event for the add schema buttton', e);
    e.preventDefault();
    addAnotherSchema((prevState) => [...prevState, input]);
    //e.target.type = 'reset';
    inputChange("");

  }

  function handleSchemaNameChange(e) {
    inputChange(e.target.value);
    
        
  }

//   function handleSchemaChange(e) {
//     console.log(e.target.type);
//     changeCurrentSchema(e.target.value);
//   }

  const list = [];
  //let name = '';
  const schemaButtonList = addSchema.map((item, index) => { 
      //console.log('this is the name of the button i am trying to retrieve', name)    
    return (
      list.push(<li className="schemaList" key={`key${index}`}>{" "}<button value={item} onClick={handleQuery}>{item}</button></li>)    
    );
  });

  return (
    <div>
      <div className="inputDiv">
        Current Schema:
        <span
          //value={currentSchema}
          type="text"
          className="schemaInput"
          //onChange={handleSchemaChange}
        >{currentSchema}</span>
        <button onClick={handleDelete}>Delete</button>
      </div>
      <div>
        {/* <form>
            <input value={input} type="text" onChange={handleInputFormChange}></input>
            <button onClick={handleAdd}>Add Schema</button>
            <ul>{schemaButtonList}</ul>
            </form> */}
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
