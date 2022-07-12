import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'

export default class Eden extends Commend {
    private eden: string[];
    private edenStarday: string[];
    constructor() {
        super({
            name: 'edenwantto',
            description: 'קבל התחמקות מעדן',
            cmd: [],
            hear: [],
            globalHear: ['עדן רוצה', 'Eden רוצה ', 'עדן בא לך'],
            platform: "any"
        })

        this.eden = [
            "הלוואי יש לי לסיים מלא עבודות",
            "אני צריכה לסיים את השיעורים",
            "יש לי מבחן",
            "יש מצב תלוי בכמה שיעורי בית יהיה לי לעשות מחר",
            "הלוואי אני תקועה בזום לנצח",
            "אמא שלי לקחה אותי לרבמד חחח",
            "חחח אני לא בבית",
            "חחח אני לא יכולה אחיין שלי צריך לבוא",
            "אני לא יכולה",
            "לי יש שיעורים"
        ]

        this.edenStarday = [
            "אני אצל סבתא שלי",
            "אבל אני אצל סבתא שלי בצהריים",
            "אני בדרך לסבתא שלי",
        ]
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            const date = new Date
            if (date.getDay() === 6) {
                await msg.back(`עדן: ${this.edenStarday[Math.floor(Math.random() * this.edenStarday.length)]}`)
                return
            }
            await msg.back(`עדן: ${this.eden[Math.floor(Math.random() * this.eden.length)]}`)
        } catch (e) {
            console.log(e)
        }
    }
}