const mysql = require('mysql');
const logging = require('./../logging/loggingService');


const dbConfig = {
    host: config.get('databaseSettings.mysql.MYSQL_HOST'),
    connectionLimit: 1000,
    user: config.get('databaseSettings.mysql.MYSQL_USER'),
    password: config.get('databaseSettings.mysql.MYSQL_PASS'),
    database: config.get('databaseSettings.mysql.MYSQL_DBNAME'),
    port: config.get('databaseSettings.mysql.MYSQL_PORT'),
    multipleStatements: true
};


const initializeConnectionPool = () => {
    return new Promise((resolve, reject) => {
        console.log('CALLING INITIALIZE POOL');
        let numConnectionsInPool = 0;
        let conn = mysql.createPool(dbConfig);
        conn.on('connection', function (connection) {
            numConnectionsInPool++;
            console.log('NUMBER OF CONNECTION IN POOL : ', numConnectionsInPool);
        });
        return resolve(conn);
    });
}


const mysqlQueryPromise = (apiReference, event, queryString, params, noErrorlog) => {
    return new Promise((resolve, reject) => {
        if (!apiReference) {
            apiReference = {
                module: "mysqlLib",
                api: "executeQuery"
            }
        }
        let query = connection.query(queryString, params, (sqlError, sqlResult) => {
            logging.log(apiReference, {
                EVENT: "Executing query " + event, QUERY: query.sql, SQL_ERROR: sqlError,
                SQL_RESULT: sqlResult, SQL_RESULT_LENGTH: sqlResult && sqlResult.length
            });
            if (sqlError || !sqlResult) {
                if (sqlError) {
                    if (!noErrorlog) {
                        logging.log(apiReference, event, sqlError, sqlResult, query.sql);
                    }
                    if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
                        setTimeout(module.exports.mysqlQueryPromise.bind(null, apiReference, event, queryString, params), 50);
                    } else {
                        return reject({ERROR: sqlError, QUERY: query.sql, EVENT: event});
                    }
                }
            }
            return resolve(sqlResult);
        });
    });
}


exports.initializeConnectionPool = initializeConnectionPool;
exports.mysqlQueryPromise = mysqlQueryPromise;