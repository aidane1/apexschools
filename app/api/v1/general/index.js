const express = require("express");
const router = express.Router();


//syntax for populate: /api/v1/courses?populate=teacher,semester,category
router.get("/:collection", async (req, res) => {
    try {
        let resources = pluralModels[req.params.collection].find({school: req.school._id});
        let populateFeilds = req.query.populate;
        if (populateFeilds) {
            populateFeilds = populateFeilds.split(",");
            for (var i = 0; i < populateFeilds.length; i++) {
                resources.populate(populateFeilds[i]);
            }
        }
        resources = await resources;
        res.okay(resources);
    } catch(e) {
        res.status(500);
        res.error(e.message);
    }
});

router.get("/:collection/:resource", async (req, res) => {
    try {
        let resource = pluralModels[req.params.collection].findOne({_id : req.params.resource});
        let populateFeilds = req.query.populate;
        if (populateFeilds) {
            populateFeilds = populateFeilds.split(",");
            for (var i = 0; i < populateFeilds.length; i++) {
                resource.populate(populateFeilds[i]);
            }
        }
        resource = await resource;
        res.okay(resource);
    } catch(e) {
        res.status(500);
        res.error(e.message);
    }
});

router.post("/:collection", async (req, res) => {
    try {
        let resource = await pluralModels[req.params.collection].create(req.body);
        res.okay(resource);
    } catch(e) {
        res.status(500);
        res.error(e.message);
    }
});

router.post("/:collection/:resource", async (req,res) => {
    res.status(405);
    res.error("Method POST not allowed on item " + req.params.resource + ".");
});

router.put("/:collection", async (req,res) => {
    res.status(405);
    res.error("Method PUT not allowed on entire collection.");
});

router.put("/:collection/:resource", async (req,res) => {
    try {
        let resource = await pluralModels[req.params.collection].findOne({_id : req.params.resource});
        if (resource && resource != null) {
            resource = await pluralModels[req.params.collection].findOneAndUpdate({_id: req.params._id}, {$set: req.body});
            res.status(200);
            res.okay(req.body);
        } else {
            res.status(404);
            res.error("Resource not found.");
        }
    } catch(e) {
        res.status(500);
        res.error(e.message);
    }
});

router.delete("/:collection", async (req,res) => {
    res.status(405);
    res.error("Method DELETE not allowed on entire collection.");
});

router.delete("/:collection/:resource", async (req,res) => {
    try {
        let resource = await pluralModels[req.params.collection].findOneAndDelete({_id : req.params.resource});
        res.status(200);
        res.okay(resource);
    } catch(e) {
        res.status(500);
        res.error(e.message);
    }
});

module.exports = router;