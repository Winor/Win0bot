import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'
import { GuildMember, InteractionType } from 'discord.js';

export default class PrivateMessage extends Commend {
constructor() {
    super({
        name: 'pm',
        cmd: ['privatemessage', 'pm'],
        description: 'Sends a private message to all the users in the same voice chat as you',
        hear: [],
        globalHear: [],
        platform: "discord",
        lvl: 0,
        discord: {
            options: [{
            name: 'content',
            type: 3,
            description: 'The message content to send',
            required: true,
          },
          {
            name: 'file',
            type: 11,
            description: 'Add a file to the message, for example a picture.',
            required: false,
          }]
        }
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {
        await msg.defer({ephemeral: true})
        if (msg.raw.type === InteractionType.ApplicationCommand) {
        if (msg.raw.member instanceof GuildMember && msg.raw.member.voice.channel) {
        const channel = msg.raw.member.voice.channel.members;
        channel.forEach(async member => {
            if(member === msg.raw.member) {return}
            member.send(`${msg.raw.member}: ${msg.text}`)
        });
        await msg.followUp({content: `I sent a message to ${msg.raw.member.voice.channel.members.size - 1} pepole`, ephemeral: true})
        } else {
            await msg.followUp({content:'Join a voice channel and then try that again!', ephemeral: true})
        }
    }
    await msg.back(`Please use /${this.name} instead.`)
    } catch (e) {
        console.log(e)
    }   
}
}