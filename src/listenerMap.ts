import fs from 'fs'
import { w0bMessage } from './types';
const listen = new Map();

fs.readdir(`${__dirname}/robot_modules`, (err, files) => {
    try{
        files.forEach(async file => {
            if(file.endsWith('js')) {
                const cmdFile = await import(`${__dirname}//robot_modules//${file}`)
                const cmd = new cmdFile.default
                if(cmd.hear) {
                    listen.set(cmd.hear,cmd)
                } else {
                    listen.set(cmd.cmdTriggers, cmd)
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
      })

function contains(msg: w0bMessage): string {
    for (const [key, value] of listen) {
        if (key.includes(msg.hasCommand)) {
            value.run(msg)
        }
    }
    return 'invalid command'
}

export default contains