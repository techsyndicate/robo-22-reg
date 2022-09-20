const router = require("Express").Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("invite");
});

router.post("/", async (req, res) => {
  const { schName, schEmail, clubName, clubEmail } = req.body;
  if (!schName && !schEmail) {
    return res.status(400).send("Please fill all the fields");
  }
});

module.exports = router;
