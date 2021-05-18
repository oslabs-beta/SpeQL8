const pg = require('pg');
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require('apollo-log');
const {performance} = require('perf_hooks');
const vizData = require('./src/datatest')
console.log(vizData);

// REDIS
const Redis = require("ioredis");
const redis = new Redis();

const pgPool = new pg.Pool({
    //do this via an environment variable
    connectionString: "postgres://mqbpucbv:QmScG6BJ_w9GYAJHpTdGgWztcMT-YdVr@queenie.db.elephantsql.com:5432/mqbpucbv"
  });
  
  async function main() {
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
  
    const { url } = await server.listen();
    //commenting this out for the moment - as it says port 4000 - but we'll be accesing via port 8080
    console.log(`🔮 Fortunes being told at ${url}✨`);
  }
  
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });