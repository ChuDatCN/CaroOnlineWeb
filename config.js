// these exports are for localhost and database mysql local
var exports_1 = {
    'client-domain': '//localhost:6969/',
    'server-domain': '//localhost:3000/',
    'database': {
        'host': 'localhost',
        'port': '3306',
        'user': 'root',
        'password': 'mocmeo12',
        'database': 'web-btcn06-1612422'
    }
}

// these exports are for localhost and database remote
var exports_2 = {
    'client-domain': '//localhost:6969/',
    'server-domain': '//localhost:3000/',
    'database': {
        'host': 'sql6.freemysqlhosting.net',
        'port': '3306',
        'user': 'sql6507055',
        'password': 'rP7iBhQvuM',
        'database': 'sql6507055'
    }
}

// these exports are for uploading to heroku
var exports_3 = {
    'client-domain': 'https://web-caro-online-client.herokuapp.com/',
    'server-domain': 'https://web-caro-online-server.herokuapp.com/',
    'database': {
        'host': 'sql6.freemysqlhosting.net',
        'port': '3306',
        'user': 'sql6507055',
        'password': 'rP7iBhQvuM',
        'database': 'sql6507055'
    }
}

module.exports = exports_3; 