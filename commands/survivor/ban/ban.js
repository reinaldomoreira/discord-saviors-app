const {PermissionsBitField} = require('discord.js')
const rcon = require('../../../utils/rcon')
const intUtils = require('../../../utils/interactionUtils')

const KEY_NICK = 'nick'
const KEY_STEAM_ID = 'steam_id'
const KEY_DISCORD = 'discord'
const KEY_REASON = 'reason'
const BAN_CHANNEL_ID = '1315183082747461713'

function setUp(command) {
    return command.setName(commandName())
        .setDescription('Bane um sobrevivente.')
        .addStringOption(option =>
            option.setName(KEY_NICK)
                .setDescription('Nome do sobrevivente')
                .setRequired(true))
        .addStringOption(option =>
            option.setName(KEY_STEAM_ID)
                .setDescription('SteamID')
                .setRequired(true))
        .addStringOption(option =>
            option.setName(KEY_REASON)
                .setDescription('Motivo do banimento')
                .setRequired(false))
        .addUserOption(option =>
            option.setName(KEY_DISCORD)
                .setDescription('Usuário do discord')
                .setRequired(false))
}

async function execute(interaction) {
    if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
        await intUtils.respondInteraction(interaction, 'Você precisa ser administrador para executar esse comando.')
        return
    }
    const banChannel = interaction.guild.channels.cache.get(BAN_CHANNEL_ID)
    const nickParam = interaction.options.getString(KEY_NICK)
    const discordParam = interaction.options.getUser(KEY_DISCORD) ?? getDiscordMemberByNick(interaction.guild, nickParam)
    const reason = interaction.options.getString(KEY_REASON) ?? 'Violação das regras'

    if (await banUserInGame(nickParam, reason)) {
        await ibanChannel.send(`Personagem ${nickParam} banido com sucesso. Motivo: ${reason}`)
    } else {
        await intUtils.respondInteraction(interaction, `Erro ao banir personagem ${nickParam}.`, true)
    }

    if (discordParam !== undefined) {
        try {
            await discordParam.ban()
            await banChannel.send(`Usuário do discord ${discordParam.nickname} banido com sucesso. Motivo: ${reason}`)
        } catch (e) {
            await intUtils.respondInteraction(interaction, `Erro ao banir usuário do discord ${discordParam.nickname}. Erro: ${e}`, true)
        }
    } else {
        await intUtils.respondInteraction(interaction, 'Usuário do discord não encontrado.')
    }
}

function getDiscordMemberByNick(guild, nick) {
    return guild.members.cache.find(member => member.nickname === nick)
}

async function banUserInGame(nickParam, reason) {
    const result = await rcon.execute(`banuser \"${nickParam}\" -ip -r \"${reason}\"`)
    console.log(result)
    if (result.stderr?.length > 0) {
        return false
    }
    return result.stdout?.includes('is now banned')
}

function commandName() {
    return 'ban'
}

module.exports = {
    setUp: setUp,
    execute: execute,
    commandName: commandName
}
