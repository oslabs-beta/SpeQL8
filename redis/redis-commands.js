// REDIS
const Redis = require("ioredis");
const redis = new Redis();

// SOCKET.IO STUFF
let updater = {};


// SOME FUNCTIONS
const addEntry = async (hashCode) => {
  await redis.incr("totalEntries");
  const key = await redis.get("totalEntries", async (err, res) => {
    if (err) throw err;
    else await redis.set(res, hashCode);
  });
  return key;
};

const timer = (t0, t1) => {
    const start = parseInt(t0[0])*1000000 + parseInt(t0[1]);
    const stop = parseInt(t1[0])*1000000 + parseInt(t1[1]);
    return stop - start;
}

// EXPRESS MIDDLEWARE
const redisController = {};

redisController.serveMetrics = async (req, res, next) => {
    // const key = await redis.get('totalEntries', (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         return next(err);
    //     } else {
    //         return result;
    //     }
    // });
    // const hashCode = await redis.get(key, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         return next(err);
    //     } else {
    //         return result;
    //     }
    // })
    const start = await redis.time();
    
    redis.hgetall(req.params['hash'], async (err, result) => {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            const stop = await redis.time();
            result.cacheTime = await timer(start, stop);
            res.locals.metrics = result;

            return next();
        }
    });
};

const cachePlugin = {
    requestDidStart(context) {
      console.log('cache plugin fired');
      const clientQuery = context.request.query;
      const cq = Object.values(clientQuery);
        if (cq[11]!=='I'&&cq[12]!=='n'&&cq[13]!=='t'&&cq[14]!=='r'&&cq[15]!=='o'&&cq[16]!=='s'&&cq[17]!=='p'&&cq[18]!=='e') {
            return {
                async willSendResponse(requestContext) {
                    // console.log('schemaHash: ' + requestContext.schemaHash);
                    // console.log('queryHash: ' + requestContext.queryHash);
  
                    console.log('operation: ' + requestContext.errors);
                    const totalDuration = requestContext.response.extensions.tracing.duration;
                    
                    const resolvers = JSON.stringify(requestContext.response.extensions.tracing.execution.resolvers);
                    const now = Date.now();
                    const hash = `${now}-${requestContext.queryHash}`
                    const timeStamp = new Date().toString();
                    await redis.hset(`${hash}`, 'totalDuration', `${totalDuration}`);
  
  
                    //....queryBreakdown
                    await redis.hset(`${hash}`, 'clientQuery', `${clientQuery.toString()}`);
                    await redis.hset(`${hash}`, 'timeStamp', `${timeStamp}`);
                    await redis.hset(`${hash}`, `resolvers`, `${resolvers}`);
                    
                    addEntry(hash);

                    updater.totalDuration = totalDuration;
                    updater.clientQuery = clientQuery;
                    updater.hash = hash;
  
                },
            };
        } else return console.log('Introspection Query Fired');
    }
  }; 

  

module.exports = { redisController, cachePlugin, updater };
