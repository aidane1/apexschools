const express = require ('express');
const router = express.Router ();

router.get ('/', async (req, res) => {
  try {
    if (req.account.permission_level >= 3) {
      let notifications = await models['notification'].find ({
        school: req.account.school,
      });
      notifications = notifications.sort ((a, b) => {
        a.date.getTime () > b.date.getTime () ? 1 : -1;
      });
      res.okay (notifications);
    } else {
      res.error ('Permission requirements not met. Please try again.');
    }
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.post ('/', async (req, res) => {
  try {
    if (req.account.permission_level >= 3) {
      let notification = await models['notification'].create (req.body);
      global.dispatchAction ('message', notification);
      res.okay (notification);
    } else {
      res.error ('Permission requirements not met. Please try again.');
    }
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

module.exports = router;
