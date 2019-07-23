const express = require ('express');
const router = express.Router ();

router.get ('/:collection/:resource', async (req, res) => {
  try {
    let reportableResources = ['assignments', 'notes', 'posts', 'comments'];
    if (reportableResources.indexOf (req.params.collection) >= 0) {
      let resource = await pluralModels[
        req.params.collection
      ].findOneAndUpdate (
        {_id: req.params.resource},
        {
          $pull: {
            reports: req.account.reference_id,
          },
        }
      );
      resource = await pluralModels[req.params.collection].findOneAndUpdate (
        {_id: req.params.resource},
        {$push: {reports: req.account.reference_id}}
      );
      resource = await pluralModels[req.params.collection]
        .findById (resource._id)
        .populate ('resources');
      if (resource.reports.length >= 7) {
        await pluralModels[req.params.collection].findOneAndDelete({_id : resource._id});
        res.okay({deleted: true, message: "Resource successfully deleted!"})
      } else {
        res.okay({deleted: false, message: "Resource successfully reported!"});
      }
    } else {
      res.status (404);
      res.error ('Voteable collection not found. Please try again.');
    }
  } catch (e) {
    console.log (e);
    res.status (500);
    res.error (e.message);
  }
});

module.exports = router;
