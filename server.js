const pg = require('pg');
const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require('apollo-log');
// const {performance} = require('perf_hooks');
const cors = require('cors');

const servicesModule = require('./src/services');
const services = servicesModule.services;

// REDIS COMMANDS
const { redisController, cachePlugin } = require('./redis/redis-commands.js');

const createNewApolloServer = (service) => {
  const pgPool = new pg.Pool({
    //do this via an environment variable
    connectionString: service.db_uri
  });
    
  async function startApolloServer() {
  
  
    const app = express();
  
    const { schema, plugin } = await makeSchemaAndPlugin(
      pgPool,
      'public', // PostgreSQL schema to use
      {
        // PostGraphile options, see:
        // https://www.graphile.org/postgraphile/usage-library/
        // watchPg: true,
              graphiql: true,
              graphlqlRoute: '/graphql',
              //These are not the same!
              //not using the graphiql route below
              graphiqlRoute: '/test',
              enhanceGraphiql: true
      }
    );
  
    const options = {};
  
    const server = new ApolloServer({
      schema,
      plugins: [plugin, cachePlugin, ApolloLogPlugin(options)],
      tracing: true
    });
  
    await server.start();
    server.applyMiddleware({ app });
    app.use(express.json());
  
    app.get('/:hash', redisController.serveMetrics, (req, res) => {
      console.log('Result from Redis cache: ');
      console.log(res.locals);
      return res.status(200).send(res.locals);
    })
  
    app.use('*', (req, res) => {
      return res.status(404).send('404 Not Found');
    });
  
    app.use((err, req, res, next) => {
      console.log(err);
      return res.status(500).send('Internal Server Error ' + err);
    });
  
    //const { url } = await server.listen();
    // accesing via port 8080
    await new Promise(resolve => app.listen({ port:service.port }, resolve));
    console.log(`🔮 Fortunes being told at http://localhost:${service.port}${server.graphqlPath}✨`);
    return { server, app };
  }
  
  startApolloServer()
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
  };  


services.forEach((service) => {
  createNewApolloServer(service);
})

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.post('/newServer', (req, res) => {
  console.log('inside the /newServer route')
  console.log(req.body);
  createNewApolloServer(req.body);
})
app.listen(3333, ()=> {
  console.log('listening for new APIs to spin up on port 3333')
});







 
