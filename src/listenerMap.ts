import type { ApplicationCommandData } from 'discord.js';
import fs from 'fs'
import { w0bMessage } from './types';
const listen = new Map();
export const commandData:ApplicationCommandData[] = []

fs.readdir(`${__dirname}/robot_modules`, (err, files) => {
    try{
        files.forEach(async file => {
            if(file.endsWith('js')) {
                const cmdFile = await import(`${__dirname}//robot_modules//${file}`)
                const cmd = new cmdFile.default

                if(cmd.platform !== "telegram") {
                    commandData.push({
                        name: cmd.name,
                        description: cmd.description ? cmd.description : "Runs a command"
                    })  
                }
                
                if((cmd.hear) && (cmd.cmdTriggers)) {
                    const newArray = cmd.hear.concat(cmd.cmdTriggers)
                    listen.set(newArray,cmd)
                    return
                } 
                if(cmd.cmdTriggers) {
                    listen.set(cmd.cmdTriggers, cmd)
                    return
                }
                if(cmd.hear) {
                    listen.set(cmd.hear, cmd)
                    return
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
      })

function contains(msg: w0bMessage): string {
    for (const [key, value] of listen) {
        if (key.includes(msg.magicWord)) {
            if ((value.platform === msg.platform) || (value.platform === "any"))
            value.run(msg)
        }
    }
    return 'invalid command'
}

export default contains