const Discord = require('discord.js');

exports.run =  (client, message, args) => {
  message.delete();
  message.channel.send("<a:plantjerk:497742632714502155>")
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["pj"],
    permLevel: 0
  };
  
  exports.help = {
    name: 'plantjerk',
    description: 'Jerking an Eggplant.',
    usage: 'plantjerk'
  };
  //https://cdn.discordapp.com/emojis/420759985509629962.gif?v=1 
  //https://cdn.discordapp.com/emojis/420759985320886272.gif?v=1 
  //https://cdn.discordapp.com/emojis/420759985836916739.gif?v=1 
  //https://cdn.discordapp.com/emojis/420759985904156682.gif?v=1