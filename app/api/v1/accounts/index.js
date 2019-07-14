const express = require("express");
const router = express.Router();
const Cryptr = require('cryptr');
const cryptr = new Cryptr(server_info.keys.encryption_key);

router.get("/", async (req, res) => {
    res.send({path: "accounts"});
});

router.post("/", async (req, res) => {
    try {
        let copy = await models.account.findOne({$and: [{username: req.body.username}, {school: req.body.school}]});
        if (!copy || copy == null) {
            req.body.password = req.body.password.toString();
            if (req.body.account_type == "user") {
                let id = mongoose.Types.ObjectId();
                let user = await models.user.create({school: req.body.school, reference_id: id});
                req.body.reference_id = user._id;
                req.body._id = id;
                let account = await models.account.create(req.body);
                account = JSON.parse(JSON.stringify(account));
                let apikey = await models.apikey.findOne({reference_account: account._id});
                account.api_key = apikey.key;
                let encrypted_id = cryptr.encrypt(account._id.toString());
                account._id = encrypted_id;
                req.session.accountID = account._id;
                res.okay({
                    _id: encrypted_id,
                    api_key: apikey.key,
                    username: account.username,
                    school: account.school,
                })
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
