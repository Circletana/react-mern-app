'use strict';

let validator = require('validator');
let bcrypt = require('bcrypt-nodejs');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let User = new Schema({
    email: {
        type: String,
        unique: [true, "Email is already registered."],
        required: [true, "Email is mandatory"],
        trim: true,
        lowercase: true,
        validate: {
            isAsync: false,
            validator: validator.isEmail,
            message: "Please fill a valid email address"
        }
    },
    password: {
        type: String,
        trim: true,
    }

});

User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', User);