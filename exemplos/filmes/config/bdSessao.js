const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const sessionStore = new SQLiteStore({
    db: 'sessions.sqlite',
    dir: './'
});

module.exports = sessionStore;