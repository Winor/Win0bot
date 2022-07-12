import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'

export default class Ping extends Commend {
constructor() {
    super({
        name: 'ping',
        cmd: ['ping', 'p'],
        hear: [],
        globalHear: [],
        platform: "any"
    })
}

async run (message: w0bMessage): Promise<void> {
    try {
      await message.back("🏓 Pong!");
    } catch (e) {
      console.log(e);
    }
  }
}