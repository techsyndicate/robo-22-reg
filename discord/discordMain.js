
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { InteractionHandler } = require('./commandHandler');

//discord
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('rateLimit', (info) => {
    console.log(info);
});

client.on('interactionCreate', async interaction => {
    await InteractionHandler(interaction);
});

function discord() {
    client.login(process.env.DISCORD_TOKEN);
}

module.exports = {discord};