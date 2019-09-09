const Joi = require('joi');



const validateFields = (req, res, schema) => {
    const validation = Joi.validate(req, schema);
    if (validation.error) {
        return false;
    } else {
        return true;
    }
};


module.exports.validateFields = validateFields;