const { SendError } = require("../services/error");
const School = require("../models/schoolModel");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/school", async (req, res) => {
  console.log(req.body);
  const school = new School(req.body);
  console.log(school);
  await school
    .save()
    .then(() => {
      res.status(200).json({ status: 200 });
    })
    .catch((err) => {
      res.status(500).json({ status: 500 });

      console.log(err);
      SendError(err);
    });
});

module.exports = router;
