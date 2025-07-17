const cronHelper = require('../utils/cronHelper');
const serverService = require('../services/serverService');
const {getGameData} = require("../utils/gameData");

const serverStatusChannelId = '1319369975403905104';
const peopleOnlineChannelId = '1319370413842894918';
const timeChannelId= '1395533506758578246';

module.exports = {
    name: 'serverStatus',
    frequency: cronHelper.everyFifteenSecond(),
    execute: async function (client) {
        let serverStatusChannel;
        let peopleOnlineChannel;
        try {
            const gameData = getGameData()
            const serverStatus = await serverService.serverStatus();

            peopleOnlineChannel = await client.channels.fetch(peopleOnlineChannelId);
            serverStatusChannel = await client.channels.fetch(serverStatusChannelId);
            const timeChannel = await client.channels.fetch(timeChannelId);
            serverStatusChannel?.setName('︱server︱' + serverStatus?.status ?? serverService.status.OFFLINE);

            if(serverStatus.status === serverService.status.OFFLINE) {
                peopleOnlineChannel?.setName('︱online agora︱' + 0);
            }
            peopleOnlineChannel?.setName('︱online agora︱' + serverStatus.playersOnline);

            timeChannel?.setName('︱data/hora︱' + (gameData?.date?.formatted ?? 'Indisponível'));
        } catch (e) {
            console.error(`Error while updating server status: ${e}`);
            serverStatusChannel?.setName('︱server︱' + serverService.status.OFFLINE);
            peopleOnlineChannel?.setName('︱online agora︱0');
        }
    },
}
