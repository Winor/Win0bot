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
            "x דק",
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
            "רגע מכין תא",
            "בא",
            "סבבה",
            "בעוד x שעות בערך",
            "לאן?",
            "אני מוכן",
            "אני מוכן מי שרוצה",
            "מה קרה?",
            "מה",
            "יאללה",
            "היום?",
            "x שניות",
            "בעוד x ימים",
            "אני בא רגע",
            "תספרו x שניות"
        ]
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            const rand = Math.floor(Math.random() * this.rami.length)
            if(this.rami[rand].includes('x')) {
                const xtime = this.rami[rand].replace('x', `${ Math.floor(Math.random() * 60)}`)
                await msg.back(`רמי: ${xtime}`)
                return
            }
            await msg.back(`רמי: ${this.rami[rand]}`)
        } catch (e) {
            console.log(e)
        }
    }
}