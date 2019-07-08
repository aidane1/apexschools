const express = require("express");
const mongoose = require("mongoose");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let resources = await models.resource.find({school: req.school._id});
        res.status(200);
        res.okay(resources);
    } catch(e) {
        console.log(e);
        res.status(500);
        res.error(e.message);
    }
});

router.get("/:resource", async (req, res) => {
    try {
        let resource = await models.resource.findOne({$and: [{school: req.school._id}, {_id: req.params.resource}]});
        if (resource && resource != null) {
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

router.post("/", async (req, res) => {
    try {
        if (req.query.base64) {
            console.log(req.body);
            let id = mongoose.Types.ObjectId();
            let schoolDir = `/info/${req.school._id}`;
            let pathString = req.body.path || "";
            if (pathString.indexOf("..") === -1) {
                schoolDir = path.join(schoolDir, pathString);
            }
            pathString = schoolDir;
            pathString = path.join(pathString, `/${id}`);
            let fileName = `${new Date().getTime()}.${req.body.uri.split(".")[1]}`;
            mkdirp(abs_path(path.join("/public", pathString)), (err) => {
                fs.writeFile(abs_path(path.join("/public", pathString, fileName)), req.body.base64, 'base64', (err) => {
                    console.log(err);
                });
            })
            res.send("yeees");
        } else {
            let file = req.files.resource;
            if (file) {
                let id = mongoose.Types.ObjectId();
                let schoolDir = `/info/${req.school._id}`;
                let pathString = req.body.path || "";
                if (pathString.indexOf("..") === -1) {
                    schoolDir = path.join(schoolDir, pathString);
                }
                pathString = schoolDir;
                pathString = path.join(pathString, `/${id}`);
                mkdirp(abs_path(path.join("/public", pathString)), (err) => {
                    file.mv(abs_path(path.join("/public", pathString, file.name)), (err) => {
                        let fileDescription = {
                            name: file.name,
                            path: path.join(pathString, file.name),
                            date_created: new Date(),
                            uploaded_by: req.account._id,
                        };
                        fs.writeFile(abs_path(path.join("/public", pathString, "description.json")), JSON.stringify({...fileDescription, mimetype: file.mimetype}), async (err) => {
                            if (!err) {
                                let resource = await models.resource.create({...fileDescription, school: req.school._id});
                                res.status(201);
                                res.okay(resource);
                            } else {
                                res.status(500);
                                res.error(err);
                            }
                        });
                    });
                });
            } else {
                res.status(400);
                res.error("File not attached to resource parameter. Please try again.");
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.error(e.message);
    }
});

router.post("/:resource", async (req, res) => {
    res.status(405);
    res.error("Method POST not allowed on item " + req.params.resource + ".");
});

router.put("/", async (req, res) => {
    res.status(405);
    res.error("Method PUT not allowed on entire collection.");
});

router.put("/:resource", async (req, res) => {
    try {
        let resource = await models.resources.findOne({_id : req.params.resource});
        if (resource && resource != null) {
            resource = await models.resources.findOneAndUpdate({_id: req.params._id}, {$set: req.body});
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
})

router.delete("/", async (req, res) => {
    res.status(405);
    res.error("Method DELETE not allowed on entire collection.");
});

router.delete("/:resource", async (req, res) => {
    try {
        let resource = await models.resource.findOneAndDelete({_id : req.params.resource});
        res.status(200);
        res.okay(resource);
    } catch(e) {
        res.status(500);
        res.error(e.message);
    }
});

module.exports = router;