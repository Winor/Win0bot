import Commend from '../Commend'
import type w0bMessage from '../discord/adapter'

export default class Echo extends Commend {
constructor() {
    super({
        name: 'echo',
        cmd: ['echo', 'ec'],
        hear: false,
        platform: "any",
        lvl: 0
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