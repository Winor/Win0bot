import Commend from '../Commend'
import { w0bMessage } from '../types'

export default class Ping extends Commend {
constructor() {
    super({
        name: 'ping',
        cmd: ['ping', 'p'],
        hear: false
    })
}

async run (message: w0bMessage): Promise<void> {
    try {
      const msg = await message.channel.send("🏓 Ping!");
      msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙`);
    } catch (e) {
      console.log(e);
    }
  }
}