const Discord = require('discord.js');
const fs = require("fs");
const ms = require("ms");
const customisation = require('../customisation.json');

const mongoose = require('mongoose');

exports.run = async (client, message, args) => {
    mongoose.connect('mongodb://localhost/DiscordDB', { useNewUrlParser: true });
    let reason = args.slice(1).join(' ');
    let user = message.mentions.users.first();
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("❌**Error:** You don't have the **Kick Members** permission!");
    if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.').catch(console.error);
    if (message.mentions.users.first().id === message.author.id) return message.reply('I can\' let you do that, self-harm is bad:facepalm:');
    if (message.mentions.users.first().id === "242263403001937920") return message.reply("You can't warn my Developer:wink:");
    if (reason.length < 1) reason = 'No reason supplied.';
    
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  
const Warn = require('../models/warn.js');
    Warn.findOne({
      userID: message.author.id,
      serverID: message.guild.id,
    }, (err, warn) => {
      if (err) console.error(err);
      if (!warn) {
    const newWarn = new Warn({
        _id: mongoose.Types.ObjectId(),
        serverID: message.guild.id,
        username: user.username,
        userID: user.id,
        reason: reason,
        wUsername: message.author.username,
        wID: message.author.id,
        warnid: makeid(7),
        time: message.createdAt
    });
    newWarn.save()
    .catch(e => console.log(e))
    const embed = new Discord.RichEmbed()
    .setColor(0xFFFF00)
    .setTimestamp()
    .addField('Action:', 'Warning')
    .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('Warned by:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Reason', reason)
    .addField('Warn ID:', newWarn.warnid)
    .addField('Time', message.createdAt)
    .setFooter(`© Cryptonix X Mod Bot by ${customisation.ownername}`);
    let logchannel = message.guild.channels.find(val => val.name === 'logs');
    if  (!logchannel){
      message.channel.send({embed})
    }else{
      message.channel.send({embed})
      client.channels.get(logchannel.id).send({embed});
    }
    if(user.bot) return;
    message.mentions.users.first().send({embed}).catch(e =>{
      if(e) return 
    });
  }else{
    const newWarn = new Warn({
      _id: mongoose.Types.ObjectId(),
      serverID: message.guild.id,
      username: user.username,
      userID: user.id,
      reason: reason,
      wUsername: message.author.username,
      wID: message.author.id,
      warnid: makeid(7),
      time: message.createdAt
  });
    newWarn.save()
    .catch(e => console.log(e))
    const embed = new Discord.RichEmbed()
    .setColor(0xFFFF00)
    .setTimestamp()
    .addField('Action:', 'Warning')
    .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('Warned by:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Reason', reason)
    .addField('Warn ID:', newWarn.warnid)
    .addField('Time', message.createdAt)
    .setFooter(`© Cryptonix X Mod Bot by ${customisation.ownername}`);
    let logchannel = message.guild.channels.find(val => val.name === 'logs');
    if  (!logchannel){
      message.channel.send({embed})
    }else{
      message.channel.send({embed})
      client.channels.get(logchannel.id).send({embed});
    }
    if(user.bot) return;
    message.mentions.users.first().send({embed}).catch(e =>{
      if(e) return 
    });
  }
});

  const cursor = Warn.find({
    userID: message.mentions.users.first().id,
    serverID: message.guild.id,
  })
  cursor.exec(async (err, result) => {
    if (err) {
      console.error(err);
    }
    //console.log(result.length)
    const punishstats = require('../models/punish.js')
    const gpunish = punishstats.findOne({
      guildID: message.guild.id,
  }, async (err, punish) => {
    if(!punish) return console.log("returned")
    if(punish.mutestatus === 'on'){
      if(result.length + 1 >= punish.mute){
        //console.log("muted")
        let user = message.mentions.users.first();
        let muteRole = client.guilds.get(message.guild.id).roles.find(val => val.name === 'Muted');
        if (!muteRole) {
          try {
              muteRole = await message.guild.createRole({
                  name:"Muted",
                  color: "#000000",
                  permissions:[]
              });
      
              message.guild.channels.forEach(async (channel, id) => {
                  await channel.overwritePermissions(muteRole, {
                      SEND_MESSAGES: false,
                      MANAGE_MESSAGES: false,
                      READ_MESSAGES: false,
                      ADD_REACTIONS: false
                  });
              });
          } catch(e) {
              console.log(e.stack);
          }
        }
        if (message.guild.member(user).roles.has(muteRole.id)) {
         return
        } else {
          message.guild.member(user).addRole(muteRole).then(() => {
            let logchannel = message.guild.channels.find(val => val.name === 'logs');
            if(!logchannel){
              message.channel.send("***" + user.username + "***" + ` has been auto-muted for exeeding ${punish.mute} warns`)
            return
          }else{
            message.channel.send("***" + user.username + "***" + ` has been auto-muted for exeeding ${punish.mute} warns`)
            client.channels.get(logchannel.id).send("***" + user.username + "***" + ` has been auto-muted for exeeding ${punish.mute} warns`).catch(console.error);
          }
        })
        }
      }
    }
  })

  const ggpunish = punishstats.findOne({
    guildID: message.guild.id
  }, (err, punish) => {
    if(!punish) return
      if(punish.mutestatus === 'on'){
        if(result.length >= punish.ban){
          let user = message.mentions.users.first()
          if (!message.guild.member(user).bannable) {
            message.channel.send(`:redTick: I cannot ban that member. My role might not be high enough or it's an internal error.`);
            return
          }
          user.ban("AutoBan - User has too many warns").then(() => {
            let logchannel = message.guild.channels.find(val => val.name === 'logs');
            if(!logchannel){
              message.channel.send("***" + user.username + "***" + ` has been auto-banned for exeeding ${punish.ban} warns`)
              return
            }else{
              message.channel.send("***" + user.username + "***" + ` has been auto-banned for exeeding ${punish.ban} warns`)
              client.channels.get(logchannel.id).send(user.username + ` has been auto-banned for exeeding ${punish.ban} warns`).catch(console.error);
            }
            if(user.bot) return;
            return message.mentions.users.first().send(`You have been auto-banned for having ${punish.ban} or more warns!`).catch(e =>{
              if(e) return
            });
          })
        }
      }
    })
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'warn',
  description: 'Issues a warning to the mentioned user.',
  usage: 'warn [mention] [reason]'
};
