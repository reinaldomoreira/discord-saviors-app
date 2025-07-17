const fs = require('node:fs');

let gameData = null;

export function getGameData() {
    try {
        gameData = fs.readFileSync('/saviors-s7/Zomboid/lua/ExportedGameData.json', 'utf-8');
        console.log('gameData', gameData);
    } catch (e) {
        console.error(`Error reading game data file: ${e}`);
        return null;
    }


}

module.exports = {
    getGameData: getGameData
}
