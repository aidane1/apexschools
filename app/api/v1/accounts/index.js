const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.send({path: "accounts"});
});

router.post("/", async (req, res) => {
    try {
        let copy = await models.account.findOne({$and: [{username: req.body.username}, {school: req.body.school}]});
        if (!copy || copy == null) {
            req.body.password = req.body.password.toString();
            if (req.body.account_type == "user") {
                let user = await models.user.create({});
                req.body.reference_id = user._id;
                let account = await models.account.create(req.body);
                req.session.accountID = account._id;
                res.send({
                    status: "ok",
                    body: account,
                });
            } else {
                res.error("Users can only create users");
            }
        } else {
            res.error("Usernames must be unique");
        }
    } catch (e) {
        console.log(e);
        res.error(e);
    }
}); 

router.put("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

module.exports = router;
