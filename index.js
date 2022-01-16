const Cron = require("cron");
const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

// Functions from src
const validateMessage = require("./src/validate-message");
const searchmessagesForBirthday = require("./src/search-messages-for-birthday");

// Give discord the validateMessage callback
client.on("message", validateMessage);

// Give cronjob the searchmessagesForBirthday callback
var job = new Cron.CronJob(
  "10 0 0 * * *",
  () => searchmessagesForBirthday(client),
  null,
  true,
  config.timezone
);

client.login(config.token);
