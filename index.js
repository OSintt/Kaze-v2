const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("Hey!");
});
app.listen(process.env.PORT || 3000);

/* bot */
const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');
const request = require('request');

client.on('ready', () => {
  console.log("Listo!");
  client.user.setPresence({data: {
    name: "hackersquad owo",
    type: "PLAYING"
  }});
});

client.on("message", message => {

  const args = message.content.split(' ').slice(1);

  function wrong(params) {
    let emb = new Discord.MessageEmbed()
      .setDescription(params)
      .setColor("RED");
    message.channel.send(emb);
  }

  if (message.content.startsWith("xget")) {
    if (args.length == 0) return wrong("Olvidaste colocar el webhook!");
    let webhook = args.join(" ");
    request(webhook, function (error, response, body) {
      if (error) return wrong("**Invalid webhook!**```"+ webhook +"```");
      body = JSON.parse(body);
      let emb = new Discord.MessageEmbed()
        .setTitle("Webhook: " + body.name)
        .setThumbnail(body.avatar == null ? "https://revista.weepec.com/wp-content/uploads/2017/03/image.gif" : body.avatar)
        .setDescription(`**Webhook id:** ${body.id}\n**Channel id:** ${body.channel_id}\n**Guild id:** ${body.guild_id}\n\n**Token:** \`\`\`${body.token}\`\`\``)
      message.channel.send(emb);
    });
  }
});

client.login(process.env.token);