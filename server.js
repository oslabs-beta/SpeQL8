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
          if (context.request.operationName!=="IntrospectionQuery") {
          //Log the query sent by the client
          // console.log(context.request.query);
              // console.log(context.request.operationName);
              return {
                  willSendResponse(requestContext) {
                      //Log the tracing extension data of the response
                      let extensions = requestContext.response.extensions;
                      redis.set(`placeholder`, extensions.tracing.duration + ' microseconds');
                      console.log(extensions);
                  },
              };
          };
      }
    };  
    const options = {
      
    }
  
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