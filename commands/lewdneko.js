const Discord = require('discord.js');
const superagent = require('superagent');
const customisation = require('../customisation.json');

exports.run = async (client, message, args, tools) => {
    const { body } = await superagent
    .get("https://nekos.life/api/lewd/neko");
    if(!message.channel.nsfw) return message.reply("NSFW is not enabled in this channel");
    
    const embed = new Discord.RichEmbed()
    .setColor("#ff9900")
    .setImage(body.neko) 
    .setFooter(`© Cryptonix X Mod Bot by ${customisation.ownername}`);
    message.channel.send({embed})
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'lewdneko',
    description: 'Lewd Nekos',
    usage: 'lewdneko'
  };