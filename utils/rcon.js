async function execute(message) {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
        const {stdout, stderr} = await exec("/saviors-s7/rcon/rcon --config /saviors-s7/Zomboid/Server/rcon.yaml '" + message + "'");
        return {stdout, stderr};
    } catch (err) {
        return {stdout: null, stderr: err};
    }
}

module.exports = {
    execute: execute
}
