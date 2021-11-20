const router = require("express").Router();

router.get("/ping", (req, res) => {
  return res.status(200).json({ success: true, data: 'pong'})
})

module.exports = router;
