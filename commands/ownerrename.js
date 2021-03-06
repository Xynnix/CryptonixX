const Discord = require('discord.js');
const fs = require("fs");
const ms = require("ms");

const settings = require('../settings.json');
const customisation = require('../customisation.json');
exports.run = (client, message, args) => {
  if(message.author.id !== settings.ownerid) return message.channel.send(`${message.author}, ${customisation.ownercmdfailtext}`);
    let newname = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  //if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.reply("❌**Error:** You don't have the **Manage Messages** permission!");
  if (!user) return message.reply('You must Tag someone for me to rename them.').catch(console.error);
  if (user.id === "242263403001937920") return message.reply("You can't rename my Developer:wink:");
  //if (user === message.author.id) return message.reply('I can\' let you do that, self-harm is bad:facepalm:');
  message.guild.member(user).setNickname(newname).catch(console.error);
  message.channel.send("Done.");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ownerrename',
  description: 'Rename the mentioned user.',
  usage: 'ownerrename @user newname'
};
