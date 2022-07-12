// Imports
import DiscordJS, { Guild, Intents, Message, Role } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Intents
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

// Vars
const roleName = 'there';
const authorID = '417779789831602177';

// Functions
async function setRoles(g: Guild, r: Role){
    // Get offline/online members
    const members = await g.members.fetch({ withPresences: true });
    const offline = members.filter(m => !m.user.bot && (m.presence?.status === 'offline' || m.presence === null));
    const online = members.filter(m => !m.user.bot && (m.presence?.status !== 'offline' && m.presence !== null));

    // Assign roles
    offline.forEach(m => {
        m.roles.add(r);
    })
    online.forEach(m => {
        m.roles.remove(r);
    })
}

function createRole(g: Guild){
    // Create Role
    g.roles.create({
        name: roleName,
        color: '#1c1c1c'
    }).then(role => {
        setRoles(g, role);
    })
}

// On boot
client.on('ready', async () => {
    // Setup Commands
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        typeScript: true
    })

    // Get guilds
    const guilds = await client.guilds!;

    // Loop through guilds
    guilds.cache.forEach(async g => {
        // Check if role exists
        let r = g.roles.cache.find((r) => r.name === roleName);
        if(typeof r !== 'object') {
            // Create role
            createRole(g);
        } else {
            setRoles(g, r);
        }
    })

    // Log
    console.log("The bot is ready");
});

// On send message
client.on('messageCreate', async (message) => {
    if(message.content === "bing") {           
        if(message.author.id !== '406992000064159744') {
            message.reply({
                content: 'bong',
            })
        } else {
            message.reply({
                content: 'bing',
            })
        }
    }

    if(message.content === "L") {
        message.channel.send("L + ratio")
    }
});

// User update online/offline
client.on('presenceUpdate', (oldPresence, newPresence) => {
    // Get member
    let member = newPresence?.member;

    // Check if role exists
    let role = member?.guild.roles.cache.find(r => r.name === roleName)!;
    if(typeof role !== 'object') {
        createRole(member?.guild!);
        return;
    };

    // Change roles
    if(newPresence?.status === "online"){
        member?.roles.remove(role)
    }
    if(newPresence?.status === "offline") {
        member?.roles.add(role)
    }
});

// Client start
client.login(process.env.TOKEN);