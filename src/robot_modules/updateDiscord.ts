import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'
import {commandData} from '../listenerMap'

export default class UpdateDiscord extends Commend {
constructor() {
    super({
        name: 'update',
        cmd: ['update'],
        hear: [],
        globalHear: [],
        platform: "discord",
        lvl: 0
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {
        const guild = msg.raw.guild
        console.log(commandData)
        guild?.commands.set(commandData)
        
    } catch (e) {
        console.log(e)
    }   
}
}