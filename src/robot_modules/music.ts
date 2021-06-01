import { Message } from 'discord.js';
import Commend from '../Commend'
import type w0bMessage from '../discord/adapter'
import player from '../discord/voice';

export default class Music extends Commend {
    constructor() {
        super({
            name: 'music',
            cmd: ['play', 'ply','skip'],
            hear: [],
            globalHear: [],
            platform: "discord"
        })
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            msg.args.shift()
            switch (msg.hasCommand) {
                case 'play':
                case 'ply':
                    player.play(msg.raw as Message, msg.args.join(' '));
                    break;
                case 'skip':
                    player.skip(msg.raw as Message);
                    break;
            
                default:
                    break;
            }
        } catch (e) {
            console.log(e)
        }
    }
}