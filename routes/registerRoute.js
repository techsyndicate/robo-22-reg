const { SendError } = require("../services/error");
const { renderFile } = require("../services/mail");
const School = require("../models/schoolModel");
const router = require("express").Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Team = require("../models/teamModel");
const { addSchool } = require("../services/sheets");
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

router.get("/team", async (req, res) => {
  let token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        console.log("user not logged in");
        console.log(err);
        return res.render("teamLogin");
      } else {
        let mail = "";
        if (typeof decoded == "object") {
          mail = decoded.userId;
        } else {
          mail = decoded;
        }
        console.log(decoded);
        console.log(mail);
        await School.findOne({ schoolEmail: mail })
          .clone()
          .catch((err) => {
            console.log(err);
            SendError(err);
            let error = "You havent registered yet";
            return res.render("error", { error });
          })
          .then((school) => {
            if (school) {
              let schId = school._id;
              let schName = school.schoolName;
              Team.findOne({ schId })
                .catch((err) => {
                  console.log(err);
                  SendError(err);
                  let error = "You havent registered yet";
                  return res.render("error", { error });
                })
                .then((team) => {
                  if (team) {
                    return res.render("team", { team: team, schId, schName });
                  } else {
                    return res.render("team", { team: null, schId, schName });
                  }
                });
            } else {
              return res.render("teamLogin");
            }
          });
      }
    });
  } else {
    return res.render("teamLogin");
  }
});

router.post("/school", async (req, res) => {
  const school = new School(req.body);

  const token = Math.random().toString(36).substr(2, 16);
  school.discordCode = token;
  let userId = req.body.schoolEmail;

  school.userId = userId;
  await school.save().then(async (doc) => {
    await jwt.sign(userId, process.env.SECRET, (err, token) => {
      if (err) {
        console.log(err);
        SendError(err);

        return res.status(500).send("Some error occurred");
      } else {
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      }
    });
    await addSchool(school);
    // let recievers = school.clubEmail
    //   ? `${school.clubEmail}, ${school.schoolEmail}`
    //   : school.schoolEmail;

    // let mailDetails = {
    //   from: email,
    //   to: recievers,
    //   subject: "Registration for Robotronics 2022",
    //   html: await renderFile("views/registerMail.ejs", {
    //     userId,
    //     pass,
    //     token,
    //   }),
    // };

    // await mailTransporter.sendMail(mailDetails, function (err, data) {
    //   if (err) {
    //     SendError(err);
    //     console.log(err);

    //     return res.status(500).send("Some error occurred");
    //   } else {
    //     console.log("Email sent successfully");
    //     console.log("Registration Successful");
    //     return res.status(200).send({ status: 200, message: "Registered" });
    //   }
    // });
  });
});

router.post("/login", async (req, res) => {
  let { userId, password } = req.body;
  School.findOne({ userId })
    .catch((err) => {
      console.log(err);
      SendError(err);
      let error = "You havent registered yet";
      return res.status(500).send({ status: 500, message: error });
    })
    .then((school) => {
      if (school) {
        if ((school.pass = password)) {
          jwt.sign(userId, process.env.SECRET, (err, token) => {
            if (err) {
              console.log(err);
              SendError(err);
              return res.status(500).send("Some error occurred");
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
    });
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
