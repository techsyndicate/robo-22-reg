const { SendError } = require("../services/error");
const { renderFile } = require("../services/mail");
const School = require("../models/schoolModel");
const router = require("express").Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
  res.render("register");
});

router.post("/school", async (req, res) => {
  const school = new School(req.body);

  await school
    .save()
    .then(async (doc) => {
      let userId = school.schoolEmail;
      let pass = school.pass;

      jwt.sign({ userId }, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          SendError(res, err);
          return res.status(500).send("Some error occurred");
        } else {
          res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
        }
      });
      await School.findByIdAndUpdate(doc._id, { userId, pass });
      let recievers = school.clubEmail
        ? `${school.clubEmail}, ${school.schoolEmail}`
        : school.schoolEmail;

      let mailDetails = {
        from: email,
        to: recievers,
        subject: "Registration for Robotronics 2022",
        html: await renderFile("views/registerMail.ejs", {
          userId,
          pass,
        }),
      };

      await mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          SendError(err);
          console.log(err);
          return res.status(500).send("Some error occurred");
        } else {
          console.log("Email sent successfully");
          return res.status(200).send({ msg: "success" });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ status: 500 });

      console.log(err);
      SendError(err);
    });
});
router.get("/team", (req, res) => {
  let token = req.cookies.token;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.render("teamLogin");
    } else {
      School.findOne({ userId: decoded }, (err, doc) => {
        if (err) {
          console.log(err);
          SendError(err);
        } else {
          return res.render("team", { school: doc });
        }
      });
    }
  });
});
router.post("/login", async (req, res) => {
  let { userId, password } = req.body;

  await School.findOne({ userId }, async (err, doc) => {
    if (err) {
      console.log(err);
      return SendError(err);
    } else {
      if (doc) {
        if ((doc.pass = password)) {
          jwt.sign(userId, process.env.SECRET, (err, token) => {
            if (err) {
              console.log(err);
              return SendError(err);
            } else {
              res.cookie("token", token);
              return res.status(200).json({ msg: "success" });
            }
          });
        } else {
          return res.status(400).json({ msg: "Invalid Password" });
        }
      } else {
        return res.status(400).json({ msg: "Invalid User ID" });
      }
    }
  }).clone();
});
module.exports = router;
