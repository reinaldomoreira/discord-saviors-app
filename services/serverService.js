const rcon = require('../utils/rcon');

const status = {
    ONLINE: 'online',
    OFFLINE: 'offline',
};

function parsePlayerOnline(stdout) {
    if (stdout.includes('No players')) {
        return 0;
    }
    if (stdout.includes('Players connected')) {
        return parseInt(stdout.match("Players connected \\((\\d+)")[1]);
    }
}

async function getServerStatus() {
    let serverStatus = {};

    const command = await rcon.execute('players');
    const playersOnline = parsePlayerOnline(command.stdout);

    if (playersOnline === undefined) {
        throw new Error('Failed to parse players online');
    }
    serverStatus.playersOnline = playersOnline;
    serverStatus.status = status.ONLINE;

    return serverStatus;
}

module.exports = {
    serverStatus: getServerStatus,
    status: status,
}
