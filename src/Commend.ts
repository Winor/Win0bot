import type { w0bMessage, ApplicationCommandOptionData} from './types'

export default class Commend {
    name: string
    description?: string
    cmdTriggers: string[]
    hear: string[]
    globalHear: string[]
    platform?: "any" | "discord" | "telegram"
    lvl?: number
    discord?: ApplicationCommandOptionData[]
    hidden?: true | false

    constructor (info: {name: string, description?: string ,cmd: string[], hear: string[], globalHear: string[], platform?: "any" | "discord" | "telegram", lvl?: number, discord?: ApplicationCommandOptionData[]}) {
        this.name = info.name
        this.description = info.description
        this.cmdTriggers = info.cmd
        this.hear = info.hear
        this.globalHear = info.globalHear
        this.platform = info.platform
        this.lvl = info.lvl
        this.discord = info.discord
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(msg: w0bMessage): Promise<void> {
        return
    }
  }
