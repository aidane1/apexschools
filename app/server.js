const express = require("express");

const httpsRedirect = require("express-https-redirect");

const middleware = include("/app/middleware/middleware");

const session = include("/app/session/session");

const app = express();

const expressWs = require("express-ws")(app);

const routes = [
  {
    path: "/",
    component: require(__dirname + "/routes/index")
  },
  {
    path: "/home",
    component: require(__dirname + "/routes/home")
  },
  {
    path: "/login",
    component: require(__dirname + "/routes/login")
  },
  {
    path: "/privacy",
    component: require(__dirname + "/routes/privacy")
  },
  {
    path: "/contact",
    component: require(__dirname + "/routes/contact")
  },
  {
    path: "/assassins",
    component: require(__dirname + "/routes/assassins")
  },
  {
	  path: "/uploads",
	  component: require(__dirname +  "/routes/rickroll")
  },
  {
	path: "/video",
	component: require(__dirname + "/routes/video")
  }
];

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

  routes.forEach(route => {
    app.use(route.path, route.component);
  });

  // if (server_info.config.config_id == 'production') {
  //   app.use ('/', httpsRedirect ());
  // }

  const api = include("/app/api/index");

  const graphapi = include("/app/graphql_api/index");

  const admin = include("/app/admin/index");

  const graduation = include("/app/graduation/index");

  const websockets = include("/app/websockets/index");

  app.use("/api", api);

  app.use("/graph-api", graphapi);

  app.use("/admin", admin);

  app.use("/graduation", graduation);

  app.use("/web-sockets", websockets);

  app.listen(server_info.config.node_port, () => {
    console.log("app is listening on port " + server_info.config.node_port);
  });
};
