"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSP = void 0;
const sql = __importStar(require("mssql"));
const asyncWrap_1 = require("../utils/asyncWrap");
// import { sendReport } from '../utils/mail';
const util_1 = __importDefault(require("util"));
// import getFromCache from './redis/getCachedSpData';
// import cacheSpData from './redis/cacheSpData';
require("dotenv").config();
const { DB_PASSWORD, DB_USERNAME, DB_NAME, DB_SERVER } = process.env;
var sqlConfig = {
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
const pool = new sql.ConnectionPool(sqlConfig);
pool.on("error", (err) => {
    console.error("SQL error", err);
    // ... error handler
});
//On how to use mssql types = https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mssql/mssql-tests.ts
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        return pool.connect();
    });
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
function runSP(procedure_name, inputs, output, respondWithError, log = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeId = Math.ceil(Math.random() * 100000);
        console.time(`ID:${timeId} Response time for Running SP ${procedure_name}`); // Start counting time
        const [connectionError, pool] = yield asyncWrap_1.asyncWrap(getConnection());
        if (connectionError) {
            console.error(connectionError);
            //sendReport([], connectionError, 'Error in ' + process.env.APP_NAME + ' DB')
            return null;
        }
        //TODO: log this properly
        //console.log("Running SP", util.inspect(procedure_name, { breakLength: Infinity }))
        if (log) {
            console.log("Parameters", util_1.default.inspect(inputs, { breakLength: Infinity }));
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
        const [requestError, result] = yield asyncWrap_1.asyncWrap(request.execute(procedure_name));
        if (requestError) {
            console.log(util_1.default.inspect(requestError, { breakLength: Infinity }));
            //sendReport([], requestError + " " + procedure_name + " " + JSON.stringify(inputs), 'Error in ' + process.env.APP_NAME + ' DB')
        }
        else {
            //no need to log the results. you can track it by timeId
            //console.log('got ' + result?.recordset?.length + ' results')
        }
        //console.log(result)
        if (requestError && respondWithError) {
            console.timeEnd(`ID:${timeId} Response time for Running SP ${procedure_name}`);
            return requestError;
        }
        else if (requestError) {
            console.timeEnd(`ID:${timeId} Response time for Running SP ${procedure_name}`);
            return null;
        }
        else {
            console.timeEnd(`ID:${timeId} Response time for Running SP ${procedure_name}`);
            // Redis cache SP data here
            //cacheSpData(procedure_name, DB_NAME, inputs, result)
            return result;
        }
    });
}
exports.runSP = runSP;
//# sourceMappingURL=db.js.map