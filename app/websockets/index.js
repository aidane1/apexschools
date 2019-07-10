const express = require("express");

const router = express.Router();

let clients = {

};

router.ws("/app/courses/:course", async (ws, req) => {
    try {
        ws.broadcast = (message, course) => {
            let sendClients = clients[course];
            for (var key in sendClients) {
                sendClients[key].send(message);
            }
        }
        let { account, key } = await models.apikey.authenticate(req.query["x-id-key"], req.query["x-api-key"]);
        ws.account = account;
        if (clients[req.params.course]) {
            clients[req.params.course][ws.account._id] = ws;
        } else {
            clients[req.params.course] = {};
            clients[req.params.course][ws.account._id] = ws;
        }
        ws.on("close", () => {
            delete clients[ws.account._id];
        });
        ws.on("message", async (msg) => {
            try {
                msg = JSON.parse(msg);
                msg.date = new Date();
                let course = await models.course.findById(req.params.course);
                msg.reference_course = course._id;
                msg.school = course.school;
                msg.uploaded_by = ws.account._id;
                msg.username = ws.account.username;
                let textMessage = await models["course-text"].create(msg);
                textMessage = JSON.stringify(textMessage);
                ws.broadcast(textMessage, req.params.course);
            } catch(e) {
                console.log(e);
                ws.send(JSON.stringify({
                    status: "error",
                    body: "An error occured",
                }));
            }
        })
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;
