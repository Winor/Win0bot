import * as config from './config.json'
export default class Message {
    hasPrefix: boolean
    args: string[]
    hasCommand: string | false
    magicWord: string
    platform: "discord" | "telegram"

    constructor(content: string, platform: "discord" | "telegram"){
      this.hasPrefix = content.charAt(0) === config.prefix
      this.args = content.split(' ')
      this.hasCommand = (this.hasPrefix) ? this.args[0].replace(config.prefix, '') : false
      this.magicWord = this.args[0]
      this.platform = platform
    }
}