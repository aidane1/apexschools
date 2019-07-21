const express = require ('express');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(server_info.keys.encryption_key);

const router = express.Router ();

router.get ('/', async (req, res) => {
  let schools = await models['school'].find ();
  res.render ('login', {schools});
});

router.post ('/', async (req, res) => {
  try {
    let response = await models.account.authenticate (
      req.body.username,
      req.body.password,
      req.body.school
    );
    let apikey = await models.apikey.findOne ({
      reference_account: response._id,
    });
    let encrypted_id = cryptr.encrypt (response._id.toString ());
    res.cookie ('x-api-key', apikey.key, {
      maxAge: 1000 * 3600 * 24 * 365,
    });
    res.cookie ('x-id-key', encrypted_id, {maxAge: 1000 * 3600 * 24 * 365});
    res.cookie ('school', req.body.school, {maxAge: 1000 * 3600 * 24 * 365});
    res.redirect ('/admin');
  } catch (e) {
      console.log(e);
    let schools = await models['school'].find ();
    res.render ('login', {schools});
  }
});

router.put ('/', async (req, res) => {});

router.delete ('/', async (req, res) => {});

module.exports = router;
