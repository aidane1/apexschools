const express = require("express");

const router = express.Router();

router.ws("/app/:course", (ws, req) => {
    ws.on("message", async (msg) => {
        console.log(message);
        ws.send(msg);
    })
});

module.exports = router;