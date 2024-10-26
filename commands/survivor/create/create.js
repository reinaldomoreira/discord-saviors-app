const {PermissionsBitField} = require('discord.js');
const crypto = require('crypto');
const intUtils = require('../../../utils/interactionUtils');
const rcon = require('../../../utils/rcon');

const survivorRoleId = '1221553397522632775';
// const newPlayerRoleId = '1291957927535710218';

const KEY_NICK = 'nick';
const KEY_PASSWD = 'senha';
const KEY_DISCORD = 'discord';

function setUp(command) {
    return command.setName('create')
        .setDescription('Cria um sobrevivente.')
        .addStringOption(option =>
            option.setName(KEY_NICK)
                .setDescription('Nome do sobrevivente')
                .setRequired(false))
        .addStringOption(option =>
            option.setName(KEY_PASSWD)
                .setDescription('Senha do sobrevivente')
                .setRequired(false))
        .addUserOption(option =>
            option.setName(KEY_DISCORD)
                .setDescription('Usuário do discord')
                .setRequired(false))
}

async function execute(interaction) {
    if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
        await interaction.reply("Você precisa ser administrador para executar esse comando.");
        return;
    }


    const channel = interaction.channel;
    const memberRequestingCreation = await getMemberToCreate(interaction);

    if (memberRequestingCreation === undefined) {
        await intUtils.respondInteraction(interaction, 'usuário do discord para criar não detectado no canal');
        return;
    }

    if (await addSurvivorRole(memberRequestingCreation)) {
        await intUtils.respondInteraction(interaction, 'usuário ' + memberRequestingCreation.user.username + ' adicionado ao cargo de sobrevivente.');
    }

    const message = (await channel.messages.fetch()).last();
    const nicknameRequested = interaction.options.getString('nick') ?? message.embeds[1].fields[0].value;

    await intUtils.respondInteraction(interaction, 'verificando se existe ' + nicknameRequested + ' no servidor.');

    if (interaction.guild.members.cache.find(member => member.nickname === nicknameRequested)) {
        await intUtils.respondInteraction(interaction, "usuário " + nicknameRequested + " já existe no servidor do discord, por favor, abra um novo ticket com um novo nick.", false);
        return;
    }

    const password = interaction.options.getString('senha') ?? await generateRandomPassword();

    const result = await rcon.message(`adduser \"${nicknameRequested}\" ${password}`);

    if (result.stdout?.includes("already exists") || result.stdout?.includes("Invalid username")) {
        await intUtils.respondInteraction(interaction, "Usuário " + nicknameRequested + " já existe, por favor, abra um novo ticket com um novo nick.", false);
        return;
    }

    if (result.stderr?.length > 0) {
        await intUtils.respondInteraction(interaction, "Um erro desconhecido aconteceu");
        console.error(result.stderr);
        return;
    }

    if (result.stdout?.includes("success") || result.stdout?.includes("created")) {
        await intUtils.respondInteraction(interaction, "Usuário " + nicknameRequested + " criado no servidor");
        await memberRequestingCreation.setNickname(nicknameRequested);
        await intUtils.respondInteraction(interaction, 'apelido alterado de ' + memberRequestingCreation.user?.username + ' para ' + nicknameRequested + ' no servidor.');


        try {
            await memberRequestingCreation.send('Seja bem vindo ao servidor Saviors!\n\nUsuário: ' + nicknameRequested + '\nSenha: ' + password);
        } catch (e) {
            console.error(e);
            await intUtils.respondInteraction(interaction, 'Não foi possível enviar por DM, então, por favor anote sua senha pois você não terá acesso a este ticket depois.\n\nUsuário: ' + nicknameRequested + '\nSenha: ' + password, false);
        }
    }
}

module.exports = {
    setUp: setUp,
    execute: execute
};

async function getMemberToCreate(interaction) {
    const user = interaction.options.getUser(KEY_DISCORD);

    if(user !== null) {
        return interaction.guild.members.cache.find(member => member.user.id === user.id);
    }

    const members = interaction.channel.members;

    return members.find(member => member.user.bot === false
        && interaction.channel.name.includes(member.user.username));
}

async function addSurvivorRole(member) {
    if (member.roles.cache.has(survivorRoleId)) {
        return false;
    }
    await member.roles.add(survivorRoleId);
}

async function generateRandomPassword() {
    const util = require('util');
    return util.promisify(crypto.randomBytes)(4).then(buffer => {
        return parseInt(buffer.toString('hex'), 16).toString().substring(0, 8);
    });
}
