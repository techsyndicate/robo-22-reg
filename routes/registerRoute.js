const { SendError } = require("../services/error");
const { renderFile } = require("../services/mail");
const School = require("../models/schoolModel");
const router = require("express").Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Team = require("../models/teamModel");
const json2csv = require("json2csv");
const { ValidateEmail, SendRegupdateDiscordWebhook } = require("../services/misc");

// const { addSchool } = require("../services/sheets");
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
              let code = school.discordCode;
              Team.findOne({ schId })
                .catch((err) => {
                  console.log(err);
                  SendError(err);
                  let error = "You havent registered yet";
                  return res.render("error", { error });
                })
                .then((team) => {
                  if (team) {
                    return res.render("team", {
                      team: team,
                      schId,
                      schName,
                      code,
                    });
                  } else {
                    return res.render("team", {
                      team: null,
                      schId,
                      schName,
                      code,
                    });
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
  console.log(req.body);
  SendRegupdateDiscordWebhook(JSON.stringify(req.body).replace(/,/g, "\n"));
  res.status(404);
  console.log(req.body);
  if (
    !req.body.schoolName ||
    !req.body.schoolAddress ||
    !req.body.schoolEmail ||
    !req.body.teacherName ||
    !req.body.teacherEmail ||
    !req.body.teacherPhone ||
    !req.body.studentName ||
    !req.body.studentEmail ||
    !req.body.studentPhone ||
    !req.body.pass
  ) {
    console.log("missing fied");
    return res.send({ msg: "Please fill all the required fields" });
  } else if (
    !ValidateEmail(req.body.schoolEmail) ||
    !ValidateEmail(req.body.teacherEmail) ||
    !ValidateEmail(req.body.studentEmail)
  ) {
    console.log("invalid field");
    return res.send({ msg: "Invalid School, Teacher or Student Email" });
  } else if (
    req.body.studentPhone.length < 10 ||
    req.body.teacherPhone.length < 10 ||
    req.body.studentPhone.length > 13 ||
    req.body.teacherPhone.length > 13
  ) {
    console.log("invalid phone");
    return res.send({ msg: "Invalid Phone Number" });
  }

  if (req.body.clubEmail) {
    if (!ValidateEmail(req.body.clubEmail)) {
      return res.send({ msg: "Invalid Club Email" });
    }
  }

  const school = new School(req.body);
  const token = Math.random().toString(36).substr(2, 16);
  school.discordCode = token;
  let userId = req.body.schoolEmail;
  let spass = school.pass;
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

    let recievers = school.clubEmail
      ? `${school.clubEmail}, ${school.schoolEmail}`
      : school.schoolEmail;

    let mailDetails = {
      from: email,
      to: recievers,
      subject: "Registration for Robotronics 2022",
      html: await renderFile("views/registerMail.ejs", {
        userId,
        pass: spass,
        token,
      }),
    };

    await mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        SendError(err);
        console.log(err);

        return res.status(500).send("Some error occurred");
      } else {
        console.log("Email sent successfully");
        console.log("Registration Successful");
        return res.status(200).send({ status: 200, msg: "Registered" });
      }
    });
  });
});

router.post("/login", async (req, res) => {
  let { userId, password } = req.body;
  School.findOne({ userId })
    .catch((err) => {
      console.log(err);
      SendError(err);
      let error = "You havent registered yet";
      return res.send({ msg: error });
    })
    .then((school) => {
      if (school) {
        if (school.pass == password) {
          jwt.sign(userId, process.env.SECRET, (err, token) => {
            if (err) {
              console.log(err);
              SendError(err);
              return res.send("Some error occurred");
            } else {
              res.cookie("token", token);
              return res.status(200).send({ msg: "success" });
            }
          });
        } else {
          return res.send({ msg: "Invalid Password" });
        }
      } else {
        return res.send({ msg: "Invalid User ID" });
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

router.get('/admin', async (req, res) => {
  let { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        SendError(err);
        return res.redirect('/register/team')
      } else {
        School.findOne({ userId: decoded })
          .then((school) => {
            if (school.admin) {
              return res.render('admin', { school })
            } else {
              return res.redirect('/register/team')
            }
          });
      }
    });
  } else {
    return res.redirect('/register/team')
  }
})

router.get('/admin/csv', async (req, res) => {
  let { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        SendError(err);
        return res.redirect('/register/team')
      } else {
        School.findOne({ userId: decoded })
          .then( async (school) => {
            if (school.admin) {
              const schools = await School.find();
              const teams = await Team.find();
              let data = [];
              for (let i = 0; i < schools.length; i++) {
                let school = schools[i]._doc;
                let team = teams.find(team => team.schId == school._id);
                school = JSON.parse(JSON.stringify(school));
                delete school._id;
                delete school.__v;
                if (team) {
                  team = team._doc;
                  team = JSON.parse(JSON.stringify(team));
                  delete team.schId;
                  delete team._id;
                  delete team.__v;
                  data.push({
                    ...school,
                    ...team
                  })
                }
                else {
                  data.push({ ...school });
                }
              }
              console.log(data);
              const csv = json2csv.parse(data);
              res.setHeader('Content-Type', 'text/csv');
              res.setHeader('Content-Disposition', 'attachment; filename="robotronics.csv"');
              res.status(200).send(csv);
            } else {
              return res.redirect('/register/team')
            }
          });
      }
    });
  } else {
    return res.redirect('/register/team')
  }

})

module.exports = router;
