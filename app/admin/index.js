const express = require("express");
const router = express.Router();

router.get("/*", async (req, res) => {
    res.sendFile(abs_path("/react-client/dist/index.html"));
});

module.exports = router;