const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// eslint-disable-next-line consistent-return
exports.signup = async (req, res) => {
	const data = req.body;
	if (!data || !data.email || !data.password) {
		return res.status(400).json({ status: 'error', message: 'Invalid parameters' });
	}

	const user = new User({
		email: req.body.email.toLowerCase(),
	});
	user.password = user.generateHash(req.body.password);
	user.save((err) => {
		if (err) {
			let msg = err.message;
			if (err.code === 11000) { msg = 'An account already exists with the email.'; }
			return res.status(400).json({ status: 'error', message: msg });
		}
		return res.status(200).json({ status: 'success', user });
	});
};

exports.login = (req, res) => {
	if (!req.body || !req.body.email || !req.body.password) {
		return res.json({
			status: 'error', message: 'Invalid parameters',
		});
	}

	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			return res.json({ status: 'error', message: err.message });
		} if (user && bcrypt.compareSync(req.body.password, user.password)) {
			const token = jwt.encode({ email: user.email }, process.env.JWT_TOKEN_SECRET);
			return res.status(200).json({ status: 'success', data: { user, token } });
		}
		return res.status(400).json({ status: 'error', message: 'Invalid email/password' });
	});
};

exports.user = (req, res) => res.json({ status: 'success', data: req.user });
