import type { Interaction, Message } from "discord.js";
import w0bMessage from "../Message"

function isMsg(src: Message | Interaction): src is Message {
    return (src as Message).attachments !== undefined;
  }

export default class extends w0bMessage {
    raw: Message | Interaction

    constructor(raw: Message | Interaction, msg: string) {
        super(msg, "discord")
        this.raw = raw
    }

    async back (msg: string): Promise<Message | void> {
        if (isMsg(this.raw)) {
            return await this.raw.channel.send(msg);
        }
        if (!this.raw.isCommand()) return;
        return await this.raw.reply(msg)
    }

    async edit (oldMsg: Message, newMsg: string): Promise<Message> {
        return await oldMsg.edit(newMsg);
    }
}