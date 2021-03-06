import { DiscordAPIError, Message } from "discord.js";
import DiscordJS from 'discord.js';
import path from 'path';
import { ICommand } from "wokcommands";
import { generateDependencyReport } from "@discordjs/voice";

export default {
    category: 'therebot',
    description: 'Summon bot to play audio',
    slash: true,
    minArgs: 3,
    expectedArgs: '<trackNumber> <trackExtension> <voiceChannel>',
    callback: ({message, interaction, args}) => {
        const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
        let guild = interaction.guild;
        
        const [trackNumber, trackExtension, vc] = args;
        const vcId = guild?.channels.cache.find(c => c.name === vc)?.id;
        
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

        const subscription = connection.subscribe(player);

        return "i've been summoned."
    }
} as ICommand