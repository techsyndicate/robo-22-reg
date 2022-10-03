const router = require("express").Router();
router.get("/", (req, res) => {
  res.render("index");
});
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).send("Logged out");
});
module.exports = router;
