const { SendError } = require("../services/error");
const { renderFile } = require("../services/mail");
const School = require("../models/schoolModel");
const router = require("express").Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Team = require("../models/teamModel");
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

  const token = Math.random().toString(36).substr(2, 16);
  school.discordCode = token;
  let userId = req.body.schoolEmail;
  school.userId = userId;
  console.log(school);
  await school.save().then(async (doc) => {
    await jwt.sign({ userId }, process.env.SECRET, (err, token) => {
      if (err) {
        SendError(err);
        console.log(err);
        return res.status(500).send("Some error occurred");
      } else {
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      }
    });

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
        token,
      }),
    };

    await mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        SendError(err);
        console.log(err);
        console.log("mail");
        return res.status(500).send("Some error occurred");
      } else {
        console.log("Email sent successfully");
        console.log("Registration Successful");
        return res.status(200).send({ status: 200, message: "Registered" });
      }
    });
  });
});
router.get("/team", (req, res) => {
  let token = req.cookies.token;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.render("teamLogin");
    } else {
      School.findOne({ userId: decoded.userId }, (err, doc) => {
        if (err) {
          console.log(err);
          SendError(err);
        } else {
          let schId = doc._id;
          let schName = doc.schoolName;
          Team.findOne({ schId }, (err, doc) => {
            if (err) {
              console.log(err);
              SendError(err);
              return res.render("error");
            } else {
              if (doc) {
                return res.render("team", { team: doc, schId, schName });
              } else {
                return res.render("team", { team: null, schId, schName });
              }
            }
          });
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

router.post("/team", async (req, res) => {
  let { schId } = req.body;

  const team = await Team.findOne({ schId });
  if (team) {
    const team = await Team.findOneAndUpdate({ schId }, req.body).catch(
      (err) => {
        console.log(err);
        SendError(err);
        return res.status(500).send("Some error occurred");
      }
    );
    return res.status(200).send({ msg: "Updated" });
  } else {
    const newTeam = new Team(req.body);
    const team = await newTeam.save().catch((err) => {
      console.log(err);
      SendError(err);
      return res.status(500).send("Some error occurred");
    });
    return res.status(200).send({ msg: "Registered" });
  }
});
module.exports = router;
