const {ActivityType} = require('discord.js');
const cronHelper = require('../utils/cronHelper');
const serverService = require('../services/serverService');

module.exports = {
    name: 'serverStatus',
    frequency: cronHelper.everyMinute(),
    execute: async function (client) {
        await client.user.setPresence({
            status: 'dnd',
            activities: [{name: 'Saviors ' + (await serverService.serverStatus()).playersOnline, type: ActivityType.Playing}]
        });
    },
}
