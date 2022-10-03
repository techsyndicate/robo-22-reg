const router = require("express").Router();
const {deployCommands}= require("../discord/deploy-commands");

router.get("/", (req, res) => {
    res.render("discord/index");
});
router.get('/deploy-commands', async (req, res) => {
    let resp = await deployCommands("1008409770627182733")
    console.log(resp);
    res.send(resp);
})

module.exports = router;
