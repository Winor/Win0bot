import { Interaction, InteractionReplyOptions, Message, MessageActionRow, MessageButton, MessageButtonStyleResolvable, MessageComponentInteraction, MessagePayload, MessageSelectMenu } from "discord.js";
import config from '../config'
import { w0bMessage } from '../types';

class Adapter implements w0bMessage {
    raw: Message | Interaction
    btnCount: number
    platform: "discord"

    constructor(raw: Message | Interaction) {
        this.platform = "discord"
        this.raw = raw
        this.btnCount = -1
    }

    isMsg(src: Message | Interaction): src is Message {
        return (src as Message).content !== undefined;
    }

    get content(): string {
        if (this.isMsg(this.raw)) {
            return this.raw.content
        }
        if (!this.raw.isCommand()) return '';
        const inputs: string[] = []
        //?
        this.raw.options.data.forEach(opt => {
            if (opt.value) {
                inputs.push(opt.value.toString())
            }

        })
        return `${this.raw.commandName} ${inputs.join(' ')}`
    }

    get hasPrefix(): boolean {
        if (!this.content) { return false }
        return this.content.charAt(0) === config.prefix
    }

    get args(): string[] {
        if (!this.content) { return [] }
        return this.content.split(' ')
    }

    get hasCommand(): string | false {
        return (this.hasPrefix) ? this.args[0].replace(config.prefix, '') : false
    }

    get guildId(): string | null | undefined {
        if (this.isMsg(this.raw)) {
            return this.raw.guild?.id;
        }
        return this.raw.guildId
    }

    async back(msg: string | InteractionReplyOptions | MessagePayload): Promise<Message | void> {
        if (this.isMsg(this.raw)) {
            return await this.raw.channel.send(msg);
        }
        if (!this.raw.isCommand()) return;
        return await this.raw.reply(msg)
    }

    async edit(oldMsg: Message, newMsg: string): Promise<Message> {
        return await oldMsg.edit(newMsg);
    }

    async defer(): Promise<unknown> {
        if (!this.isMsg(this.raw)) {
            if (!this.raw.isCommand()) return;
            return await this.raw.deferReply();
        }
    }

    async followUp (msg: string | MessagePayload | InteractionReplyOptions): Promise<unknown> {
        if (!this.isMsg(this.raw)) {
            if (!this.raw.isCommand()) return;
            return this.raw.followUp(msg);
        }
        return this.raw.channel.send(msg)
    }

    // async followUp(msg: string | MessagePayload | InteractionReplyOptions): Promise<unknown> {
    //     try {
    //         if (!this.isMsg(this.raw)) {
    //             if (!this.raw.isCommand()) return;
    //             const newMsg = await this.raw.followUp(msg) as Message
    //             return new Adapter(newMsg)
    //         }
    //         const newMsg = await this.raw.channel.send(msg)
    //         return new Adapter(newMsg)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async collector(msg: Message | Interaction = this.raw): Promise<MessageComponentInteraction | undefined> {
        if (!this.isMsg(msg)) {
            if (!msg.isButton()) return;
            return msg.channel?.awaitMessageComponent({ time: 20000 });
        }
        return msg.awaitMessageComponent({ time: 20000 })
    }

    createRow(components: MessageButton[] | MessageSelectMenu[]): MessageActionRow {
        return new MessageActionRow().addComponents(components)
    }

    createBtn(lable: string, style: MessageButtonStyleResolvable = 'PRIMARY'): MessageButton {
        this.btnCount++
        return new MessageButton()
            .setCustomId(this.btnCount.toString())
            .setLabel(lable)
            .setStyle(style)
    }
}

export default Adapter