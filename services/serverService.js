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
    return 0;
}

async function getServerStatus() {
    let serverStatus = {
        status: status.OFFLINE,
        playersOnline: 0,
    };

    const command = await rcon.execute('players');
    if (command.stdout?.includes('layers')) {
        serverStatus.playersOnline = parsePlayerOnline(command.stdout);
        serverStatus.status = status.ONLINE;

    } else if (command.stderr || command.stdout?.includes('error') || command.stdout?.includes('timeout') || command.stdout?.includes('refused')) {
        serverStatus.status = status.OFFLINE;
        serverStatus.playersOnline = 0;
        return serverStatus;
    }

    return serverStatus;
}

module.exports = {
    serverStatus: getServerStatus,
    status: status,
}
