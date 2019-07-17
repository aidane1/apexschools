const express = require ('express');
const router = express.Router ();

router.get ('/:collection/:resource', async (req, res) => {
  try {
    let voteableResources = ['assignments', 'notes', 'questions'];
    if (voteableResources.indexOf (req.params.collection) >= 0) {
      let resource = await pluralModels[
        req.params.collection
      ].findOneAndUpdate (
        {_id: req.params.resource},
        {
          $pull: {
            helpful_votes: req.account.reference_id,
            unhelpful_votes: req.account.reference_id,
          },
        }
      );
      if (req.query.vote == 'helpful') {
        resource = await pluralModels[req.params.collection].findOneAndUpdate (
          {_id: req.params.resource},
          {$push: {helpful_votes: req.account.reference_id}}
        );
      } else {
        resource = await pluralModels[req.params.collection].findOneAndUpdate (
          {_id: req.params.resource},
          {$push: {unhelpful_votes: req.account.reference_id}}
        );
      }
      resource = await pluralModels[req.params.collection].findById(resource._id).populate("resources");
      res.okay (resource);
    } else {
      res.status (404);
      res.error ('Voteable collection not found. Please try again.');
    }
  } catch (e) {
      console.log(e);
    res.status (500);
    res.error (e.message);
  }
});

module.exports = router;
