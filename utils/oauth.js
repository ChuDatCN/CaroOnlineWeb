var config = require('../config.js');

module.exports = {
    'facebookAuth': {
        'clientID': '2370354149876596',
        'clientSecret': '016af082efd81b61ac5ad0df64171ced',
        'callbackURL': config['server-domain'] + 'users/login/facebook/callback'
    },
    'googleAuth': {
        'clientID': '294735005470-7i7b2t6b0hq0pa842f6q5mncr48l5o9d.apps.googleusercontent.com',
        'clientSecret': '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',
        'callbackURL': config['server-domain'] + 'users/login/google/callback'
    }
};