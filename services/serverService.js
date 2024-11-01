const rcon = require('../utils/rcon');

const status = {
    ONLINE: 'online',
    OFFLINE: 'offline',
};

function parsePlayerOnline(stdout) {
    if(stdout.includes('No players')) {
        return 0;
    }
    if(stdout.includes('Players connected')) {
        const regex = RegExp("Players connected: \([0-9]+\)");

        // get the capturing group of the regex match
        const match = regex.exec(stdout)[1];
        return parseInt(match);
    }
}

async function getServerStatus() {
    let serverStatus = {};

    try {
        const command = await rcon.execute('players');
        const playersOnline = parsePlayerOnline(command.stdout);
        if(playersOnline !== undefined) {
            serverStatus.status = status.ONLINE;
            serverStatus.playersOnline = playersOnline;
        }
        serverStatus.status = status.ONLINE;
    } catch (e) {
        serverStatus.status = status.OFFLINE;
    }

    return serverStatus;
}

module.exports = {
    serverStatus: getServerStatus,
    status: status,
}
