import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'
//
import subscriptions from '../adapters/discord/music'


export default class Skip extends Commend {
    constructor() {
        super({
            name: 'skip',
            cmd: ['skip', 'skp'],
            hear: [],
            globalHear: [],
            platform: "discord",
            description: "Skip to the next song in the queue"
        })
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            if (msg.guildId) {
                const subscription = subscriptions.get(msg.guildId);
                if (subscription) {
                    // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
                    // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
                    // will be loaded and played.
                    subscription.audioPlayer.stop();
                    await msg.back('Skipped song!');
                } else {
                    await msg.back('Not playing in this server!');
                }
            }

        } catch (e) {
            console.log(e)
        }
    }
}