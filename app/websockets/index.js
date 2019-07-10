const express = require("express");

const router = express.Router();

let clients = {

};

router.ws("/app/courses/:course", (ws, req) => {
    ws.getUniqueID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4();
    };
    ws.id = ws.getUniqueID();
    clients[ws.id] = ws;
    console.log(clients);
    ws.on("message", async (msg) => {
        try {
            msg = JSON.parse(msg);
            console.log(msg);
            msg.date = new Date();
            let course = await models.course.findById(req.params.course);
            let { account, key } = await models.apikey.authenticate(msg["x-id-key"], msg["x-api-key"]);
            msg.reference_course = course._id;
            msg.school = course.school;
            msg.uploaded_by = account._id;
            msg.username = account.username;
            let textMessage = await models["course-text"].create(msg);
            aWss.clients.forEach(client => {
                client.send(JSON.stringify(textMessage));
            });
        } catch(e) {
            console.log(e);
            ws.send(JSON.stringify({
                status: "error",
                body: "An error occured",
            }));
        }
    })
});

module.exports = router;
