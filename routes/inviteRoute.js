const router = require("Express").Router();
const nodemailer = require("nodemailer");
const { SendError } = require("../services/error");
const { renderFile } = require("../services/mail");
const { ValidateEmail } = require("../services/misc");

let email = process.env.GMAIL_USER;
let pass = process.env.GMAIL_PASS;

//start nodemailer
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
  },
});

router.get("/", (req, res) => {
  res.render("invite");
});

router.post("/", async (req, res) => {
  const { schName, schEmails } = req.body;
  if (!schName && !schEmails) {
    return res.status(400).send("Please fill all the fields");
  }

  recievers = schEmails.join(",");
  console.log(recievers);

  let mailDetails = {
    from: email,
    to: recievers,
    subject: "Invite for Robotronics 2022",
    html: await renderFile("views/inviteSuccessfull.ejs", { userId, pass }),
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      SendError(err);
      console.log(err);
      return res.status(500).send("Some error occurred");
    } else {
      console.log("Email sent successfully");
      return res.status(200).send("Invite Sent");
    }
  });

  return res.status(200).send("Invite Sent");
});

module.exports = router;
