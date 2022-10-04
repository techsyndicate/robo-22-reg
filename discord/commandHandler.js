
const School = require('../models/schoolModel');
const { PermissionsBitField, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SendRegupdateDiscordWebhook } = require("../services/misc");

const InteractionHandler = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'server') {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    } else if (commandName === 'user') {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    } else if (commandName === 'verify') {
        console.log(interaction.channel.name);
        if (interaction.channel.name != "✅unverified-chat") {
            return;
        } else {
            if (userVerified(interaction)) {
                await interaction.reply({ content: 'You are already verified!', ephemeral: true });
            } else {
                let discordCode = interaction.options.getString('code');
                let school = await School.findOne({ discordCode: discordCode });
                if (school) {
                    await giveChannelAcess(interaction, school);
                } else {
                    await interaction.reply({ content: 'Invalid code!', ephemeral: true });
                }
            }
        }
    }
}

async function giveChannelAcess(interaction, school) {
    let role = await interaction.guild.roles.cache.find(role => role.name === 'participant');
    let coreRole = await interaction.guild.roles.cache.find(role => role.name === 'core');
    let lounges = await interaction.guild.channels.cache.find(channel => channel.name == 'lounges');
    school.schoolName = school.schoolName.trim();
    school.schoolName = school.schoolName.replace(/[\s\@.!#$%^&*()_+=:;"'<>,?~]/g, '-');
    school.schoolName = school.schoolName.toLowerCase();
    if (school.schoolName.endsWith('-')) {
        school.schoolName = school.schoolName.slice(0, -1);
    }
    let lounge = await lounges.children.cache.find(channel => channel.name == school.schoolName);
    if (lounge) {
        //add user override to lounge
        await lounge.permissionOverwrites.create(interaction.member, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });
        await interaction.member.roles.add(role);
        SendRegupdateDiscordWebhook(`${interaction.member.user.username} has been verified! for ${school.schoolName}`);
        await interaction.reply({ content: 'You have been verified!', ephemeral: true });
    } else {
        //create lounge
        await interaction.guild.channels.create({
            name: `${school.schoolName}`,
            type: ChannelType.GuildText,
            parent: lounges,
            permissionOverwrites: [
                {
                    id: interaction.member,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: coreRole,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels],
                }
            ],
        });
        SendRegupdateDiscordWebhook(`${interaction.member.user.username} has been verified! for ${school.schoolName}`);
        await interaction.member.roles.add(role);
        await interaction.reply({ content: 'You have been verified!', ephemeral: true });
    }
}

function userVerified(interaction) {
    return interaction.member.roles.cache.some(role => role.name === 'participant');
}

module.exports = { InteractionHandler };