const express = require ('express');

const router = express.Router ();

router.get ('/', async (req, res) => {});

router.post ('/', async (req, res) => {});

router.put ('/pull/:user', async (req, res) => {
  try {
    if (req.params.user == req.account.reference_id) {
      let user = await models['user'].findOneAndUpdate (
        {_id: req.params.user},
        {
          $pull: {
            unviewed_chatrooms: req.body.key,
          },
        }
      );
      res.okay (user);
    } else {
      res.error ('Permission requirements not met. Please try again.');
    }
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.delete ('/', async (req, res) => {});

module.exports = router;
