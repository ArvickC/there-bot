import { DiscordAPIError, Message } from "discord.js";
import DiscordJS from 'discord.js';
import path from 'path';
import { ICommand } from "wokcommands";
import { generateDependencyReport } from "@discordjs/voice";

export default {
    category: 'therebot',
    description: 'Shows bot overview.',
    slash: 'both',
    minArgs: 2,
    expectedArgs: '<trackNumber> <trackExtension>',
    callback: ({message, interaction, args}) => {
        const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
        const vcId = '745734535400128642';
        let guild;
        if(message) guild = message.guild; else guild = interaction.guild;
        
        const [trackNumber, trackExtension] = args;
        
        const connection = joinVoiceChannel({
            channelId: vcId,
            guildId: guild?.id,
            adapterCreator: guild?.voiceAdapterCreator
        })
        
        let track = trackNumber + trackExtension;
        let trackPath = path.join(__dirname, `../audio/${track}`);

        const player = createAudioPlayer();
        const audioResource = createAudioResource(trackPath);

        player.play(audioResource);
        player.unpause();

        const subscription = connection.subscribe(player);

        return "i've been summoned."
    }
} as ICommand