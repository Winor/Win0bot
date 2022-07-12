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
            type: 'STRING',
            description: 'The input which should be echoed back',
            required: true,
          }]
        }
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {
        msg.args.shift()
        await msg.back(msg.args.join(' '))
    } catch (e) {
        console.log(e)
    }   
}
}