import * as config from '../config.json'
import Discord from 'discord.js'

Discord.Structures.extend('Message', Message => {
  class w0bMessage extends Message {
    private hasPrefix: boolean
    args: string[]
    hasCommand: string | false
    constructor(client: Discord.Client, data: object, channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) {
      super(client, data, channel);
      this.hasPrefix = this.content.charAt(0) === config.prefix
      this.args = this.content.split(' ')
      this.hasCommand = (this.hasPrefix) ? this.args[0].replace(config.prefix, '') : false
    }
  }

  return w0bMessage;
});