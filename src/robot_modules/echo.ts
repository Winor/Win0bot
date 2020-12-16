import Commend from '../Commend'
import { w0bMessage } from '../types'

export default class Echo extends Commend {
constructor() {
    super({
        name: 'echo',
        cmd: ['echo', 'ec'],
        hear: false
    })
}

run(msg: w0bMessage): void {
    msg.args.shift()
    msg.channel.send(msg.args.join(' '))
}
}