const {SlashCommandBuilder, PermissionsBitField, ChannelType} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with input you have sent!')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo')
                .setMaxLength(2_000)
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the message to')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)),
    async execute(interaction) {
        console.log(interaction);
        let input = interaction.options.getString('input');
        let channel = interaction.options.getChannel('channel');
        if(!channel) {
            channel = interaction.channel;
        }
        await channel.send(input);
    },
};
