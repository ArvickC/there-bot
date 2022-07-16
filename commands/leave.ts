import { DiscordAPIError, Message } from "discord.js";
import DiscordJS from 'discord.js';
import { ICommand } from "wokcommands";

export default {
    category: 'therebot',
    description: 'Disconnect bot from voice channel',
    slash: 'both',
    callback: ({message, interaction}) => {
        const { getVoiceConnection } = require('@discordjs/voice');

        // Get guild
        let guild;
        if(message) guild = message.guild; else guild = interaction.guild;
        
        // Get connection
        const connection = getVoiceConnection(guild?.id);
        if(!connection) return "Not in a channel." // Check if connection exists
        connection.destroy(); // Destory connection
        return "leaving.."
    }
} as ICommand