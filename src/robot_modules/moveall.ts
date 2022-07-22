import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'
import { GuildMember } from 'discord.js';

export default class MoveAll extends Commend {
constructor() {
    super({
        name: 'moveall',
        description: 'Move all members in voice to the voice channle you are in',
        cmd: ['moveall', 'mv'],
        hear: [],
        globalHear: [],
        platform: "discord",
        lvl: 1
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {
        if (msg.raw.member instanceof GuildMember && msg.raw.member.voice.channel) {
        const channel = msg.raw.member.voice.channel;
        if (msg.raw.member.permissions.has('MOVE_MEMBERS')) {
            if (!msg.raw.guild) {return}
        const members = []
        for (const [ ,member] of msg.raw.guild.members.cache) {
            if (member.voice.channelId) {
                members.push(member.displayName)
                member.voice.setChannel(channel);
        }
    }
    msg.back({content: `Okay I moved ${members.join(', ')} to your channle.`, ephemeral: true })
        } else {
            msg.back({content: `You don't have permission to move members.`, ephemeral: true })
        }
    } else {
        msg.back({content: `You are not in a voice channle.`, ephemeral: true })
    }

    } catch (e) {
        console.log(e)
    }   
}
}