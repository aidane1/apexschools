
const session = require("express-session");

let sess = {
    cookie: {},
    resave: false,
    saveUninitialized: true,
}

module.exports = function() {
    sess.secret = server_info.keys.session_secret;
    if (server_info.config.config_id == "development") {
        sess.cookie.secure = false;
    } else {
        sess.cookie.secure = true;
    }
    return session(sess);
}