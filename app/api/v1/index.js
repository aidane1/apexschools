const express = require("express");

const router = express.Router();

const apiRoutes = {
    "/users": require(__dirname + "/users/index"),
    // "/courses": require(__dirname + "/courses/index"),
    // "/teachers": require(__dirname + "/teachers/index"),
    // "/assignments": require(__dirname + "/assignments/index"),
    // "/notes": require(__dirname + "/notes/index"),
    // "/schools": require(__dirname + "/schools/index"),
}

for (var key in apiRoutes) {
    router.use(key, apiRoutes[key]);
}

module.exports = router;