const express = require ('express');

const router = express.Router ();

router.get ('/', async (req, res) => {});

router.post ('/', async (req, res) => {});

router.put ('/pull/:user', async (req, res) => {
  try {
    let user = await models['user'].findOneAndUpdate (
      {_id: req.params.user},
      {
        $pull: {
          unviewed_chatrooms: req.body.key,
        },
      }
    );
    res.okay(user);
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.delete ('/', async (req, res) => {});

module.exports = router;
