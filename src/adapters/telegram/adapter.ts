import type { Context } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { MountMap } from "telegraf/typings/telegram-types";
import w0bMessage from "../../Message"

export default class extends w0bMessage {
    raw: Context<MountMap["text"]>
    
    constructor(msg: Context<MountMap["text"]>) {
        super(msg.message.text, "telegram")
        this.raw = msg
    }

    async back (msg: string): Promise<Message.TextMessage> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.raw.reply(msg)
    }

    async backPhoto (photo: string | Buffer, text?: string): Promise<Message.TextMessage> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.raw.replyWithPhoto({source: photo}, { caption: text })
    }

    async edit (oldMsg: Message.TextMessage, newMsg: string): Promise<true | (Message.TextMessage)> {
        return await this.raw.telegram.editMessageText(oldMsg.chat.id, oldMsg.message_id, undefined, newMsg)
    }

    async defer(): Promise<unknown> {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.raw.reply('Thinking.... this might take a while.')
    }

}
