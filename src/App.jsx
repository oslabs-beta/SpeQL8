import React, { useState } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
const regeneratorRuntime = require("regenerator-runtime");

import Heading from './Heading';
import SchemaSelector from './SchemaSelector'
import MetricsVisualizer from './MetricsVisualizer';

/*
minified CSS is currently being pulled from the graphiql module. If we want to get more
granular, we can: https://github.com/graphql/graphiql/tree/main/packages/graphiql/src/css 

The graphiql/packages/graphiql repo has info in the readme pertaining 
to the props that GraphiQL can accept: https://github.com/graphql/graphiql/blob/main/packages/graphiql/README.md
*/

const App = () => {
  const [fetchURL, setFetchURL] = useState('http://localhost:4001/graphql');

  return (
    //this outermost div MUST have the id of 'graphiql' in order for graphiql to render properly
    <div id='graphiql' className="main-container">
    

    <Heading/>
    <SchemaSelector fetchURL={fetchURL} setFetchURL={setFetchURL}/>
    <MetricsVisualizer/>
    <GraphiQL
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