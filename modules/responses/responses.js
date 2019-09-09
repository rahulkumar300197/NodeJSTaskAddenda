const zlib = require('zlib');
const constants = require('./../constants/constants');


const parameterMissingResponse = (res) => {
    let response = {
        "message": constants.responseMessages.PARAMETER_MISSING,
        "status": constants.responseFlags.PARAMETER_MISSING,
        "data": {}
    };
    res.send(JSON.stringify(response));
};

const actionCompleteResponse = (res, data) => {
    let response = {
        "message": constants.responseMessages.ACTION_COMPLETE,
        "status": constants.responseFlags.ACTION_COMPLETE,
        "data": data || {}
    };

    res.send(JSON.stringify(response));
};

const sendCustomResponse = (res, response) => {
    res.send(JSON.stringify(response));
};


exports.parameterMissingResponse = parameterMissingResponse;
exports.actionCompleteResponse = actionCompleteResponse;
exports.sendCustomResponse = sendCustomResponse;