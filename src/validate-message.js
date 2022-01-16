const config = require("../config.json");

module.exports = function (message) {
  if (!config.get_from.includes(message.channel.id)) return;

  // Check if has birthday
};
