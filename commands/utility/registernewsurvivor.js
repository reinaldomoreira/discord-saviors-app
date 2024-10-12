const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const {exec} = require('child_process');
const crypto = require('crypto');


const survivorRoleId = '1221553397522632775';
const newPlayerRoleId = '1291957927535710218';

async function getMemberToCreate(interaction) {
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

async function respondInteraction(interaction, message, ephemeral = true) {
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({content: message, ephemeral: ephemeral});
    } else {
        await interaction.reply({content: message, ephemeral: ephemeral});
    }
}

async function rconMessage(message) {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
        const {stdout, stderr} = await exec("/games/rcon/rcon --config /games/Zomboid/Server/rcon.yaml '" + message + "'");
        return {stdout, stderr};
    } catch (err) {
        console.error(err);
    }
}

async function generateRandomPassword() {
    const util = require('util');
    return util.promisify(crypto.randomBytes)(3).then(buffer => {
        return parseInt(buffer.toString('hex'), 16).toString().substring(0, 6);
    });
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('registernewsurvivor')
        .setDescription('add role and create user in game')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply("Você precisa ser administrador para executar esse comando.");
            return;
        }
        const channel = interaction.channel;
        const memberRequestingCreation = await getMemberToCreate(interaction);

        if (memberRequestingCreation === undefined) {
            await interaction.reply('usuário do discord para criar não detectado no canal', {ephemeral: true});
            return;
        }

        if (await addSurvivorRole(memberRequestingCreation)) {
            await channel.send('usuário ' + memberRequestingCreation.user.username + ' adicionado ao cargo de sobrevivente.', {ephemeral: true});
        }

        const message = (await channel.messages.fetch()).last();
        const nicknameRequested = message.embeds[1].fields[0].value;

        await respondInteraction(interaction, 'verificando se existe ' + nicknameRequested + ' no servidor.');

        if (interaction.guild.members.cache.find(member => member.nickname === nicknameRequested)) {
            await respondInteraction(interaction, "usuário " + nicknameRequested + " já existe no servidor do discord, por favor, abra um novo ticket com um novo nick.", false);
            return;
        }

        const password = await generateRandomPassword();

        const result = await rconMessage(`adduser \"${nicknameRequested}\" ${password}`);

        if (result.stdout?.includes("already exists")) {
            await respondInteraction(interaction, "Usuário " + nicknameRequested + " já existe, por favor, abra um novo ticket com um novo nick.", false);
            return;
        }

        if (result.stdout?.includes("Invalid username")) {
            await respondInteraction(interaction, "Usuário " + nicknameRequested + " é inválido, por favor, abra um novo ticket com um novo nick.", false);
            return;
        }

        if (result.stderr?.length > 0) {
            await respondInteraction(interaction, "Um erro desconhecido aconteceu");
            console.error(result.stderr);
            return;
        }

        if (result.stdout?.includes("success") || result.stdout?.includes("created")) {
            await respondInteraction(interaction, "Usuário " + nicknameRequested + " criado no servidor");
            await memberRequestingCreation.setNickname(nicknameRequested);
            await respondInteraction(interaction, 'apelido alterado de ' + memberRequestingCreation.username + ' para ' + nicknameRequested + ' no servidor.');


            await respondInteraction(interaction, 'Usuario enviado via DM, mas caso não chegue, aqui está!\n\nUsuário: ' + nicknameRequested + '\nSenha: ' + password, false);
            try {
                await memberRequestingCreation.send('Seja bem vindo ao servidor Saviors!\n\nUsuário: ' + nicknameRequested + '\nSenha: ' + password);
            } catch (e) {
                console.error(e);
                await respondInteraction(interaction, 'Não foi possível enviar por DM, então, por favor anote sua senha pois você não terá acesso a este ticket depois.', false);
            }
        }
    },
};
