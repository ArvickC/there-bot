import { DiscordAPIError, Message } from "discord.js";
import DiscordJS from 'discord.js';
import { ICommand } from "wokcommands";

export default {
    category: 'therebot',
    description: 'Shows bot overview.',
    slash: 'both',
    callback: ({message, interaction}) => {
        const { getVoiceConnection } = require('@discordjs/voice');
        let guild;
        if(message) guild = message.guild; else guild = interaction.guild;
        
        const connection = getVoiceConnection(guild?.id);
        if(!connection) return "Not in a channel."
        connection.destroy();
        return "leaving.."
    }
} as ICommand