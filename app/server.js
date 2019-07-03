
const express = require("express");

const middleware = include('/app/middleware/middleware');

const session = include("/app/session/session");

const app = express();

const routes = [{
    path: "/",
    component: require(__dirname + "/routes/index"),
}];

module.exports = function() {

    let middlewareBody = middleware();
    for (var key in middlewareBody) {
        app.use(middlewareBody[key]);
    }

    app.use(session());

    app.set("view engine", "ejs");

    if (server_info.config.config_id == "development") {
        
    } else {
        app.set("trust proxy", 1);
    }

    routes.forEach((route) => {
        app.use(route.path, route.component);
    })
    
    const api = include("/app/api/index");
    
    const admin = include("/app/admin/index");

    app.use("/api", api);

    app.use("/admin", admin);

    app.listen(server_info.config.node_port, () => {
        console.log("app is listening on port " + server_info.config.node_port);
    });
};