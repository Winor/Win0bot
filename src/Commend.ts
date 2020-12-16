export default class Commend {
    name: string
    cmdTriggers: string[] | false
    hear: string[] | false

    constructor (info: {name: string, cmd: string[], hear: string[] | false}) {
        this.name = info.name
        this.cmdTriggers = info.cmd
        this.hear = info.hear
    }

}