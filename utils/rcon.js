async function execute(message) {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
        const {stdout, stderr} = await exec("/games/rcon/rcon --config /games/Zomboid/Server/rcon.yaml '" + message + "'");
        return {stdout, stderr};
    } catch (err) {
        console.error(err);
        return {stdout: null, stderr: err};
    }
}

module.exports = {
    execute: execute
}
