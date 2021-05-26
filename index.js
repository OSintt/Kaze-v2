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
const axios = require('axios');

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
	function sleep(ms) {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		});
	}  
  /* webhook info command */
  if (message.content.startsWith("xget")) {
    if (args.length == 0) return wrong("No webhook!");
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

  /* webhook bombing command */
  if (message.content.startsWith("xspam")) {
    if (args.length == 0) return wrong("No webhook!");
    let data = []; // here webhook's data will be pushed
    let webhook = args.join(" ");
    data.push(webhook);

    let filter = m => m.author.id === message.author.id;
    let info = {max: 1, time: 30000, errors: ['time']};
    message.channel.send("Enter webhook's name")
    .then(() => {
      message.channel.awaitMessages(filter, info)
      .then(message => {
        message = message.first();
        data.push(message.content); //pushing the webhook's name
        message.channel.send("Enter the message to spam")
        .then(() => {
          message.channel.awaitMessages(filter, info)
          .then(message => {
            message = message.first();
            data.push(message.content); //pushing the message to be spammed
            message.channel.send("Enter the number of messages to be spammed")
            .then(() => {
              message.channel.awaitMessages(filter, info)
              .then(message => {
                message = message.first();
                if (isNaN(message.content)) return wrong("This parameter must be of type `int`!");
                let parsedMessage = parseInt(message);
                if (parsedMessage > 500) return wrong("Please, enter a quantity smaller than `500`")
                if (parsedMessage < 1) return wrong("Plase, enter a quantityt bigger than `0`");
                data.push(parsedMessage); //pushing the number of messages to be spammed
                message.channel.send("Do you want the message parameter to be sended disordered? [y/N]")
                .then(() => {
                  message.channel.awaitMessages(filter, info)
                  .then(async message => {
                    message = message.first();
                    if (message.content == "y" || message.content == "Y") {
                      data.push(true); //pushing the last parameter
                    } else {
                      data.push(false); //pushing the last parameter
                    }
                    /* 
                    data[0] = webhook's uri
                    data[1] = webhook's name
                    data[2] = spammed message
                    data[3] = number of spammed messages
                    data[4] = last boolean
                    */
                    const options = {
                      username: data[1],
                      content: data[2],
                      avatar_url: "https://pm1.narvii.com/6582/bfa6c1c1ec1e1c29e2e6a14db2d55aa8183f9f0c_hq.jpg" 
                    };                                        
                    /* spam loop */
                    for (let x = 1; x < data[3]; x++) {
                      if (data[4] == true) {
                        let c = data[2];
                        let c2 = c.split(' ');
                        let newContent = c2.sort(function(a, b) {
                          return (Math.random()-0.5);
                        });
                        options.content = newContent.join(" ");
                      }
                      axios.post(data[0], options)
                        .catch(error => console.log("Axios err: " + error));
                      message.channel.send("Sended " + x + " messages")
                      await sleep(1000);
                    };
                    wrong("Spam successfully ended")
                  }); 
                });
              });
            });
          });
        });
      });
    })
    .catch(e => {
      message.channel.send(e);
    }); 
  }
});

client.login(process.env.token);