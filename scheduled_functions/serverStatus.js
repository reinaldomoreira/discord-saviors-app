const {ActivityType} = require('discord.js');
const cronHelper = require('../utils/cronHelper');
const serverService = require('../services/serverService');

const serverStatusChannelId = '1319369975403905104';
const peopleOnlineChannelId = '1319370413842894918';

module.exports = {
    name: 'serverStatus',
    frequency: cronHelper.everyFifteenSecond(),
    execute: async function (client) {

        const peopleOnlineChannel = await client.channels.fetch(peopleOnlineChannelId);
        const serverStatusChannel = await client.channels.fetch(serverStatusChannelId);

        try {
            const serverStatus = await serverService.serverStatus();
            serverStatusChannel.setName('︱server︱' + serverStatus.status);
            peopleOnlineChannel.setName('︱online agora︱' + serverStatus.playersOnline);
        } catch (e) {
            serverStatusChannel.setName('︱server︱' + serverService.status.OFFLINE);
            peopleOnlineChannel.setName('︱online agora︱0');
        }
    },
}
