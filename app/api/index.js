const express = require("express");

const router = express.Router();

const apiRoutes = [{
  path: "/v1",
  component: require(__dirname + "/v1/index")
}]

apiRoutes.forEach((route) => {
  router.use(route.path, route.component);
})

module.exports = router;