
var express = require('express');
var userModel = require('../models/users.model');
var passport = require('passport');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();
var passport = require('passport');
var config = require('../config.js');

// test loading database
router.post('/', (req, res, next) => {
    userModel.all().then(rows => {
        res.status(200).json({
            message: 'Connect database successful'
        });
    }).catch(err => {
        res.status(400).json({
            message: 'Connect database fail'
        });
    });
});

router.post('/user-list', (req, res, next) => {
    userModel.all().then(rows => {
        res.status(200).json(rows);
    }).catch(err => {
        res.status(400).json({
            message: 'Connect database fail'
        });
    });
});
// register a new user
router.post('/register', (req, res, next) => {

    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var fullname = req.body.fullname;

    // check params
    if (!username || !password || !email || !fullname) {
        res.status(400).json({
            message: 'Please fill all the information!'
        });
    }
    else {
        // hash password
        var saltRounds = 10;
        var hash = bcrypt.hashSync(password, saltRounds);

        // create an entity
        var entity = {
            username: username,
            password: hash,
            email: email,
            fullname: fullname
        }

        // add to database
        userModel.add(entity).then(id => {
            res.status(200).json({
                message: 'SUCCESS'
            });
        }).catch(err => {

            var errMessage = err.code;

            switch (err.code) {
                case 'ER_DUP_ENTRY':
                    errMessage = 'Username has already existed';
                    break;
            }

            res.status(400).json({
                message: errMessage
            });
        })
    }
});

// login with username & password
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({
                message: info.message,
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.status(400).json({
                    message: err
                });
            }

            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(JSON.stringify(user), 'nghiatq_jwt_secretkey');
            return res.json({
                user,
                token
            });
        });
    })(req, res);
});

// facebook login
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/login/facebook/callback', passport.authenticate('facebook', {
    session: false,
    failureRedirect: config['client-domain'] + 'login/',
}), (req, res) => {
    const token = jwt.sign(JSON.stringify(req.user), 'nghiatq_jwt_secretkey');
    res.redirect(config['client-domain'] + 'login?token=' + token + '#nghiatq');
});

// google login
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: config['client-domain'] + 'login/',
}), (req, res) => {
    const token = jwt.sign(JSON.stringify(req.user), 'nghiatq_jwt_secretkey');
    res.redirect(config['client-domain'] + 'login?token=' + token + '#nghiatq');
});

// register a new user
router.post('/changeinfo', passport.authenticate('jwt', {session: false}), (req, res, next) => {

    var username = req.body.username;
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    var email = req.body.email;
    var fullname = req.body.fullname;

    // check params
    if (!username || !email || !fullname) {
        res.status(400).json({
            message: 'Please fill all the information!'
        });
    }
    else {
        userModel.get(username).then(rows => {
            if (rows.length === 0) {
                return res.status(400).json({
                    message: 'Account does not exist'
                });
            }
            var user = rows[0];

            // update basic info
            var entity = {
                username: username,
                email: email,
                fullname: fullname
            }

            // update password
            if (oldPassword || password) {

                // compare password
                var ret = bcrypt.compareSync(oldPassword, user.password);
                if (!ret) {
                    return res.status(400).json({
                        message: 'Old password is incorrect'
                    });
                }
                else {
                    var saltRounds = 10;
                    var hash = bcrypt.hashSync(password, saltRounds);
                    entity.password = hash;
                }
            }

            // write to database
            userModel.put(entity).then(id => {
                return res.status(200).json({
                    message: 'UPDATE SUCCESS'
                });
            }).catch(err => {
                return res.status(400).json({
                    message: 'Error! Please try again!'
                });
            })
            
        }).catch(err => {
            return res.status(400).json({
                message: 'Error! Please try again!'
            });
        })
    }
});

module.exports = router;