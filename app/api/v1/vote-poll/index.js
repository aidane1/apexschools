const express = require ('express');
const router = express.Router ();

router.post ('/:resource', async (req, res) => {
  try {
    let resource = await models['poll'].findById (req.params.resource);

    if (
      resource &&
      resource !== null &&
      resource.options.indexOf (req.body.vote) >= 0
    ) {
      resource = await models['poll'].findOneAndUpdate (
        {_id: resource._id},
        {$pull: {votes: {user: req.account.reference_id}}},
        {new: true}
      );
      resource = await models['poll'].findOneAndUpdate (
        {_id: resource._id},
        {
          $push: {
            votes: {
              user: req.account.reference_id,
              vote: req.body.vote,
            },
          },
        },
        {new: true}
      );
      res.okay (resource);
    } else {
      res.status (404);
      res.error ('Error poll or option not found');
    }
  } catch (e) {
    console.log (e);
    res.status (500);
    res.error (e.message);
  }
});

module.exports = router;
