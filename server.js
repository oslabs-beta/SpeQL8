const pg = require('pg');
const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { ApolloLogPlugin } = require('apollo-log');
// const {performance} = require('perf_hooks');
const cors = require('cors');
const http = require('http');



//MOVING THIS UP TOP
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//ALLAN'S SOCKET IO STUFF//
const server = http.createServer(app);


const socketIo = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "DELETE"]
  }
});

// const io = socketIo(server);

const getApiAndEmit = socket => {
  const response = new Date();
  socket.emit("FromAPI", response);
}

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

app.post('/newServer', (req, res) => {
  console.log('inside the /newServer route')
  console.log(req.body);
  createNewApolloServer(req.body);
})

app.delete('/deleteServer/:port', (req, res) => {
  console.log('***IN DELETE****');
  const myPort = req.params.port;
  const connectionKey = `6::::${myPort}`;
  myServers.forEach(server => {
    if (myPort == 4000) {
      console.log('You may not close port 4000. Graphiql must be provided an active GraphQL API (of which there will always be one running on 4000)');
    } 
    else if (server._connectionKey == connectionKey) {
      // console.log(server.address().port)
      console.log(`server on ${myPort} is about to be shut down`);
      server.close();
      // console.log(server.address().port)
    }
  })
  // console.log(services);
  // for(let i = 0; i < services.length; i++){
  //   console.log(services[i].port)
  //   if(services[i].port == myPort) {
  //     services.splice(i, 1);
  //   }
  // }
  // console.log(services);
});

server.listen(3333, ()=> {
  console.log('listening for new APIs to spin up on port 3333')
});


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
              enhanceGraphiql: true,
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
    app.use(express.urlencoded({
      extended: true
    }));

    const corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));
  
    app.get('/redis', redisController.serveMetrics, (req, res) => {
      console.log('Result from Redis cache: ');
      console.log(res.locals.metrics);
      return res.status(200).send(res.locals.metrics);
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
    const myApp = app.listen({ port:service.port });
    console.log(`🔮 Fortunes being told at http://localhost:${service.port}${server.graphqlPath}✨`);
    return myApp;
  }
  
  return startApolloServer()
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
  };  

  const myServers = [];
  
  services.forEach((service) => {
    createNewApolloServer(service)
    .then(data => myServers.push(data))
    .catch(err => console.log(err))
  })









 
