const Discord = require("discord.js");
const ffmpeg = require("ffmpeg-binaries");
const opusscript = require("opusscript");
const customisation = require('../customisation.json');

exports.run = (client, message, args) => {
      if (message.member.voiceChannel) {
        message.member.voiceChannel.leave()
        let embed = new Discord.RichEmbed()
        .setDescription('Disconnected.')
        .setColor('#ff9900')
        .setFooter(`© Cryptonix X Mod Bot by ${customisation.ownername}`);
      message.channel.send(embed);
    }else{
        message.channel.send("You are not in a voice channel!")
    }
  };
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
    };
     
exports.help = {
  name: 'disconnect',
  description: 'Disconnect from voice channel',
  usage: 'disconnect'
};