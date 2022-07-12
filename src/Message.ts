import config from './config'
export default class Message {
    content: string
    hasPrefix: boolean
    args: string[]
    text: string
    msgArray: string[]
    hasCommand: string | false
    platform: "discord" | "telegram"

    constructor(content: string, platform: "discord" | "telegram"){
      this.content = content
      this.hasPrefix = this.content.charAt(0) === config.prefix
      this.msgArray = this.content.split(' ')
      this.args = this.msgArray.slice(1)
      this.text = this.args.join(' ')
      this.hasCommand = (this.hasPrefix) ? this.msgArray[0].replace(config.prefix, '') : false
      this.platform = platform
    }
}