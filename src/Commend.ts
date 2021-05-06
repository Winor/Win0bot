import config from './config.json'

export default class Commend {
    name: string
    private _cmdTriggers: string[] | false
    hear: string[] | false
    platform?: "any" | "discord" | "telegram"
    lvl?: number

    constructor (info: {name: string, cmd: string[], hear: string[] | false, platform?: "any" | "discord" | "telegram", lvl?: number}) {
        this.name = info.name
        this._cmdTriggers = false
        this.cmdTriggers = info.cmd
        this.hear = info.hear
        this.platform = info.platform
        this.lvl = info.lvl
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