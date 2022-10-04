const axios = require("axios");
const { WebhookClient } = require("discord.js");

function ValidateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function SendRegupdateDiscordWebhook(message) {
    const Discord = process.env.DISCORD_WEBHOOK_URL;
    const webhook = new WebhookClient({
        url: Discord,
    });
    webhook.send(message).then(() => {
        console.log("Sent message to Discord");
    });
}

module.exports = { ValidateEmail, SendRegupdateDiscordWebhook };
