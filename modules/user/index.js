const express = require('express');
const multipart = require('connect-multiparty');
const router = express.Router();
const multipartMiddleware = multipart();

const validator = require('./validator');
const routeHandler = require('./routeHandler');



router.post('/signup', validator.signup, routeHandler.signup);
router.post('/login', validator.login, routeHandler.login);
router.post('/access_token_login', validator.accessTokenLogin, routeHandler.accessTokenLogin);
router.post('/create_contact', validator.createContact, routeHandler.createContact);
router.post('/update_contact', validator.updateContact, routeHandler.updateContact);
router.post('/get_contacts', validator.getContacts, routeHandler.getContacts);

module.exports = router;