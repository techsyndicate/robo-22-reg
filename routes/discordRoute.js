const router = require("express").Router();
const {deployCommands}= require("../discord/deploy-commands");
const jwt = require("jsonwebtoken");
const School = require("../models/schoolModel");

router.get("/", (req, res) => {
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
                            return res.render("discord/index");
                        } else {
                            return res.redirect('/register/team')
                        }
                    });
            }
        });
    } else {
        return res.redirect('/register/team')
    }

});

router.get('/deploy-commands', async (req, res) => {
    let { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                SendError(err);
                return res.redirect('/register/team')
            } else {
                School.findOne({ userId: decoded })
                    .then(async(school) => {
                        if (school.admin) {
                            let resp = await deployCommands("1008409770627182733")
                            console.log(resp);
                            res.send(resp);
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
