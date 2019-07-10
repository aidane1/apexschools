const express = require("express");

const router = express.Router();

module.exports = function(expressWs) {
    router.ws("/app/courses/:course", (ws, req) => {
        console.log(req.path);
        let aWss = expressWs.getWs(path.join("/websockets", req.path));
        console.log(aWss);
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
    return router;
}