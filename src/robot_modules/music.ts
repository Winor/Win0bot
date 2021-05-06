import Commend from '../Commend'
import type w0bMessage from '../discord/adapter'
import player from '../discord/voice';

export default class Music extends Commend {
    constructor() {
        super({
            name: 'music',
            cmd: ['play', 'ply'],
            hear: false,
            platform: "discord"
        })
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            msg.args.shift()
            player.play(msg.raw, msg.args.join(' '));
        } catch (e) {
            console.log(e)
        }
    }
}