const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
    
});

router.post("/", async (req, res) => {
    try {
        let school = await models.school.create(req.body);
        res.send({
            status: "ok",
            body: school,
        })
    } catch(e) {
        console.log(e);
        res.error(e.message);
    }
});

router.put("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

module.exports = router;