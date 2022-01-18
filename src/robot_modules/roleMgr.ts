import Commend from '../Commend'
import type w0bMessage from '../discord/adapter'

import config from '../config'
import { Message } from 'discord.js';

function upperCaseString(string: string) {
    const rolename = string.toLowerCase();
    return rolename.charAt(0).toUpperCase() + rolename.slice(1);
}

export default class Echo extends Commend {
    constructor() {
        super({
            name: 'role',
            cmd: ['role'],
            hear: [],
            globalHear: [],
            platform: "discord",
            discord: {
                options: [{
                    name: 'input',
                    type: 'STRING',
                    description: 'give/remove role name',
                    required: true,
                  }]
            }
        })
    }

    async run(msg: w0bMessage): Promise<void> {
        const dmsg = msg.raw as Message
        if (msg.args[1]) {
            const action = upperCaseString(msg.args[1])
            const isAction = (action === 'Give') || (action === 'Remove')
            const roleName = msg.args[2] ? upperCaseString(msg.args[2]) : false
            if (isAction && roleName) {
                const guildRole = dmsg.guild?.roles.cache.find((r => r.name === roleName))
                if (guildRole) {
                    if (config.effectiveRoles.includes(guildRole.id)) { msg.back('Cannot give or remove effective roles'); return }
                    const memberRole = dmsg.member?.roles.cache.find((r => r.name === roleName))
                    if (action === 'Give') {
                        if (!memberRole) {
                            dmsg.member?.roles.add(guildRole)
                            msg.back(`Gave role ${guildRole.name} to ${dmsg.member}`)
                            return
                        }
                        msg.back(`${dmsg.member} already possess role ${guildRole.name}`)
                        return
                    }
                    if (action === 'Remove') {
                        if (memberRole) {
                            dmsg.member?.roles.remove(guildRole)
                            msg.back(`Taken role ${guildRole.name} from ${dmsg.member}`)
                            return
                        }
                        msg.back(`${dmsg.member} dose not have role ${guildRole.name}`)
                    }
                }
                msg.back('Role not found')
                return
            }
            msg.back('Invalid arguments')
        }
    }
}