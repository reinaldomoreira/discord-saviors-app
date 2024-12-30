const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')
const createCmd = require('./create/create')
const banCmd = require('./ban/ban')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('survivor')
    .setDescription('Comandos para gerenciar sobrevivente.')
    .addSubcommand(subcommand => createCmd.setUp(subcommand))
    .addSubcommand(subcommand => banCmd.setUp(subcommand))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  execute: async function (interaction) {
    if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
      await interaction.reply('Você precisa ser administrador para executar esse comando.')
      return
    }

    const commands = {}
    commands[createCmd.commandName()] = createCmd.execute
    commands[banCmd.commandName()] = banCmd.execute

    if (commands[interaction.options.getSubcommand()] !== undefined) {
      return commands[interaction.options.getSubcommand()](interaction)
    } else {
      interaction.reply('Comando não encontrado.')
    }
  }
}
