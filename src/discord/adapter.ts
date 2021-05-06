import type { Message } from "discord.js";
import w0bMessage from "../Message"

export default class extends w0bMessage {
    raw: Message

    constructor(msg: Message) {
        super(msg.content)
        this.raw = msg
    }

    async back (msg: string): Promise<Message> {
        return await this.raw.channel.send(msg);
    }

    async edit (oldMsg: Message, newMsg: string): Promise<Message> {
        return await oldMsg.edit(newMsg);
    }
}