const express = require ('express');
const router = express.Router ();

router.get ('/*', async (req, res) => {
  try {
    let headers = req.headers;
    let cookies = req.cookies;
    // console.log (cookies);
    let apikey = headers['x-api-key'] || cookies['x-api-key'];
    let accountID = headers['x-id-key'] || cookies['x-id-key'];

    if (apikey) {
      if (accountID) {
        let {account, key} = await models.apikey.authenticate (
          accountID,
          apikey
        );
        if (account.permission_level >= 3) {
          res.sendFile (abs_path ('/react-client/dist/index.html'));
        }
      } else {
        res.redirect ('/login');
      }
    } else {
      res.redirect ('/login');
    }
  } catch (e) {
    res.redirect ('/login');
  }
});

module.exports = router;
