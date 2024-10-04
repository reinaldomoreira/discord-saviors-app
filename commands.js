import 'dotenv/config';
import {getRPSChoices} from './game.js';
import {capitalize, InstallGlobalCommands} from './utils.js';

const APPLICATION_COMMAND_TYPES = {
    CHAT_INPUT: 1, // 	Slash commands; a text-based command that shows up when a user types /
    USER: 2, // A UI-based command that shows up when you right click or tap on a user
    MESSAGE: 3, // A UI-based command that shows up when you right click or tap on a message
    PRIMARY_ENTRY_POINT: 4 // A UI-based command that represents the primary way to invoke an app's Activity
}

const INTERACTION_CONTEXT_TYPES = {
    GUILD: 0, // Interaction can be used within servers
    BOT_DM: 1, // Interaction can be used within DMs with the app's bot user
    PRIVATE_CHANNEL: 2 // Interaction can be used within Group DMs and DMs other than the app's bot user
}

const INTEGRATION_TYPES = {
    GUILD_INSTALL: 0,
    USER_INSTALL: 1
}

const REGISTER_NEW_SURVIVOR_COMMAND = {
    name: 'registernewsurvivor',
    description: 'Tag user, create password and send it to user',
    type: APPLICATION_COMMAND_TYPES.CHAT_INPUT,
    integration_types: [INTEGRATION_TYPES.GUILD_INSTALL],
    contexts: [INTERACTION_CONTEXT_TYPES.GUILD, INTERACTION_CONTEXT_TYPES.BOT_DM],
};


const ALL_COMMANDS = [REGISTER_NEW_SURVIVOR_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
