import Commend from '../Commend'
import type w0bMessage from '../discord/adapter'

export default class Ping extends Commend {
constructor() {
    super({
        name: 'ping',
        cmd: ['ping', 'p'],
        hear: false,
        platform: "any"
    })
}

async run (message: w0bMessage): Promise<void> {
    try {
      const msg = await message.back("🏓 Ping!");
      message.edit(msg ,`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.raw.createdTimestamp}ms. 💙`);
    } catch (e) {
      console.log(e);
    }
  }
}