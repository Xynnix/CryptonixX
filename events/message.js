const Discord = require('discord.js');
const settings = require('../settings.json');
const customisation = require('../customisation.json');
const fs = require("fs");
//const file = require('../mysql.json');
const mongoose = require('mongoose')
const db = require('quick.db')
module.exports = async message => {
  if(message.channel.type === "dm") return;
  if(message.author.bot) return;

  let cd = new Set();
  let cdseconds = 5;
  
  let client = message.client;
  let blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf8"));

  if(message.guild.id === '264445053596991498') return
  //setInterval(() => {
  let channelignore = await db.fetch(`channelignore_${message.guild.id}_${message.channel.id}`);
  if (channelignore){
    if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")){
      if (channelignore === 'on') return
    }
  }
  //},1000);

  if (!blacklist[message.author.id]) { 
    blacklist[message.author.id] = {state: false}};
    if (blacklist[message.author.id].state === true) return;
    
    mongoose.connect('mongodb://localhost:27017/DiscordDB', { useNewUrlParser: true }, err => {
      if (err) return console.error(err);
    });
    const Coins = require('../models/coins.js');
    const Xp = require('../models/xp.js')
    
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) {
      prefix = '/'
    }

function generatecoins(){
  return Math.floor(Math.random() * 15) + 1
}

function generatexp() {
  return Math.floor(Math.random() * (30 - 10 + 1)) + 10
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
if (!message.content.startsWith(prefix)){
  
  if (parseInt(getRandomInt(3)) == 2) {
  Coins.findOne({
    userID: message.author.id,
    serverID: message.guild.id,
  }, (err, coins) => {
    if (err) console.error(err);
    if (!coins) {
        const newCoins = new Coins({
            _id: mongoose.Types.ObjectId(),
            userID: message.author.id,
            serverID: message.guild.id,
            coins: generatecoins(),
        });
      
        newCoins.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
    }else{
        coins.coins = parseInt(coins.coins) + parseInt(generatecoins());
        coins.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
    }
    })
    }else if (parseInt(getRandomInt(3)) == 3) {
      let xpstatus = await db.fetch(`xpstatus_${message.guild.id}`);
      if (xpstatus){
        if (xpstatus === 'on'){
          Xp.findOne({
            userID: message.author.id,
            serverID: message.guild.id,
          }, (err, xp) => {
            if (err) console.error(err);
            if (!xp) {
                const newXp = new Xp({
                    _id: mongoose.Types.ObjectId(),
                    userID: message.author.id,
                    serverID: message.guild.id,
                    level: 1,
                    xp: generatexp(),
                });
              
                newXp.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            }else{
                xp.xp = parseInt(xp.xp) + parseInt(generatexp());
                xp.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
                let nxtLvl = xp.level * 1000 + 1000;
                if(nxtLvl <= xp.xp) {
                  xp.level = parseInt(xp.level) + 1;
                  xp.save()
                  .then(result => console.log(result))
                  .catch(err => console.error(err));
          let embed =  new Discord.RichEmbed()
          .setTitle(`${message.author.username} HAS LEVELED UP!`, ``)
          .setThumbnail(`${message.author.avatarURL}`)
          .setURL(`${message.author.avatarURL}`)
          .setAuthor("LEVEL UP!")
          .setTimestamp()
          .setColor(Math.floor(Math.random()*16777215))
          .addField("XP", xp.xp)
          .addField("Level", xp.level)
          .setFooter(`© Cryptonix X Mod Bot by ${customisation.ownername}`);
          message.channel.send({embed}).then(message => {message.delete(10000)});
                    }
            }
        })
      }
    }
  }
}
let antilink = await db.fetch(`antilink_${message.guild.id}`);
  if (antilink){
    if (antilink === 'on'){
      if(/(?:https?:\/)?discord(?:app.com\/invite|.gg)/gi.test(message.content)){
        if (message.author.id !== settings.ownerid){
          if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")){
            message.delete();
            message.reply(`OI ${message.author.username}, wanna Be Banned BOI? NO INVITE LINKS!`);
            return;
          }
        }
      }
    }
  }
  
  if (!message.content.startsWith(prefix)) return;  
    
    let command = message.content.split(' ')[0].slice(prefix.length);
    let params = message.content.split(' ').slice(1);
    let perms = client.elevation(message);
    let cmd;
    if (client.commands.has(command)) {
      cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
      cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
      if (perms < cmd.conf.permLevel) {
        console.log("Command: /" + cmd.help.name)
        console.log("Guild: " + message.guild.name)
        return;
      }
      //message.react("a:yayyy:497742636439044096")
      cmd.run(client, message, params, perms);
      console.log("Command: /" + cmd.help.name)
      console.log("Guild: " + message.guild.name)
      if (message.author.id !== "242263403001937920"){
        if(cd.has(message.author.id)){
          message.delete();
          return message.reply("This command is for cd for 5 sec")
        }
      cd.add(message.author.id);
      }
    }
     
    setTimeout(() => {
      cd.delete(message.author.id)
    }, cdseconds * 1000)
};