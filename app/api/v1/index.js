const express = require("express");

const router = express.Router();

const apiRoutes = [
    {
        path: "/resources",
        component: require(__dirname + "/resources/index"),
    },
    {
        path: "/accounts",
        component: require(__dirname + "/accounts/index"),
    },
    {
        path: "/authenticate",
        component: require(__dirname + "/authenticate/index"),
    },
    {
        path: "/schools",
        component: require(__dirname + "/schools/index"),
    },
    {
        path: "/app",
        component: require(__dirname + "/app/index"),
    },
    {
        path: "/district-assignments",
        component: require(__dirname + "/district_assignments/index"),
    },
    {
        path: "/",
        component: require(__dirname + "/general/index"),
    }
]

apiRoutes.forEach((route) => {
    router.use(route.path, route.component);
});

module.exports = router;