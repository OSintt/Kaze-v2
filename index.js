const Discord = require('discord.js')
const mongoose = require('mongoose');
const bot = new Client({
    fetchAllMembers: true,
    ws: { properties: { $browser: "Discord Android" } },
    intents: [
        "GUILDS",
        "GUILD_BANS",
        "GUILD_EMOJIS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_PRESENCES",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS",
    ],
});

bot.on("ready", (message) => {
    console.log("Listo para explotarte el culo osint")
    let estados = ["Estados"]
    setInterval(() => {
        function presence() {
            bot.user.setPresence({
                status: "idle",
                activity: {
                    name: estados[
                        Math.floor(Math.random() * estados.length)
                    ],
                    type: "WATCHING",
                },
            });
        }
        presence();
    }, 20000);
});

    bot.on("message", async (message) => {
        let prefix = "..";

        if (message.author.bot) return;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        let cmd = bot.commands.find(
        (c) => c.name === command || (c.alias && c.alias.includes(command))
        );
        if (cmd) {
            cmd.execute(bot, message, args);
        }
    });
  bot.login(process.env.token);
