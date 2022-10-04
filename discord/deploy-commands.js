require('dotenv').config();
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('verify').setDescription('verifies user and gives the participant role!').addStringOption(option => option.setName('code').setDescription('The code to verify with').setRequired(true)),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

function deployCommands(guildId) {
    return rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId.toString()), { body: commands })
        .then(() => { return ('Successfully registered application commands.') })
        .catch((err) => { return err });
}
module.exports = { deployCommands };
