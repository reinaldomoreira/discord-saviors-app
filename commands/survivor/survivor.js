const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const createCmd = require('./create/create');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('survivor')
        .setDescription('Comandos para gerenciar sobrevivente.')
        .addSubcommand(subcommand => createCmd.setUp(subcommand))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    execute: async function (interaction) {
        if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply("Você precisa ser administrador para executar esse comando.");
            return;
        }

        if (interaction.options.getSubcommand() === 'create') {
            return createCmd.execute(interaction);
        }
    }
};
