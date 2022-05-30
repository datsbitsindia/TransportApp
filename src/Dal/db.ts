import * as sql from "mssql";
import { asyncWrap } from "../utils/asyncWrap";
// import { sendReport } from '../utils/mail';
import util from "util";
// import redis from 'redis';
import { cimp } from "simple-color-print";
// import getFromCache from './redis/getCachedSpData';
// import cacheSpData from './redis/cacheSpData';
require("dotenv").config();

const { DB_PASSWORD, DB_USERNAME, DB_NAME, DB_SERVER } = process.env;

var sqlConfig: sql.config = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  server: String(DB_SERVER),
  port: 1433,
  database: DB_NAME,
  pool: {
    max: 100,
    min: 3,
    idleTimeoutMillis: 30000,
  },
};

const pool: sql.ConnectionPool = new sql.ConnectionPool(sqlConfig);

pool.on("error", (err) => {
  console.error("SQL error", err);
  // ... error handler
});

//On how to use mssql types = https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mssql/mssql-tests.ts
async function getConnection() {
  return pool.connect();
}

export interface IInput {
  name: string;
  value: number | string;
}

interface IOutput {
  name: string;
  type: sql.ISqlType;
}

// if (!REDIS_HOST || !REDIS_PORT) {
//   process.exit(1);
// }

// export const redisClient = redis.createClient(Number(REDIS_PORT), REDIS_HOST);

// redisClient.on('connect', () => cimp(`REDIS at port: ${REDIS_PORT}`))
// redisClient.on('error', (err) => {
//   console.log('Redis error', util.inspect(err, { breakLength: Infinity }));
//   process.exit(1)
// })

export async function runSP(
  procedure_name: string,
  inputs: IInput[],
  output?: IOutput,
  respondWithError?: boolean,
  log: boolean = true
) {
  const timeId = Math.ceil(Math.random() * 100000);
  console.time(`ID:${timeId} Response time for Running SP ${procedure_name}`); // Start counting time
  const [connectionError, pool] = await asyncWrap(getConnection());
  if (connectionError) {
    console.error(connectionError);
    //sendReport([], connectionError, 'Error in ' + process.env.APP_NAME + ' DB')
    return null;
  }
  //TODO: log this properly
  //console.log("Running SP", util.inspect(procedure_name, { breakLength: Infinity }))
  if (log) {
    console.log("Parameters", util.inspect(inputs, { breakLength: Infinity }));
  }

  // Redis get cache data and return here
  // const cachedData = await getFromCache(procedure_name, DB_NAME, inputs);

  // if (cachedData !== null) {
  //   return JSON.parse(cachedData)
  // }

  let request = inputs.reduce((request, input) => {
    return request.input(input.name, input.value);
  }, pool.request());
  if (output) {
    request = request.output(output.name, output.type);
  }
  const [requestError, result] = await asyncWrap(
    request.execute(procedure_name)
  );
  if (requestError) {
    console.log(util.inspect(requestError, { breakLength: Infinity }));
    //sendReport([], requestError + " " + procedure_name + " " + JSON.stringify(inputs), 'Error in ' + process.env.APP_NAME + ' DB')
  } else {
    //no need to log the results. you can track it by timeId
    //console.log('got ' + result?.recordset?.length + ' results')
  }
  //console.log(result)
  if (requestError && respondWithError) {
    console.timeEnd(
      `ID:${timeId} Response time for Running SP ${procedure_name}`
    );
    return requestError;
  } else if (requestError) {
    console.timeEnd(
      `ID:${timeId} Response time for Running SP ${procedure_name}`
    );
    return null;
  } else {
    console.timeEnd(
      `ID:${timeId} Response time for Running SP ${procedure_name}`
    );

    // Redis cache SP data here
    //cacheSpData(procedure_name, DB_NAME, inputs, result)
    return result;
  }
}
