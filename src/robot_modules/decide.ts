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
            type: 3,
            description: 'The input which should be echoed back',
            required: true,
          }]
        }
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {  
        const items = msg.text.split(' או ')
        if (items) {
            const num = Math.floor(Math.random() * items.length)
            await msg.back(items[num])
        }
        
    } catch (e) {
        console.log(e)
    }   
}
}