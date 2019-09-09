const Joi = require('joi');

const constants = require('../constants/constants');
const commonServices = require('../commonServices/service');
const responses = require('../responses/responses');

const apiReferenceModule = 'user';


const signup = (req, res, next) => {
    const schema = Joi.object().keys({
        user_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        device_type: Joi.number().required().valid([constants.deviceType.WEB, constants.deviceType.ANDROID, constants.deviceType.IOS])
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "signup"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};


const login = (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        device_type: Joi.number().required().valid([constants.deviceType.WEB, constants.deviceType.ANDROID, constants.deviceType.IOS])
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "login"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};


const accessTokenLogin = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        device_type: Joi.number().required().valid([constants.deviceType.WEB, constants.deviceType.ANDROID, constants.deviceType.IOS])
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "accessTokenLogin"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};


const createContact = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone_no: Joi.string().required(),
        device_type: Joi.number().required().valid([constants.deviceType.WEB, constants.deviceType.ANDROID, constants.deviceType.IOS])
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "createContact"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};


const updateContact = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        contact_id: Joi.number().required(),
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone_no: Joi.string().required(),
        device_type: Joi.number().required().valid([constants.deviceType.WEB, constants.deviceType.ANDROID, constants.deviceType.IOS])
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "updateContact"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};


const getContacts = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        device_type: Joi.number().required().valid([constants.deviceType.WEB, constants.deviceType.ANDROID, constants.deviceType.IOS]),
        limit: Joi.number().required().min(1).max(20),
        offset: Joi.number().required().min(0)
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "getContacts"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};


module.exports.signup = signup;
module.exports.login = login;
module.exports.accessTokenLogin = accessTokenLogin;
module.exports.createContact = createContact;
module.exports.updateContact = updateContact;
module.exports.getContacts = getContacts;