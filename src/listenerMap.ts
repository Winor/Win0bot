import fs from 'fs'
import Commend from './Commend';
import { w0bMessage, ApplicationCommandData } from './types';
//const listen = new Map();
const commands: Commend[] = []
export const commandData:ApplicationCommandData[] = []

fs.readdir(`${__dirname}/robot_modules`, (err, files) => {
    try{
        files.forEach(async file => {
            if(file.endsWith('js')) {
                try {
                    const cmdFile = await import(`${__dirname}//robot_modules//${file}`)
                const cmd = new cmdFile.default

                if(cmd.platform !== "telegram") {
                    commandData.push({
                        name: cmd.name,
                        description: cmd.description ? cmd.description : "Runs a command",
                        options: cmd.discord
                    })  
                }
                commands.push(cmd)
                } catch (err) {
                    console.error(`Module ${file} err: ${err}`)
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
      })

function contains(type: "hear" | "cmdTriggers" | "name" | "globalHear", msg: w0bMessage): boolean {

        for (const cmd of commands) {

            if(type === 'globalHear') {
                for (const term of cmd.globalHear) {
                    if (msg.content.includes(term)){
                        cmd.run(msg)
                        return true
                    }
                }
            }
            
            if (msg.hasCommand) {
                if (cmd[type].includes(msg.hasCommand)) {
                    cmd.run(msg)
                    return true
                }            
            }

            if (cmd[type].includes(msg.args[0])) {
                cmd.run(msg)
                return true
            }  
        }
    return false
}

export default contains