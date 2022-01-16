const Discord = require("discord.js");
const client = new Discord.Client();

// Once client logged in, search for all birthdays and send messages
client.once("ready", async () => {
  await require("./src/search-messages-for-birthday")(client);

  client.destroy();
});

client.login(require("./config.json").token);
