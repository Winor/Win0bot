import type { ApplicationCommandOptionData, ApplicationCommandType } from 'discord.js'
import type { w0bMessage} from './types'
import { ApplicationCommandOptionType } from 'discord.js'

type DiscordSpecific = {
    options?: ApplicationCommandOptionData[],
    type?: ApplicationCommandType
}

export default class Commend {
    name: string
    description?: string
    cmdTriggers: string[]
    hear: string[]
    globalHear: string[]
    platform?: "any" | "discord" | "telegram"
    lvl?: number
    discord?: DiscordSpecific
    hidden?: true | false

    constructor (info: {name: string, description?: string ,cmd: string[], hear: string[], globalHear: string[], platform?: "any" | "discord" | "telegram", lvl?: number, discord?: DiscordSpecific}) {
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
