import { DiscordAPIError, Message } from "discord.js";
import DiscordJS from 'discord.js';
import path from 'path';
import { ICommand } from "wokcommands";
import { AudioPlayerStatus } from "@discordjs/voice";

export default {
    category: 'therebot',
    description: 'Play an in-built playlist',
    slash: 'both',
    minArgs: 1,
    expectedArgs: '<playlist>',
    callback: ({message, interaction, args}) => {
        const fs = require('fs');
        const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

        // Vars
        let guild = message ? message.guild : interaction.guild;
        let channel = message ? message.channel : interaction.channel;
        let userId = message ? message.author.id : interaction.user.id;
        let member = guild?.members.cache.get(userId);

        let [name] = args;
        let playlistPath = path.join(__dirname, `../playlists/${name}`);
        
        // Files check
        let files : string[] = fs.readdirSync(playlistPath);
        let extensionCheck = false;
        if(files.length <= 0) {
            return `Couldn't find playlist, ${name}, or no songs exists`;
        }
        files.forEach(file => {
            let extension : string = file.split('.').pop()!;
            if(extension !== "mp3") {
                extensionCheck = true;
            }
        })
        if(extensionCheck) return `Invalid file type in playlist path ${playlistPath}`;
        
        // Player VC check
        if(!member!.voice.channel) {
            return `You are not in a voice channel.`
        }
        
        // Init VC
        let vcId = member!.voice.channelId;
        let max = files.length;
        let player = createAudioPlayer();
        let audioResource;
        const connection = joinVoiceChannel({
            channelId: vcId,
            guildId: guild?.id,
            adapterCreator: guild?.voiceAdapterCreator
        })

        // Start playlist
        let num = getRandomNumber(max);
        max--;
        let file = files[num];
        let filePath = path.join(playlistPath, file);

        const index = files.indexOf(file, 0);
        if (index > -1) {
            files.splice(index, 1);
        }
        audioResource = createAudioResource(filePath);
        player.play(audioResource);
        let subscription = connection.subscribe(player);

        // Continue playlist
        player.on(AudioPlayerStatus.Idle, () => {
            if(files.length <= 0) {
                connection.destroy();
                channel?.send(`Playlist, ${name}, ended.`);
                return;
            }

            let num = getRandomNumber(max);
            max--;
            let file = files[num];
            let filePath = path.join(playlistPath, file);

            const index = files.indexOf(file, 0);
            if (index > -1) {
                files.splice(index, 1);
            }
            audioResource = createAudioResource(filePath);
            player.play(audioResource);
            subscription = connection.subscribe(player);
        })

        return `Playing ${name}`
    }
} as ICommand


function getRandomNumber(max : number){
    /* Example
     * Input: 3
     * Output: 0, 1, 2
     */
    return Math.floor(Math.random() * max);
}