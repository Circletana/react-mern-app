const express = require('express');

const router = express.Router();
const jwt = require('jwt-simple');
const moment = require('moment');
const expressRedisCache = require('express-redis-cache');
const { getRedis } = require('../helpers/redis');

const cache = expressRedisCache({ client: getRedis });
const User = require('../models/user');
const ThreadController = require('../controllers/thread');
const AuthController = require('../controllers/auth');

cache.on('error', (error) => {
	// eslint-disable-next-line no-console
	console.error('EXPRESS-REDIS-CACHE', error);
});

function isAuthenticated(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(400).send({ status: 'error', message: 'TokenMissing' });
	}

	const token = req.headers.authorization.split(' ')[1];
	let payload = null;
	try {
		payload = jwt.decode(token, process.env.JWT_TOKEN_SECRET);
	} catch (err) {
		console.log(err);
		return res.status(400).send({ status: 'error', message: 'TokenInvalid' });
	}

	if (payload.exp <= moment().unix()) { return res.send({ status: 'error', message: 'TokenExpired' }); }

	User.findOne({ email: payload.email }, (err, user) => {
		if (!user) return res.send({ status: 'error', message: 'UserNotFound' });
		// eslint-disable-next-line no-param-reassign
		delete user.password;
		req.user = user;
		return next();
	});

	return null;
}

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/user', isAuthenticated, AuthController.user);
router.post('/newthread', isAuthenticated, ThreadController.createNewThread);
router.post('/loadthreads', isAuthenticated, ThreadController.getAllThreads);

router.post('*', (req, res) => {
	res.status(404).json({ status: 'error', message: 'Invalid route' });
});

// router.post('/upload', (req, res) => {
// 	console.log('files', req.files);
// 	const fs = require('fs');
// 	console.log(req.files[0].data.toString('utf8'));
// 	res.json({ status: 'success' });
// });

module.exports = router;
