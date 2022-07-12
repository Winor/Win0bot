import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'

export default class Magic8 extends Commend {
    private magic8Eng: string[];
    constructor() {
        super({
            name: 'magic8',
            cmd: ['magic8', 'm8'],
            hear: [],
            globalHear: [],
            platform: "any"
        })
        this.magic8Eng = [
            "It is certain",
            "It is decidedly so",
            "Without a doubt",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "Reply hazy try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful"
        ]
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            await msg.back(this.magic8Eng[Math.floor(Math.random() * this.magic8Eng.length)])
        } catch (e) {
            console.log(e)
        }
    }
}