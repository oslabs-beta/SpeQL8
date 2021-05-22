// REDIS
const Redis = require('ioredis');
const redis = new Redis();

// TIME DATA
// const timeDataModule = require('./src/timeData');
// const timeData = timeDataModule.timeData;

const redisController = {};

redisController.serveMetrics = (req, res, next) => {
    console.log(req.params.hash);
    const result = redis.hgetall(req.params.hash, (err, result) => {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            res.locals = result;
            console.log(result);
            return next();
        }
    });
};

const cachePlugin = {
    requestDidStart(context) {
      const clientQuery = context.request.query;
      const cq = Object.values(clientQuery);
        if (cq[11]!=='I'&&cq[12]!=='n'&&cq[13]!=='t'&&cq[14]!=='r'&&cq[15]!=='o'&&cq[16]!=='s'&&cq[17]!=='p'&&cq[18]!=='e') {
            return {
                async willSendResponse(requestContext) {
                    // console.log('schemaHash: ' + requestContext.schemaHash);
                    // console.log('queryHash: ' + requestContext.queryHash);
                    console.log('operation: ' + requestContext.errors);
                    //Log the tracing extension data of the response
                    const totalDuration = `${requestContext.response.extensions.tracing.duration} microseconds`;
                    const now = Date.now();
                    const hash = `${now}-${requestContext.queryHash}`
                    const timeStamp = new Date().toString();
                    await redis.hset(`${hash}`, 'totalDuration', `${totalDuration}`);
                    await redis.hset(`${hash}`, 'clientQuery', `${clientQuery.toString()}`);
                    await redis.hset(`${hash}`, 'timeStamp', `${timeStamp}`);
                    console.log(hash);
                    // timeData.push(hash);
                    // console.log(`timeData = ${timeData}`)
                },
            };
        } else return console.log('Introspection Query Fired');
    }
  }; 

module.exports = { redisController, cachePlugin };