const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const mysqlLib = require('../database/mysqlLib');
const logging = require('../logging/loggingService');


const addCustomer = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let sql = "INSERT INTO `customers` (`user_name`,`email`,`password`) " +
                "VALUES (?,?,?)";
            let values = [payload.user_name, payload.email, payload.password];
            let data = yield mysqlLib.mysqlQueryPromise(apiReference, "addCustomer", sql, values);
            return data;
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        });
    });
};


const getCustomer = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let sql = "SELECT * FROM `customers` WHERE ";
            let values = [];
            if (payload.email) {
                sql += "`email` = ? ";
                values.push(payload.email);
            } else {
                sql += "`customer_id` = ? ";
                values.push(payload.customer_id);
            }
            sql += "LIMIT 1";
            let data = yield mysqlLib.mysqlQueryPromise(apiReference, "getCustomer", sql, values);
            return data;
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        });
    });
};


const removeSession = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let sql = "DELETE FROM `user_sessions` WHERE `customer_id` = ? AND `device_type` = ? ";
            let values = [payload.customer_id, payload.device_type];
            let data = yield mysqlLib.mysqlQueryPromise(apiReference, "removeSession", sql, values);
            return data;
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        });
    });
};


const createSession = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let sql = "INSERT INTO `user_sessions` (`customer_id`,`access_token`,`device_type`)";
            let values = [payload.customer_id, payload.access_token, payload.device_type];
            let data = yield mysqlLib.mysqlQueryPromise(apiReference, "createSession", sql, values);
            return data;
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        });
    });
}


const verifyToken = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            try {
                payload.email = jwt.verify(payload.access_token, config.get('authSettings.authKey'));
                let sql = "SELECT `c`.* FROM `user_sessions` `s` " +
                    "LEFT JOIN `customers` `c` ON `s`.`customer_id` = `c`.`customer_id` " +
                    "WHERE `s`.`access_token` = ? AND `s`.`device_type` = ? AND `c`.`email` = ? LIMIT 1 ";
                let values = [payload.access_token, payload.device_type, payload.email];
                let data = yield mysqlLib.mysqlQueryPromise(apiReference, "verifyToken", sql, values);
                return data;
            } catch (error) {
                throw {
                    "message": constants.responseMessages.INVALID_ACCESS_TOKEN,
                    "status": constants.responseFlags.INVALID_ACCESS_TOKEN,
                    "data": {}
                };
            }
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject(error);
        });
    });
}


const addContact = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let sql = "INSERT INTO `contacts` (`customer_id`,`name`,`phone_no`,`email`) " +
                "VALUES (?,?)";
            let values = [payload.customer_id, payload.name, payload.phone_no, payload.email];
            let data = yield mysqlLib.mysqlQueryPromise(apiReference, "addContact", sql, values);
            return data;
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        });
    });
};


const modifyContact = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let sql = "UPDATE `contacts` SET `name` = ?,`phone_no` = ?,`email` = ? " +
                "WHERE `customer_id` = ? AND `contact_id` = ? ";
            let values = [payload.name, payload.phone_no, payload.email, payload.customer_id, payload.contact_id];
            let data = yield mysqlLib.mysqlQueryPromise(apiReference, "modifyContact", sql, values);
            return data;
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        });
    });
};


const getContacts = (apiReference, payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let sql = "SELECT * FROM `tb_facts` " +
                "WHERE `customer_id` = ? LIMIT ? OFFSET ? ";
            let values = [payload.customer_id, payload.limit, payload.offset];
            let data = yield mysqlLib.mysqlQueryPromise(apiReference, "getContacts", sql, values);
            return data;
        })().then((data) => {
            resolve(data);
        }, (error) => {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        });
    });
};


module.exports.addCustomer = addCustomer;
module.exports.getCustomer = getCustomer;
module.exports.removeSession = removeSession;
module.exports.createSession = createSession;
module.exports.verifyToken = verifyToken;
module.exports.addContact = addContact;
module.exports.modifyContact = modifyContact;
module.exports.getContacts = getContacts;