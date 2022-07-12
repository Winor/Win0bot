import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'

export default class Decide extends Commend {
constructor() {
    super({
        name: 'decide',
        cmd: ['decide', 'd'],
        hear: ['תחליט','decide'],
        globalHear: [],
        platform: "any",
        lvl: 0,
        discord: {
            options: [{
            name: 'input',
            type: 'STRING',
            description: 'The input which should be echoed back',
            required: true,
          }]
        }
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {  
        const text = msg.args
        text.shift()
        const newmsg = text.join(' ')
        const items = newmsg.split(' או ')
        if (items) {
            const num = Math.floor(Math.random() * items.length)
            await msg.back(items[num])
        }
        
    } catch (e) {
        console.log(e)
    }   
}
}