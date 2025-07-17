const fs = require('node:fs');

let gameData = null;

function getGameData() {
    try {
        gameData = fs.readFileSync('/saviors-s7/Zomboid/Lua/ExportedGameData.json', 'utf-8');
        return JSON.parse(gameData);
    } catch (e) {
        console.error(`Error reading game data file: ${e}`);
        return null;
    }


}

module.exports = {
    getGameData: getGameData
}
