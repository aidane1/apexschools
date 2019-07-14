const express = require("express");
const router = express.Router();


//syntax for populate: /api/v1/courses?populate=teacher,semester,category
//syntax for notes, etc: /api/v1/notes?reference_courses=id_1,id_2,id_3
//syntax for uploaded by: /api/v1/notes?uploaded_by=id_1
router.get("/:collection", async (req, res) => {
    try {
        let reference_courses = req.query.reference_course;
        let uploaded_by = req.query.uploaded_by;
        let findFields = {};
        if (reference_courses) {
            reference_courses = reference_courses.split(",");
            findFields["reference_course"] = {$in: reference_courses};
        }
        if (uploaded_by) {
            uploaded_by = uploaded_by.split(",");
            findFields["uploaded_by"] = {$in: uploaded_by};
        }
        let resources = pluralModels[req.params.collection].find({school: req.school._id, ...findFields});
        let populateFeilds = req.query.populate;
        if (populateFeilds) {
            populateFeilds = populateFeilds.split(",");
            for (var i = 0; i < populateFeilds.length; i++) {
                resources.populate(populateFeilds[i]);
            }
        }
        let orderBy = req.query.order_by;
        if (orderBy) {
            let orderObject = {};
            orderObject[orderBy] = parseInt(req.query.order_direction);
            resources.sort(orderObject);
        }
        let limit = req.query.limit;
        if (limit) {
            resources.limit(parseInt(req.query.limit));
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
        let resource = await pluralModels[req.params.collection].create({...req.body, school: req.school._id});
        resource = pluralModels[req.params.collection].findOne({_id : resource._id});
        let populateFeilds = req.query.populate;
        if (populateFeilds) {
            populateFeilds = populateFeilds.split(",");
            for (var i = 0; i < populateFeilds.length; i++) {
                resource.populate(populateFeilds[i]);
            }
        }
        resource = await resource;
        if (req.params.collection == "assignments") {
            global.dispatchAction("assignment-upload", resource);
        }
        res.okay(resource);
    } catch(e) {
        console.log(e);
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
    console.log(req.params.collection);
    try {

        let resource = await pluralModels[req.params.collection].findOne({_id : req.params.resource});
        let updateUser = false;
        if (resource && resource != null) {
            let updateBody = {};
            if (req.query.updateMethods) {
                let updateMethods = req.query.updateMethods.split(",");
                for (var i = 0; i < updateMethods.length; i++) {
                    let currentUpdateBody = {};
                    let updateFields = req.query[updateMethods[i]] ? req.query[updateMethods[i]].split(",") : [];
                    for (var j = 0; j < updateFields.length; j++) {
                        currentUpdateBody[updateFields[j]] = req.body[updateFields[j]];
                        delete req.body[updateFields[j]];
                    }
                    updateBody[updateMethods[i]] = currentUpdateBody;
                }
            }
            if (updateBody["$set"]) {
                updateBody["$set"] = {...req.body, ...updateBody["$set"]};
            } else {
                updateBody["$set"] = req.body;
            }
            if (updateBody["$push"] && updateBody["$push"]["response_resources"]) {
                updateUser = true;
            }
            resource = pluralModels[req.params.collection].findOneAndUpdate({_id: req.params.resource}, updateBody, {"new": true});
            let populateFeilds = req.query.populate;
            if (populateFeilds) {
                populateFeilds = populateFeilds.split(",");
                for (var i = 0; i < populateFeilds.length; i++) {
                    resource.populate(populateFeilds[i]);
                }
            }
            resource = await resource;
            if (req.query.updateMethods && req.query.updateMethods.split(",").indexOf("$push") >= 0 && req.query["$push"].split(",").indexOf("response_resources") >= 0) {
                global.dispatchAction("image-reply", resource);
            }
            res.status(200);
            res.okay(resource);
        } else {
            res.status(404);
            res.error("Resource not found.");
        }
    } catch(e) {
        console.log(e);
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