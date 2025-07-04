const { Events, ChannelType } = require('discord.js')

module.exports = {
  name: Events.ChannelCreate,
  execute: async function (channel) {
    if (channel.type === ChannelType.GuildText) {
      console.log(`Text channel created: ${channel.name}`)
      if (channel.name.includes('ticket-acesso-')) {
        await require('../functions/onAccessTicketCreated').execute(channel)
      }
    }
  }
}
