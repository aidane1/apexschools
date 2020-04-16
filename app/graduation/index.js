const express = require("express");
const router = express.Router();

router.get("/*", async (req, res) => {
  try {
    res.sendFile(abs_path("/react-client/dist/index.html"));
  } catch (e) {
    res.redirect("/login");
  }
});

module.exports = router;
