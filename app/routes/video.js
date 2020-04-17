const express = require ('express');

const router = express.Router ();

router.get ('/', async (req, res) => {
  res.download(abs_path("/public/videos/output.mp4"))
});

router.post ('/', async (req, res) => {});

router.put ('/', async (req, res) => {});

router.delete ('/', async (req, res) => {});

module.exports = router;
