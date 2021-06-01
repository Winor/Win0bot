import * as config from './config.json'
export default class Message {
    content: string
    hasPrefix: boolean
    args: string[]
    hasCommand: string | false
    platform: "discord" | "telegram"

    constructor(content: string, platform: "discord" | "telegram"){
      this.content = content
      this.hasPrefix = this.content.charAt(0) === config.prefix
      this.args = this.content.split(' ')
      this.hasCommand = (this.hasPrefix) ? this.args[0].replace(config.prefix, '') : false
      this.platform = platform
    }
}