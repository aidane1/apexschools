const express = require("express");

const helmet = require("helmet");

const app = express();

app.use(helmet);


const routes = [{

}]

routes.forEach((route) => {
    app.use(route.path, route.component);
})

const api = include("/app/api/index");

app.use("/api", api);

module.exports = function(config) {
    app.listen(config.node_port, () => {
        console.log("app is listening on port " + config.node_port);
    });
};