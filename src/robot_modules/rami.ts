import Commend from '../Commend'
import type w0bMessage from '../discord/adapter'

export default class Rami extends Commend {
    private rami: string[];
    constructor() {
        super({
            name: 'rami',
            cmd: ['rami'],
            hear: ['@Ramvader', 'rami', 'רמי', '<@!358373568939294737>'],
            globalHear: [],
            platform: "any"
        })
        this.rami = [
            "דק",
            "אפשר גם עכשיו",
            "הפילו עכשיו אפשר",
            "נשמע טוב",
            "אני בא",
            "בדרך",
            "כן",
            "לא",
            "בעוד שעה",
            "מתי?",
            "מתי שבא לכם",
            "אפשר מחר",
            "אני מגיע מתי שתגידו",
            "באו",
            "תכף מגיע",
            "מוצי מקבל ובא",
            "רגע אני מסיים לאכול דגגגג",
            "תכף",
            "רגע מכין תא"
        ]
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            const rand = Math.floor(Math.random() * this.rami.length)
            if(rand === 0) {
                await msg.back(`רמי: ${ Math.floor(Math.random() * 60)} דק`)
                return
            }
            await msg.back(`רמי: ${this.rami[rand]}`)
        } catch (e) {
            console.log(e)
        }
    }
}