const pg = require('pg');
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require('apollo-log');
const {performance} = require('perf_hooks');
const vizData = require('./src/datatest')
console.log(vizData);

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
      requestDidStart() {
        console.log('Request started! Timer started');
        const t0 = performance.now();
        console.log(`t0 = ${t0}`);
        return {
          willSendResponse(){
            console.log('Reponse sent. Timer ends here');
            const t1 = performance.now();
            console.log(`t0 = ${t0}`);
            console.log(`t1 = ${t1}`);
            const sum = t1 - t0;
            vizData[0].distance = Math.round(sum);
            console.log(vizData);
            console.log(`From requestDidStart to willSendResponse took ${t1 - t0} milliseconds`)
          },
        }
      },
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
    // console.log(`🔮 Fortunes being told at ${url}✨`);
  }
  
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });