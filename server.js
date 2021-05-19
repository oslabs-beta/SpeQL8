const pg = require('pg');
const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require('apollo-log');
const {performance} = require('perf_hooks');

const vizData = require('./src/datatest')

// console.log(vizData);

// REDIS
const Redis = require('ioredis');
const redis = new Redis();

const services = [
  {
    label: 'first',
    db_uri: 'postgres://wkydcwrh:iLsy9WNRsMy_LVodJG9Uxs9PARNbiBLb@queenie.db.elephantsql.com:5432/wkydcwrh',
    port: 4000
  },
  {
    label: 'second',
    db_uri: 'postgres://dgpvvmbt:JzsdBZGdpT1l5DfQz0hfz0iT7BrKgxhr@queenie.db.elephantsql.com:5432/dgpvvmbt',
    port: 4001
  },
]

services.forEach((service) => {
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

  const myPlugin = {
    requestDidStart(context) {
      const clientQuery = context.request.query;
      return {
          async willSendResponse(requestContext) {
              // console.log('schemaHash: ' + requestContext.schemaHash);
              // console.log('queryHash: ' + requestContext.queryHash);
              // console.log('operation: ' + requestContext.operation.operation);
              //Log the tracing extension data of the response
              const totalDuration = `${requestContext.response.extensions.tracing.duration} microseconds`;
              const now = Date.now();
              const hash = `${now}-${requestContext.queryHash}`
              const timeStamp = new Date().toDateString();
              await redis.hset(`${hash}`, 'totalDuration', `${totalDuration}`);
              await redis.hset(`${hash}`, 'clientQuery', `${clientQuery.toString()}`);
              await redis.hset(`${hash}`, 'timeStamp', `${timeStamp}`);
              console.log(hash);
          },
      };
    }
  }; 


  const options = {};

  const server = new ApolloServer({
    schema,
    plugins: [plugin, myPlugin, ApolloLogPlugin(options)],
    tracing: true
  });

  await server.start();
  server.applyMiddleware({ app });

  app.use((req, res) => {
    res.status(200);
    res.send('Express test fired');
    res.end();
  })

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
});  
