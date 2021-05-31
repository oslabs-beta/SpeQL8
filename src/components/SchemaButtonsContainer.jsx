import React, { useState } from "react";
import SchemaButton from "./SchemaButton";

const SchemaButtonsContainer = (props) => {
  const { schemaList } = props;
  const { handleQuery } = props;

  const schemaButtonList = schemaList.map((item, index) => {
    return (
      <SchemaButton
        className="schema-list-element"
        key={`${index}`}
        id={`schema-button-${index}`}
        onClick={handleQuery}
        value={item}
      />
      //  <li className="schemaList" key={`key${index}`}>{" "}<button id={"schemaList"} value={item} onClick={handleQuery}>{item}</button></li>
    );
  });

  return <ul className="schema-button-list">{schemaButtonList}</ul>;
};

export default SchemaButtonsContainer;
