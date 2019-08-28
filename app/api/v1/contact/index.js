const express = require ('express');
const router = express.Router ();

router.post ('/', async (req, res) => {
  try {
    sendMail (
      'Feedback',
      // 'aidaneglin@gmail.com',
      'aidaneglin@gmail.com',
      // '"Apexschools" <announcements@apexschools.co>',
      `Feedback from ${req.account.username}`,
      `${req.body.text}`
    );
    res.ok ('Sent successfully!');
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

module.exports = router;