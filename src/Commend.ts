import type { ApplicationCommandOptionData } from 'discord.js'
import config from './config.json'

export default class Commend {
    name: string
    description?: string
    private _cmdTriggers: string[] | false
    hear: string[] | false
    platform?: "any" | "discord" | "telegram"
    lvl?: number
    discord?: ApplicationCommandOptionData

    constructor (info: {name: string, description?: string ,cmd: string[], hear: string[] | false, platform?: "any" | "discord" | "telegram", lvl?: number, discord?: ApplicationCommandOptionData}) {
        this.name = info.name
        this.description = info.description
        this._cmdTriggers = false
        this.cmdTriggers = info.cmd
        this.hear = info.hear
        this.platform = info.platform
        this.lvl = info.lvl
        this.discord = info.discord
    }

    get cmdTriggers(): string[] | false {
        return this._cmdTriggers
    }

    set cmdTriggers(newCMD: string[] | false) { 
        if (Array.isArray(newCMD)) {
            this._cmdTriggers = newCMD.map(i => config.prefix + i);
            return
        }
        if (!newCMD) {
            this._cmdTriggers = false
            return
        }
    }
}