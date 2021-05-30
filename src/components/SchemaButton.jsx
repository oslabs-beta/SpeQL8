import React from 'react';


const SchemaButton = (props) => {
    const {className, key, id, onClick, value} = props;

    return (
        <li className={className} key={key}>{" "}<button className='schema-button' id={id} onClick={onClick}>{value}</button></li>
    )
}

export default SchemaButton;