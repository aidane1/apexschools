const express = require("express");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(server_info.keys.encryption_key);

const router = express.Router();

router.get("/", async (req, res) => {
    res.status(404).send({error: "not allowed"});
});


router.post("/", async (req, res) => {
    try {
        let response = await models.account.authenticate(req.body.username, req.body.password, req.body.school);
        let apikey = await models.apikey.findOne({reference_account: response._id});
        response.api_key = apikey.key;
        let encrypted_id = cryptr.encrypt(response._id.toString());
        response._id = encrypted_id;
        res.send({
            status: "ok",
            body: {
                _id: encrypted_id,
                api_key: apikey.key,
                username: response.username,
                school: response.school,
            }
        });
    } catch(e) {
        console.log(e);
        try {
            let schoolAccount = await models.account.authenticateSchool(req.body.username, req.body.password, req.body.school);
            let user = await models.user.create(schoolAccount);
            req.body.reference_id = user._id;
            req.body.account_type = "user";
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
        } catch(e) {
            res.error(e);
        }
    }
}); 

router.put("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

module.exports = router;