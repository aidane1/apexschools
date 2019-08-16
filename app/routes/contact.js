const express = require ('express');

const moment = require ('moment-timezone');

const router = express.Router ();

router.get ('/', async (req, res) => {
  res.render ('contact', {
    notification: false,
    notificationType: 'success',
    notificationTitle: 'Success',
    notificationBody: 'Your inquiry has been recieved. You will get a response within one to two business days',
  });
});

router.post ('/', async (req, res) => {
  try {
    console.log (req.body);

    let mailingList = ['aidan@apexschools.co'];

    mailingList = mailingList.join (', ');

    sendMail (
      'Contact',
      // 'aidaneglin@gmail.com',
      mailingList,
      // '"Apexschools" <announcements@apexschools.co>',
      `${req.body.first} ${req.body.last} sent an inquiry`,
      `${req.body.first} ${req.body.last} (${req.body.email}) on ${moment ()
        .tz ('America/Vancouver')
        .format ('MMMM Do, YYYY hh:mm a')}: \n\n\n ${req.body.subject}`
    );

    // res.redirect ('/contact');
    res.render ('contact', {
      notification: true,
      notificationType: 'success',
      notificationTitle: 'Success',
      notificationBody: 'Your inquiry has been recieved. You will get a response within one to two business days',
    });
  } catch (e) {
    console.log (e);
    res.render ('homePage/inquiries', {
      notification: true,
      notificationType: 'error',
      notificationTitle: 'error',
      notificationBody: 'An error occured. Please try again',
    });
  }
});

router.put ('/', async (req, res) => {});

router.delete ('/', async (req, res) => {});

module.exports = router;
