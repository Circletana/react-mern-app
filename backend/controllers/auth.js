const User = require('../models/user');
const jwt = require('jwt-simple');
const Config = require('../config');
const bcrypt = require('bcrypt-nodejs');

exports.signup = function(req, res) {
    let user = new User({
        email: req.body.email.toLowerCase()
    });
    user.password = user.generateHash(req.body.password);
    user.save(err => {
        if (err) {
            console.log(err.message);
            let msg = err.message;
            if(err.code == 11000)
                msg = "An account already exists with the email.";
            return res.json({ status: "error", message: msg });
        }
        return res.json({ status: "success", user: user });
    });

}

exports.login = function(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log(err);
            return res.json({ status: "error", message: err.message });
        } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.encode({ email: user.email }, Config.TOKEN_SECRET);
            res.json({ status: "success", data: { user: user, token: token } });
        } else
            res.json({ status: "error", message: "Invalid email/password" });

    });
}

exports.user = function(req, res){
    console.log(JSON.stringify(req.user));
    return res.json({status:"success", data:req.user});
}