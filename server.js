const pg = require("pg");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require("apollo-log");

// const {performance} = require('perf_hooks');
const cors = require("cors");

const servicesModule = require("./src/services");
const services = servicesModule.services;

const { exec } = require("child_process");

const multer  = require('multer')
const upload = multer({  dest: __dirname + '/public/uploads/' })

// REDIS COMMANDS
const { redisController, cachePlugin } = require("./redis/redis-commands.js");

const createNewApolloServer = (service) => {
  const pgPool = new pg.Pool({
    //do this via an environment variable
    connectionString: service.db_uri,
    // 'postgres:///sample'
  });

  async function startApolloServer() {
    const app = express();

    const { schema, plugin } = await makeSchemaAndPlugin(
      pgPool,
      "public", // PostgreSQL schema to use
      {
        // PostGraphile options, see:
        // https://www.graphile.org/postgraphile/usage-library/
        // watchPg: true,
        graphiql: true,
        graphlqlRoute: "/graphql",
        //These are not the same!
        //not using the graphiql route below
        graphiqlRoute: "/test",
        enhanceGraphiql: true,
      }
    );

    const options = {};

    const server = new ApolloServer({
      schema,
      plugins: [plugin, cachePlugin, ApolloLogPlugin(options)],
      tracing: true,
    });

    await server.start();

    // console.log('***THIS IS SCHEMA****', server.schema._typeMap);

    server.applyMiddleware({ app });

    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    const corsOptions = {
      origin: "*",
      optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));

    app.get("/redis", redisController.serveMetrics, (req, res) => {
      console.log("Result from Redis cache: ");
      console.log(res.locals.metrics);
      return res.status(200).send(res.locals.metrics);
    });

    app.use("*", (req, res) => {
      return res.status(404).send("404 Not Found");
    });

    app.use((err, req, res, next) => {
      console.log(err);
      return res.status(500).send("Internal Server Error " + err);
    });

    //const { url } = await server.listen();
    // accesing via port 8080
    const myApp = app.listen({ port: service.port });
    console.log(
      `🔮 Fortunes being told at http://localhost:${service.port}${server.graphqlPath}✨`
    );
    return myApp;
  }

  return startApolloServer().catch((e) => {
    console.error(e);
    process.exit(1);
  });
};

const myServers = [];

services.forEach((service) => {
  createNewApolloServer(service)
    .then((data) => myServers.push(data))
    .catch((err) => console.log(err));
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(require("body-parser").json())

app.post("/newServer", (req, res) => {
  console.log("inside the /newServer route");
  console.log(req.body);
  createNewApolloServer(req.body);
});

app.delete("/deleteServer/:port", (req, res) => {
  console.log("***IN DELETE****");
  const myPort = req.params.port;
  const connectionKey = `6::::${myPort}`;
  myServers.forEach((server) => {
    if (myPort == 4000) {
      console.log(
        "You may not close port 4000. Graphiql must be provided an active GraphQL API (of which there will always be one running on 4000)"
      );
    } else if (server._connectionKey == connectionKey) {
      // console.log(server.address().port)
      console.log(`server on ${myPort} is about to be shut down`);
      server.close();
      // console.log(server.address().port)
    }
  });
});

app.post('/uploadFile', upload.single('myFile'), function (req, res, next) {
  console.log('FILE', req.file);
  console.log('BODY', req.body);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send(200);
})

// app.post('/getFilePath', (req, res) => {
//   console.log(req.body);
//   res.send(200);
// })

app.get("/shell", (req, res, next) => {
  const promisify = (shellCommand) => {
    const cmd = shellCommand;
    return function () {
      new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) return reject(error);
          if (stderr) return reject(new Error(stderr));
          return resolve({ stdout, stderr });
        });
      });
    };
  };

  const createDatabase = promisify("createdb -U postgres sample");
  const importSQL = promisify(
    "psql -U postgres -d sample < '/Users/ekaterinavasileva_1/cs/senior portion/SpeQL8/src/NF.sql'"
  );

  createDatabase();
  setTimeout(importSQL, 500);

  // const startPostgraphile = promisify("postgraphile -c postgress:///sample -s public -a -j");
  // startPostgraphile();
  // exec(
  //       "postgraphile -c postgress:///sample -s public -a -j",
  //       (error, stdout, stderr) => {
  //         if (error) {
  //           console.log(`error: ${error.message}`);
  //           return;
  //         }
  //         if (stderr) {
  //           console.log("stderr: ", stderr);
  //           return;
  //         }
  //         console.log("stdout: ", stdout);
  //         return 1;
  //       },
  //       console.log('THREE')
  //     );
});


app.listen(3333, () => {
  console.log("listening for new APIs to spin up on port 3333");
});
