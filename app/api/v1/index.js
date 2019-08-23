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
        path: "/transcript",
        component: require(__dirname + "/transcript/index"),
    },
    {
        path: "/schedule",
        component: require(__dirname + "/schedule/index"),
    },
    {
        path: "/comments",
        component: require(__dirname + "/comments/index"),
    },
    {
        path: "/vote",
        component: require(__dirname + "/vote/index"),
    },
    {
        path: "/announcements",
        component: require(__dirname + "/announcements/index"),
    },
    {
        path: "/notifications",
        component: require(__dirname + "/notifications/index"),
    },
    {
        path: "/chatroom-keys",
        component: require(__dirname + "/chatroom-keys/index"),
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