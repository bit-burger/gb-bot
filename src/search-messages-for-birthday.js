const config = require("../config.json");

const Discord = require("discord.js");

const { DateTime, Settings } = require("luxon");
Settings.throwOnInvalid = true;
Settings.defaultLocale = config.locale;
Settings.defaultZone = config.timezone;

module.exports = async function (client) {
  const channels = [...client.channels.cache.values()].filter(
    (channel) => channel.isText() && config.get_from.includes(channel.id)
  );
  for (const channel of channels) {
    const messages = await channel.messages.fetch();
    for (const message of messages.values()) {
      try {
        const date = DateTime.fromFormat(message.content, config.date_format);
        const now = DateTime.now();
        if (
          date.month == now.month &&
          date.day == now.day &&
          date.year > 1970 &&
          date.year < 2018
        ) {
          await sendMessages(client, message, date, now.year - date.year);
        }
      } catch (e) {
        console.log(e);
        console.log(
          `Cannot interpret '${message.content}' as '${config.date_format}'`
        );
      }
    }
  }
};

// If somebody is in the recipient list, they should be in all servers
async function sendMessages(client, bdMessage, bdDate, yearsDiff) {
  const bdUser = bdMessage.author;
  const dateString = bdDate.toLocaleString(DateTime.DATE_FULL);
  const embed = new Discord.MessageEmbed();
  const messageLink = `https://discord.com/channels/${bdMessage.guild.id}/${bdMessage.channel.id}/${bdMessage.id}`;
  embed
    .setAuthor(bdUser.tag, bdUser.avatarURL())
    .setThumbnail(bdUser.avatarURL())
    .setTitle(
      `Heute hat ${bdUser.username} seinen/ihren ${yearsDiff}. Geburtstag 🥳🎉🎈`
    )
    .setDescription(
      `Am ${dateString} wurde ${bdUser.username} (${bdMessage.author.tag}) vor ${yearsDiff} Jahren geboren\n\n` +
        `[Das Datum stammt von ${bdUser.tag} selber](${messageLink})`
    );

  for (const recipientUserId of config.send_to) {
    // Don't send messages to bdUser
    // if (bdUser == recipientUserId) return;

    const recipientUser = await client.users.fetch(recipientUserId);
    try {
      await recipientUser.send(embed);
    } catch (e) {
      console.log(`Cannot send '${recipientUser.tag}' messages`);
    }
  }
}
