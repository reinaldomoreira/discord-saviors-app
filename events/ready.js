const {Events} = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        const cron = require('node-cron');

        const functionsPath = path.join(__dirname, '..', 'scheduled_functions');
        const functionsFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));

        for (const file of functionsFiles) {
            const filePath = path.join(functionsPath, file);
            const func = require(filePath);
            if ('execute' in func && 'frequency' in func && 'name' in func) {
                console.log(`Scheduling function ${func.name} to run in ${func.frequency}`);
                cron.schedule(func.frequency, async () => {
                    try {
                        await func.execute(client);
                    } catch (error) {
                        console.error(`Error running scheduled function ${func.name}: ${error}`);
                    }
                });
            } else {
                console.log(`[WARNING] The function at ${filePath} is missing a required "execute" or "frequency" property.`);
            }
        }
    },
};
