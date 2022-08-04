import { Interaction, Message, ButtonBuilder, ComponentType } from 'discord.js';
import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'

export default class FindTheBall extends Commend {
constructor() {
    super({
        name: 'cupgame',
        cmd: ['cupgame', 'cg'],
        hear: [],
        globalHear: [],
        platform: "discord",
        lvl: 0
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {
        await msg.defer()
        const ball = Math.floor(Math.random() * 3)
        
        const btns: ButtonBuilder[] = []
        for (let i = 0; i < 3; i++) {       
            btns.push(msg.createBtn(`${i+1}`))
        }
        const row = msg.createRow(btns)

        const newMsg = await msg.followUp({ content: 'Where is the ball ?', components: [row] }) as Message | Interaction
        const input = await msg.collector(newMsg)
        if (input?.componentType === ComponentType.Button) {
            if(input.customId === ball.toString()) {
                await input.update({ content:'You are right !', components: [] })
            } else {
                await input.update({ content:`Better luck next time ! \nThe ball was at cup number ${ball+1}`, components: [] })
            }
        }

        
    } catch (e) {
        console.log(e)
    }   
}
}