const Promise = require('bluebird');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const service = require('./service');
const constants = require('./../constants/constants');
const commonService = require('./../commonServices/service');


const signup = (payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let customerData = yield service.getCustomer(payload.apiReference, {email: payload.email});
            if (!_.isEmpty(customerData)) {
                throw {
                    "message": constants.responseMessages.USER_ALREADY_EXISTS,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }
            payload.password = bcrypt.hash(payload.password, config.get('authSettings.saltRounds'));
            customerData = yield service.addCustomer(payload.apiReference, payload);
            payload.access_token = jwt.sign({email: payload.email}, config.get('authSettings.authKey'));
            payload.customer_id = customerData.insertId;
            yield service.createSession(payload.apiReference, payload);
            return {
                customer_id: payload.customer_id,
                user_name: payload.user_name,
                email: payload.email,
                access_token: payload.access_token,
            };
        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};


const login = (payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let customerData = yield service.getCustomer(payload.apiReference, {email: payload.email});
            if (_.isEmpty(customerData)) {
                throw {
                    "message": constants.responseMessages.USER_NOT_FOUND,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }
            let isPasswordMatched = bcrypt.compare(payload.password, customerData[0].password);
            if (isPasswordMatched) {
                yield service.removeSession(payload.apiReference, {
                    customer_id: customerData[0].customer_id,
                    device_type: payload.device_type
                });
                payload.access_token = jwt.sign({email: customerData[0].email}, config.get('authSettings.authKey'));
                yield service.createSession(payload.apiReference, {
                    customer_id: customerData[0].customer_id,
                    device_type: payload.device_type,
                    access_token: payload.access_token
                });
                return {
                    customer_id: customerData[0].customer_id,
                    user_name: customerData[0].user_name,
                    email: customerData[0].email,
                    access_token: payload.access_token
                };
            } else {
                throw {
                    "message": constants.responseMessages.INVALID_PASSWORD,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }

        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};


const accessTokenLogin = (payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let customerData = yield service.verifyToken(payload.apiReference, {access_token: payload.access_token});
            if (_.isEmpty(customerData)) {
                throw {
                    "message": constants.responseMessages.USER_NOT_FOUND,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }
            yield service.removeSession(payload.apiReference, {
                customer_id: customerData[0].customer_id,
                device_type: payload.device_type
            });
            payload.access_token = jwt.sign({email: customerData[0].email}, config.get('authSettings.authKey'));
            yield service.createSession(payload.apiReference, {
                customer_id: customerData[0].customer_id,
                device_type: payload.device_type,
                access_token: payload.access_token
            });
            return {
                customer_id: customerData[0].customer_id,
                user_name: customerData[0].user_name,
                email: customerData[0].email,
                access_token: payload.access_token
            };

        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};


const createContact = (payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let customerData = yield service.verifyToken(payload.apiReference, {access_token: payload.access_token});
            if (_.isEmpty(customerData)) {
                throw {
                    "message": constants.responseMessages.USER_NOT_FOUND,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }
            let contact = yield service.addContact(payload.apiReference, {
                customer_id: customerData[0].customer_id,
                name: payload.name,
                phone_no: payload.phone_no,
                email: payload.email
            });

            return {
                contact_id: contact.insertId
            };

        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};


const updateContact = (payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let customerData = yield service.verifyToken(payload.apiReference, {access_token: payload.access_token});
            if (_.isEmpty(customerData)) {
                throw {
                    "message": constants.responseMessages.USER_NOT_FOUND,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }
            let contact = yield service.modifyContact(payload.apiReference, {
                customer_id: customerData[0].customer_id,
                contact_id: payload.contact_id,
                name: payload.name,
                phone_no: payload.phone_no,
                email: payload.email
            });

            return {};

        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};


const getContacts = (payload) => {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let customerData = yield service.verifyToken(payload.apiReference, {access_token: payload.access_token});
            if (_.isEmpty(customerData)) {
                throw {
                    "message": constants.responseMessages.USER_NOT_FOUND,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }
            yield service.getContacts(payload.apiReference, {
                customer_id: customerData[0].customer_id,
                limit: payload.limit,
                offset: payload.offering
            });
            return {};

        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};


module.exports.signup = signup;
module.exports.login = login;
module.exports.accessTokenLogin = accessTokenLogin;
module.exports.createContact = createContact;
module.exports.updateContact = updateContact;
module.exports.getContacts = getContacts;
