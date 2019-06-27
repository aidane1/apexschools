const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let schools = await models.school.find();
        res.status(200);
        res.okay(schools);
    } catch(e) {
        console.log(e);
        res.status(500);
        res.error(e.message);
    }
});

router.get("/:school", async (req, res) => {
    try {
        let school = models.school.findById({_id : req.params.school});
        let populateFeilds = req.query.populate;
        if (populateFeilds) {
            populateFeilds = populateFeilds.split(",");
            for (var i = 0; i < populateFeilds.length; i++) {
                school.populate(populateFeilds[i]);
            }
        }
        school = await school;
        res.okay(school);
    } catch(e) {
        console.log(e);
        res.status(500);
        res.error(e.message);
    }
});

router.post("/", async (req, res) => {
    try {
        let school = await models.school.create(req.body);
        res.okay(school);
    } catch(e) {
        console.log(e);
        res.status(500);
        res.error(e.message);
    }
});

router.put("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

module.exports = router;