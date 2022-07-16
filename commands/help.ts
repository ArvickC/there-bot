import { DiscordAPIError, Message } from "discord.js";
import DiscordJS from 'discord.js';
import { ICommand } from "wokcommands";

export default {
    category: 'therebot',
    description: 'Shows bot overview.',
    slash: 'both',
    callback: ({message, interaction}) => {
        const embed = new DiscordJS.MessageEmbed()
        .setColor('#25be55')
        .setTitle('Help')
        .setDescription('@therebot')
        .addFields(
            {name: 'Overview', value: "@therebot is a Discord.JS bot that, similar to the @here function in discord (which @mention's online members), gives the ability @mention only offline members in a Discord Guild/Server. The bot will create a role, 'there', which will be given to anyone who is offline. If you would like to @mention the offline members, you can use '@there'."},
            {name: 'Usage', value: "- Typing 'bing' will trigger the bot to respond with 'bong'.\n- Typing 'L' will trigger the bot to respond with 'L + ratio'\n- Typing '!help' or /help will show this page."}
        )

        return embed;
    }
} as ICommand