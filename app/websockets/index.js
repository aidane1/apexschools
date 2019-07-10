const express = require("express");

const router = express.Router();

router.ws("/app/courses/:course", (ws, req) => {
    ws.on("message", async (msg) => {
        try {
            msg = JSON.parse(msg);
            msg.date = new Date();
            let course = await models.course.findById(req.params.course);
            let { account, key } = await models.apikey.authenticate(msg["x-id-key"], msg["x-api-key"]);
            msg.reference_course = course._id;
            msg.school = course.school;
            msg.uploaded_by = account._id;
            console.log(msg);
            let textMessage = await models["course-text"].create(msg);
            ws.send(JSON.stringify(textMessage));
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