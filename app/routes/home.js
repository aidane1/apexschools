const express = require ('express');

const router = express.Router ();

router.get ('/', async (req, res) => {
  res.render ('home');
  // res.redirect ('/contact');
});

router.get ('/*', async (req, res) => {
  res.redirect ('/contact');
});

router.post ('/', async (req, res) => {});

router.put ('/', async (req, res) => {});

router.delete ('/', async (req, res) => {});

module.exports = router;
