import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'

export default class Echo extends Commend {
constructor() {
    super({
        name: 'echo',
        cmd: ['echo', 'ec'],
        hear: [],
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
        await msg.back(msg.text)
    } catch (e) {
        console.log(e)
    }   
}
}