const express = require("express");

const router = express.Router();

const apiRoutes = {
    "/v1": require(__dirname + "/v1/index"),
}

for (var key in apiRoutes) {
    router.use(key, apiRoutes[key]);
}

module.exports = router;