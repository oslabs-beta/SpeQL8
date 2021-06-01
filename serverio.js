const express = require("express");
const http = require("http");
const servicesModule = require("./src/modules/services");
const services = servicesModule.services;
const pg = require("pg");
const { ApolloServer } = require("apollo-server-express");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require("apollo-log");
const cors = require("cors");

// EXPRESS SERVER + CORS
const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// DYNAMIC SERVER SWITCHING
app.post("/newServer", (req, res) => {
  console.log("inside the /newServer route");
  console.log(req.body);
  // services.push(req.body);
  console.log(services);
  createNewApolloServer(req.body)
    .then((data) => myServers.push(data))
    .catch((err) => console.log(err));
});

app.delete("/deleteServer/:port", (req, res) => {
  console.log("***IN DELETE****");
  console.log(services);
  const myPort = req.params.port;
  const connectionKey = `6::::${myPort}`;
  myServers.forEach((server) => {
    // console.log("ITERATING THROUGH MYSERVERS")
    // console.log(`MYPORT:${myPort}`);
    // console.log(`SERVERCONNECTIONKEY: ${server._connectionKey}`)
    if (myPort == 4000) {
      console.log(
        "You may not close port 4000. Graphiql must be provided an active GraphQL API (of which there will always be one running on 4000)"
      );
    } else if (server._connectionKey == connectionKey) {
      // console.log(server.address().port)
      console.log(`server on ${myPort} is about to be shut down`);
      server.close();
      // console.log(server.address().port)
    } else {
      console.log("nothing got hit!");
    }
  });
  console.log(services);
  for (let i = 0; i < services.length; i++) {
    console.log(services[i].port);
    if (services[i].port == myPort) {
      services.splice(i, 1);
    }
  }

  console.log(services);
});

// REDIS
const {
  redisController,
  cachePlugin,
  updater,
} = require("./redis/redis-commands.js");

// SOCKET.IO
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  },
});

const getApiAndEmit = (socket) => {
  // console.log(updater);
  const response = updater;
  socket.emit("FromAPI", response);
};

let interval;
socketIo.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(3333, () => {
  console.log("listening for new APIs to spin up on port 3333");
});

// APOLLO SERVER + POSTGRAPHILE
const createNewApolloServer = (service) => {
  const pgPool = new pg.Pool({
    //do this via an environment variable
    connectionString: service.db_uri,
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
      introspection: true,
    });

    await server.start();
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

    // REDIS CACHED METRICS
    app.get("/redis/:hash", redisController.serveMetrics, (req, res) => {
      console.log("Result from Redis cache: ");
      console.log(res.locals.metrics);
      return res.status(200).send(res.locals.metrics);
    });

    // EXPRESS UNKNOWN ROUTE HANDLER
    app.use("*", (req, res) => {
      return res.status(404).send("404 Not Found");
    });

    // EXPRESS GLOBAL ERROR HANDLER
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

  // CALL APOLLO SERVER FOR GRAPHIQL
  return startApolloServer().catch((e) => {
    console.error(e);
    process.exit(1);
  });
};

// NEW APOLLO SERVER PER SCHEMA
const myServers = [];

services.forEach((service) => {
  createNewApolloServer(service)
    .then((data) => myServers.push(data))
    .catch((err) => console.log(err));
});