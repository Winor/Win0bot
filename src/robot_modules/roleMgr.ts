import Commend from '../Commend'
import { w0bMessage } from '../types'

import config from '../config.json'
import { Message } from 'discord.js';

function upperCaseString(string: string) {
    const rolename = string.toLowerCase();
    return rolename.charAt(0).toUpperCase() + rolename.slice(1);
}

export default class Echo extends Commend {
    constructor() {
        super({
            name: 'Give Role',
            cmd: ['role'],
            hear: false,
            platform: "discord"
        })
    }

    run(dmsg: w0bMessage): void {
        const msg = dmsg.raw as Message
        if (dmsg.args[1]) {
            const action = upperCaseString(dmsg.args[1])
            const isAction = (action === 'Give') || (action === 'Remove')
            const roleName = dmsg.args[2] ? upperCaseString(dmsg.args[2]) : false
            if (isAction && roleName) {
                const guildRole = msg.guild?.roles.cache.find((r => r.name === roleName))
                if (guildRole) {
                    if (config.effectiveRoles.includes(guildRole.id)) { msg.channel.send('Cannot give or remove effective roles'); return }
                    const memberRole = msg.member?.roles.cache.find((r => r.name === roleName))
                    if (action === 'Give') {
                        if (!memberRole) {
                            msg.member?.roles.add(guildRole)
                            msg.channel.send(`Gave role ${guildRole.name} to ${msg.member}`)
                            return
                        }
                        msg.channel.send(`${msg.member} already possess role ${guildRole.name}`)
                        return
                    }
                    if (action === 'Remove') {
                        if (memberRole) {
                            msg.member?.roles.remove(guildRole)
                            msg.channel.send(`Taken role ${guildRole.name} from ${msg.member}`)
                            return
                        }
                        msg.channel.send(`${msg.member} dose not have role ${guildRole.name}`)
                    }
                }
                msg.channel.send('Role not found')
                return
            }
            msg.channel.send('Invalid arguments')
        }
    }
}