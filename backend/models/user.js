
const validator = require('validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
	email: {
		type: String,
		unique: [true, 'Email is already registered.'],
		required: [true, 'Email is mandatory'],
		trim: true,
		lowercase: true,
		validate: {
			isAsync: false,
			validator: validator.isEmail,
			message: 'Please fill a valid email address',
		},
	},
	password: {
		type: String,
		trim: true,
	},

});

User.methods.generateHash = (password) => bcrypt.hashSync(password, 10);
module.exports = mongoose.model('User', User);
