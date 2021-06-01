const pg = require("pg");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require("apollo-log");

// const {performance} = require('perf_hooks');
const cors = require("cors");

const servicesModule = require("./src/services");
const services = servicesModule.services;

// const { exec } = require("child_process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const multer = require("multer");
const upload = multer({ dest: __dirname + "/public/uploads/" });
const fs = require("fs");

// REDIS COMMANDS
const { redisController, cachePlugin } = require("./redis/redis-commands.js");
const { ConsoleLogger } = require("typedoc/dist/lib/utils");

const createNewApolloServer = (service) => {
  console.log("this is service", service);
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

app.post(
  "/uploadFile",
  upload.single("myFile"),
  (req, res, next) => {
    console.log("HERE");
    console.log("FILE", req.file);
    console.log("BODY", req.body);
    fs.renameSync(
      req.file.destination + req.file.filename,
      req.file.destination + req.file.originalname
    );
    // req.file.filename = req.file.originalname;
    req.fileExtension = req.file.originalname.slice(-4);
    req.p = req.file.destination + req.file.originalname;
    req.label = JSON.stringify(req.body).slice(26, -2);
    console.log(req.label);
    console.log("FILE", req.file);
    next();
  },
  async (req, res, next) => {
    // const promisify = (shellCommand) => {
    //   const cmd = shellCommand;
    //   return async function () {
    //     new Promise((resolve, reject) =>
    //       exec(cmd, setTimeout((error, stdout, stderr) => {
    //         if (error) return reject(error);
    //         if (stderr) return reject(new Error(stderr));
    //         return resolve({ stdout, stderr });
    //       }, 500)));

    //   };
    // };

    const promisify = async (cmd) => {
      try {
        const { stdout, stderr } = await exec(cmd);
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
      } catch (e) {
        console.error(e);
      }
    };
    //****CHECK POINT******
    // console.log(req.fileExtension);

    await promisify(`createdb -U postgres '${req.label}'`);
    // console.log(result);
    // console.log(createDatabase);
    let importSQL;
    if (req.fileExtension === ".sql") {
      await promisify(`psql -U postgres -d ${req.label} < '${req.p}'`);
    } else if (req.fileExtension === ".tar") {
      await promisify(`pg_restore -U postgres -d ${req.label} < '${req.p}'`);
    }

    // console.log('result 2', result)
    //  const result = await createDatabase();
    //  console.log(result)
    //  await importSQL();
    next();
  },

  async (req, res, next) => {
    const port = services[services.length - 1].port + 1;

    const newServiceFromFile = {
      label: `${req.label}`,
      db_uri: `postgres:///${req.label}`,
      port: port,
    };

    // const result = await createNewApolloServer(newServiceFromFile);
    res.locals.service = newServiceFromFile;
    res.status(200).json(res.locals.service);
  }
);

app.listen(3333, () => {
  console.log("listening for new APIs to spin up on port 3333");
});
