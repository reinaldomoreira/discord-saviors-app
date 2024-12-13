const {ActivityType} = require('discord.js');
const cronHelper = require('../utils/cronHelper');
const serverService = require('../services/serverService');

const peopleOnlineChannelId = '1302022686091776010';
const serverStatusChannelId = '1302027406244053062';

module.exports = {
    name: 'serverStatus',
    frequency: cronHelper.everyFifteenSecond(),
    execute: async function (client) {

        const peopleOnlineChannel = await client.channels.fetch(peopleOnlineChannelId);
        const serverStatusChannel = await client.channels.fetch(serverStatusChannelId);

        try {
            const serverStatus = await serverService.serverStatus();
            serverStatusChannel.setName('︱server︱' + serverStatus.status);
            peopleOnlineChannel.setName(serverStatus.playersOnline + '︱online agora︱' + serverStatus.playersOnline);
        } catch (e) {
            serverStatusChannel.setName('︱server︱' + serverService.status.OFFLINE);
            peopleOnlineChannel.setName('︱online agora︱0');
        }
    },
}
