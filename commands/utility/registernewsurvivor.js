const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const {exec} = require('child_process');

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
        const {stdout, stderr} = await exec("/games/rcon/rcon --config /games/Zomboid/Server/rcon.yaml ${message}");
        return {stdout, stderr};
    } catch (err) {
        console.error(err);
    }
}

async function generateRandomPassword() {
    crypto = require('crypto');
    crypto.randomBytes(3, function (err, buffer) {
        console.log(parseInt(buffer.toString('hex'), 16).toString().substring(0, 6));
    });
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('registernewsurvivor')
        .setDescription('add role and create user in game')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply("You must be an administrator to perform this action.");
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
            await respondInteraction(interaction, "usuário" + nicknameRequested + " já existe no servidor", false);
            return;
        }

        // await memberRequestingCreation.setNickname(nicknameRequested);
        // await respondInteraction(interaction, 'apelido definido de ' + memberRequestingCreation.username + ' para ' + nicknameRequested + ' no servidor.');

        const password = generateRandomPassword();

        const result = rconMessage(`adduser ${nicknameRequested} ${password}`);
        if(result.stdout.includes("created")) {
            await respondInteraction(interaction, "Usuário " + nicknameRequested + " criado no servidor");
        }

        if(result.stdout.includes("already exists")) {
            await respondInteraction(interaction, "Usuário " + nicknameRequested + " já existe, por favor, abra um novo ticket com um novo nick.", false);
        }

        if(result.stdout.includes("Invalid username")) {
            await respondInteraction(interaction, "Usuário " + nicknameRequested + " é inválido, por favor, abra um novo ticket com um novo nick.", false);
        }

        if(result.stderr?.length > 0) {
            await respondInteraction(interaction, "Um erro desconhecido aconteceu");
            console.error(result.stderr);
            return;
        }


        await respondInteraction(interaction, 'Usuario enviado via DM, mas caso não chegue, aqui está!\n\nSeu usuário: ' + nicknameRequested + '\nSenha: ' + password, false);
        memberRequestingCreation.send('Seja bem vindo ao servidor!\n\nSeu usuário: ' + nicknameRequested + '\nSenha: ' + password);
    },
};
