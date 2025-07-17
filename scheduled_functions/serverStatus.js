const cronHelper = require('../utils/cronHelper');
const serverService = require('../services/serverService');
const {getGameData} = require("../utils/gameData");

const serverStatusChannelId = '1319369975403905104';
const peopleOnlineChannelId = '1319370413842894918';

module.exports = {
    name: 'serverStatus',
    frequency: cronHelper.everyFifteenSecond(),
    execute: async function (client) {
        let serverStatusChannel;
        let peopleOnlineChannel;
        try {
            getGameData()
            peopleOnlineChannel = await client.channels.fetch(peopleOnlineChannelId);
            serverStatusChannel = await client.channels.fetch(serverStatusChannelId);
            const serverStatus = await serverService.serverStatus();
            serverStatusChannel.setName('︱server︱' + serverStatus.status);
            peopleOnlineChannel.setName('︱online agora︱' + serverStatus.playersOnline);
        } catch (e) {
            console.error(`Error while updating server status: ${e}`);
            serverStatusChannel?.setName('︱server︱' + serverService.status.OFFLINE);
            peopleOnlineChannel?.setName('︱online agora︱0');
        }
    },
}
