import Commend from '../Commend'
import * as db from '../db'
import type w0bMessage from '../discord/adapter'

export default class Notify extends Commend {
constructor() {
    super({
        name: 'notify',
        cmd: [],
        hear: [],
        globalHear: [],
        platform: "discord",
        lvl: 0,
        discord: {
            type: 'USER'
        }
    })
}

async run(msg: w0bMessage): Promise<void> {
    try {
         //await msg.defer()
        const botUser = await db.findUser({
            discordId: msg.raw.member?.user.id
        })
        const target = await msg.getTarget()
        if ((botUser) && (target)) {
            const store = await db.findStore(botUser.id, 'notify')
            if (store) {
                const targets:Set<string> = new Set(store.data as [])
                if (targets.has(target)){
                    targets.delete(target)
                    await msg.back({content: `Okay I removed <@${target}> from your notify list.\n${this.getTextTargets(targets, "or")}`, ephemeral: true })
                } else {
                    targets.add(target)
                    await msg.back({content: `Okay I added <@${target}> to your notify list.\n${this.getTextTargets(targets, "or")}\n To remove a user from this list press "notify" again`, ephemeral: true })
                }
                await db.updateStore(store.id, 'notify', [...targets])
                return
            }
            await await db.createStore(botUser.id, 'notify', [target])
            msg.back({content: `Okay I added <@${target}> to your notify list.`, ephemeral: true })
        }

        
    } catch (e) {
        console.log(e)
    }   
}

getTextTargets(targets: Set<string>, contentwith: 'and' | 'or'): string {
    const targetsList:string[] = []
    const size = targets.size
    let count = 0
    targets.forEach(target => {
        count ++
        targetsList.push(`<@${target}>${(count === size-1) ? ` ${contentwith} `: `${(size === count)? '' : ', ' }`}`)
    });
    if (size === 0) {
        return ` ${targetsList.join('')}`
    }
    return `You'll get notified if ${targetsList.join('')} ${(size === 1) ? 'join' : 'joins'} a voice channel`
}
}