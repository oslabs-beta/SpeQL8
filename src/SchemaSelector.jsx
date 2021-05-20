import React, { useState } from "react";
const servicesModule = require('./services');
const services = servicesModule.services;
// const newServerModule = require('./../newServerInstance');
// const createNewApolloServer = newServerModule.allanExportTest;

const schemaDisplay = (props) => {
  //const [currentSchema, removeSchema] = useState([]);
  const [currentSchema, changeCurrentSchema] = useState("");
  const [addSchema, addAnotherSchema] = useState([]);
  const [input, inputChange] = useState("");
  const [uriInput, changeUri] = useState("");
  
  

  const { fetchURL } = props;
  const { setFetchURL } = props;

  // function handleSubmit(e) {
  //   console.log(e);
  //   e.preventDefault();
  //   setSchema((prevState) => [...prevState, changeVal]);
  //   setchangeVal("");
  // }

  function handleDelete(e) {
    //When we click the delete button we want to do the following:
    //remove the button from the unordered list (where the name corresponds to the current schema name)
    //TBD on which order to approach this
   
    //remove the object element form the services array, where the schema name correponds to the property of label


     //kill the node process for the corresponding port specified in the services array where the property 'label' matches the schema name - see this article: https://melvingeorge.me/blog/kill-nodejs-process-at-specific-port-linux



    // fetch("", {
    //   method: "DELETE",
    // })
    //   .then((res) => res.json())
    //   .then((data) => {})
    //   .catch((err) => console.log(err));
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

    let lastAddedPort = services[services.length - 1].port;
    const newPort = lastAddedPort + 1;
    services.push({
      label: input,
      db_uri: 'postgres://wkydcwrh:iLsy9WNRsMy_LVodJG9Uxs9PARNbiBLb@queenie.db.elephantsql.com:5432/wkydcwrh' ,
      port: newPort
    });
    const testObj = {label: input,
    db_uri: 'postgres://wkydcwrh:iLsy9WNRsMy_LVodJG9Uxs9PARNbiBLb@queenie.db.elephantsql.com:5432/wkydcwrh' ,
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
      console.log(results)
    })
  //   console.log(services);

  //   const data = `${services}\nexports.services = services;`
  //   const fs = require('bro-fs');
  //   fs.init({type: window.TEMPORARY, bytes: 5 * 1024 * 1024})
  //   // .then(() => fs.mkdir('dir'))
  // .then(() => fs.writeFile('./services.js', data))
  // .then(() => fs.readFile('./services.js'))
  // .then(content => console.log(content)); // => "hello world"

    // const createNewApolloServer = (service) => {
    //   const pgPool = new pg.Pool({
    //     //do this via an environment variable
    //     connectionString: service.db_uri
    //   });
        
    //   async function startApolloServer() {
      
      
    //     const app = express();
      
    //     const { schema, plugin } = await makeSchemaAndPlugin(
    //       pgPool,
    //       'public', // PostgreSQL schema to use
    //       {
    //         // PostGraphile options, see:
    //         // https://www.graphile.org/postgraphile/usage-library/
    //         // watchPg: true,
    //               graphiql: true,
    //               graphlqlRoute: '/graphql',
    //               //These are not the same!
    //               //not using the graphiql route below
    //               graphiqlRoute: '/test',
    //               enhanceGraphiql: true
    //       }
    //     );
      
      
    //     const myPlugin = {
    //       requestDidStart(context) {
    //         const clientQuery = context.request.query;
    //         return {
    //             async willSendResponse(requestContext) {
    //                 // console.log('schemaHash: ' + requestContext.schemaHash);
    //                 // console.log('queryHash: ' + requestContext.queryHash);
    //                 // console.log('operation: ' + requestContext.operation.operation);
    //                 //Log the tracing extension data of the response
    //                 const totalDuration = `${requestContext.response.extensions.tracing.duration} microseconds`;
    //                 const now = Date.now();
    //                 const hash = `${now}-${requestContext.queryHash}`
    //                 const timeStamp = new Date().toDateString();
    //                 await redis.hset(`${hash}`, 'totalDuration', `${totalDuration}`);
    //                 await redis.hset(`${hash}`, 'clientQuery', `${clientQuery.toString()}`);
    //                 await redis.hset(`${hash}`, 'timeStamp', `${timeStamp}`);
    //                 console.log(hash);
    //             },
    //         };
    //       }
    //     }; 
      
      
    //     const options = {};
      
    //     const server = new ApolloServer({
    //       schema,
    //       plugins: [plugin, myPlugin, ApolloLogPlugin(options)],
    //       tracing: true
    //     });
      
    //     await server.start();
    //     server.applyMiddleware({ app });
      
    //     app.use((req, res) => {
    //       res.status(200);
    //       res.send('Express test fired');
    //       res.end();
    //     })
      
    //     //const { url } = await server.listen();
    //     // accesing via port 8080
    //     await new Promise(resolve => app.listen({ port:service.port }, resolve));
    //     console.log(`🔮 Fortunes being told at http://localhost:${service.port}${server.graphqlPath}✨`);
    //     return { server, app };
    //   }
      
    //   startApolloServer()
    //     .catch(e => {
    //       console.error(e);
    //       process.exit(1);
    //     });
    // }

    // createNewApolloServer(services[services.length - 1]);
    
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
  
  // function allanTest(){
  //   setFetchURL('http://localhost:4000/graphql');
  //   console.log('allanTest Clicked')
  // }

  // This is from Allan, we will need to add the allan test into handleQuery
  
  // const schemaButtonList = addSchema.map((item, index) => {
  //   return (
  //     <li key={`key${index}`}>
  //       {" "}
  //       <button onClick={allanTest}>{item}</button>
  //     </li>
     );
   });

  return (
    <div>
      <div className="inputDiv">
        {/* Current Schema: */}
        <span
          //value={currentSchema}
          type="text"
          className="schemaInput"
          //onChange={handleSchemaChange}
        >Current Schema:  {currentSchema}  </span>
        
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
