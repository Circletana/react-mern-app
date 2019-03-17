const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const moment = require('moment');
const Config = require('../config');
const User = require('../models/user');
const ThreadController = require('../controllers/thread');
const AuthController = require('../controllers/auth');

function isAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.send({ status:"error", message: "TokenMissing" });
    }

    let token = req.headers.authorization.split(' ')[1];
    let payload = null;
    try {
        payload = jwt.decode(token, Config.TOKEN_SECRET);
    } catch (err) {
        return res.send({ status:"error", message: "TokenInvalid" });
    }

    if (payload.exp <= moment().unix())
        return res.send({ status:"error", message: 'TokenExpired' });

    User.findOne({email:payload.email}, (err, user) => {
        if (!user) return res.send({ status:"error", message: 'UserNotFound' });
        req.user = user;
        next();
    });


}

router.get('/', (req, res) => {
    res.send({ test: 1 });
});


router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);

router.post('/user', isAuthenticated, AuthController.user);

router.post('/newthread', isAuthenticated, ThreadController.createNewThread);

router.post('/loadthreads', isAuthenticated, ThreadController.getAllThreads);

module.exports = router;