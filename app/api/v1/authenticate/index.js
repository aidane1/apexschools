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
        res.error(e);
    }
}); 

router.put("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

module.exports = router;