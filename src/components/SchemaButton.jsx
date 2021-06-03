import React from "react";

const SchemaButton = (props) => {
  const { className, id, onClick, value } = props;

  return (
    <li className={className}>
      <button className="schema-button" id={id} onClick={onClick}>
        {value}
      </button>
    </li>
  );
};

export default SchemaButton;
