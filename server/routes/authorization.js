var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.get('/', isValidUser, function (req, res, next) {
    return res.status(200).json(req.user);
});

function isValidUser(req, res, next) {
    if (req.isAuthenticated()) next();
    else return res.status(401).json({ message: 'Unauthorized Request' });
}

module.exports = router;
