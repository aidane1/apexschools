
const express = require("express");

const middleware = include('/app/middleware/middleware');

const session = include("/app/session/session");

const app = express();

const routes = [];

module.exports = function() {

    let middlewareBody = middleware();
    for (var key in middlewareBody) {
        app.use(middlewareBody[key]);
    }

    app.use(session());

    if (server_info.config.config_id == "development") {
        
    } else {
        app.set("trust proxy", 1);
    }

    routes.forEach((route) => {
        app.use(route.path, route.component);
    })
    
    const api = include("/app/api/index");
    
    app.use("/api", api);


    app.listen(server_info.config.node_port, () => {
        console.log("app is listening on port " + server_info.config.node_port);
    });
};