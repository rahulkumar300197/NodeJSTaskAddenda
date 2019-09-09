const apiReferenceModule = "startup";

const Promise = require('bluebird');

const logging = require('./../logging/loggingService');
const mysqlLib = require('./../database/mysqlLib');
const httpLib = require('./../httpService/httpService');

const initializeServer = () => {
    return new Promise((resolve, reject) => {
        let apiReference = {
            module: apiReferenceModule,
            api: "initializeServer"
        };
        Promise.coroutine(function* () {
            connection = yield mysqlLib.initializeConnectionPool();
            let server = yield httpLib.startHttpServer();
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject(error);
        });
    });
}


exports.initializeServer = initializeServer;