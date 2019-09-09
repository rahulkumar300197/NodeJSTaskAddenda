const commonServices                = require('../commonServices/service');
const responses                     = require('../responses/responses');
const user                          = require('./controller');

const signup = (req, res) => {
    user.signup(req.body).then((data) => {
        responses.actionCompleteResponse(res, data);
    }, (error) => {
        responses.sendCustomResponse(res, error);
    });
}


const login = (req, res) => {
    user.login(req.body).then((data) => {
        responses.actionCompleteResponse(res, data);
    }, (error) => {
        responses.sendCustomResponse(res, error);
    });
}


const accessTokenLogin = (req, res) => {
    user.accessTokenLogin(req.query).then((data) => {
        responses.actionCompleteResponse(res, data);
    }, (error) => {
        responses.sendCustomResponse(res, error);
    });
}


const createContact = (req, res) => {
    user.createContact(req.query).then((data) => {
        responses.actionCompleteResponse(res, data);
    }, (error) => {
        responses.sendCustomResponse(res, error);
    });
}


const updateContact = (req, res) => {
    user.updateContact(req.body).then((data) => {
        responses.actionCompleteResponse(res, data);
    }, (error) => {
        responses.sendCustomResponse(res, error);
    });
}


const getContacts = (req, res) => {
    user.getContacts(req.query).then((data) => {
        responses.actionCompleteResponse(res, data);
    }, (error) => {
        responses.sendCustomResponse(res, error);
    });
}


module.exports.signup = signup;
module.exports.login = login;
module.exports.accessTokenLogin = accessTokenLogin;
module.exports.createContact = createContact;
module.exports.updateContact = updateContact;
module.exports.getContacts = getContacts;