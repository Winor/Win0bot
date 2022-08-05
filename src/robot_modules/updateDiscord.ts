import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'
import {commandData} from '../listenerMap'
import { GuildMember } from 'discord.js'

export default class UpdateDiscord extends Commend {
constructor() {
    super({
        name: 'update',
        cmd: ['update'],
        description: 'Update Discord commands list',
        hear: [],
        globalHear: [],
        platform: "discord",
        lvl: 0
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {
        await msg.defer({ephemeral: true})
        if (msg.raw.member instanceof GuildMember) {
            if (msg.raw.member.permissions.has('Administrator')){
                const guild = msg.raw.guild
                console.log(commandData)
                guild?.commands.set(commandData)
                msg.followUp({content: `Done, pushed ${commandData.length} commands.`, ephemeral: true})
                return
            }
            msg.followUp({content: 'You do not have permissions', ephemeral: true})
        }
        
    } catch (e) {
        console.log(e)
    }   
}
}