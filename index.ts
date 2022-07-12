// Imports
import DiscordJS, { Guild, Intents, Message, Role } from 'discord.js';
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
const authorID = /* REDACTED USER ID */ '000000000000000000';

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
    console.log("\nThe bot is ready");
});

// On send message
client.on('messageCreate', async (message) => {
    if(message.content === "bing") {
        if(message.author.id === authorID) {
            message.reply({
                content: 'bing',
            })
        } else if(message.author.id !== /* REDACTED USER ID */ '000000000000000001') {
            message.reply({
                content: 'bong',
            })
        } else {}
        
    }

    // Kill bot
    if(message.content === "*kill") {
        if(message.author.id === authorID) {
            message.reply({
                content: 'Killing bot..',
            }).then(m => {
                client.destroy();
            })
        } else {
            message.reply({
                content: 'YOU ARE NOT OWNER',
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