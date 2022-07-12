import { Interaction, InteractionReplyOptions, Message, MessageActionRow, MessageAttachment, MessageButton, MessageButtonStyleResolvable, MessageComponentInteraction, MessageOptions, MessagePayload, MessageSelectMenu } from "discord.js";
import w0bMessage from "../../Message"

    function isMsg(src: Message | Interaction): src is Message {
        return (src as Message).content !== undefined;
    }

    function content(raw: Message | Interaction): string {
        if (isMsg(raw)) {
            return raw.content
        }
        if (!raw.isCommand()) return '';
        const inputs: string[] = []
        //?
        raw.options.data.forEach(opt => {
            if (opt.value) {
                inputs.push(opt.value.toString())
            }

        })
        return `${raw.commandName} ${inputs.join(' ')}`
    }

class Adapter extends w0bMessage {
    raw: Message | Interaction
    btnCount: number
    isMsg: typeof isMsg

    constructor(raw: Message | Interaction) {
        super(content(raw), 'discord')
        this.raw = raw
        this.btnCount = -1
        this.isMsg = isMsg
    }

    get guildId(): string | null | undefined {
        if (this.isMsg(this.raw)) {
            return this.raw.guild?.id;
        }
        return this.raw.guildId
    }

    async back(msg: string | InteractionReplyOptions | MessagePayload | MessageOptions): Promise<Message | void> {
        if (this.isMsg(this.raw)) {
            return await this.raw.channel.send(msg as string | MessagePayload | MessageOptions);
        }
        if (this.raw.isCommand() || (this.raw.isContextMenu())){ 
        return await this.raw.reply(msg as InteractionReplyOptions)
        }
    }

    async backPhoto(photo: string | Buffer, text?: string): Promise<Message | void> {
        const file = new MessageAttachment(photo);
        if (this.isMsg(this.raw)) {
            return await this.raw.channel.send({files: [file], content: text });
        }
        if (this.raw.isCommand() || (this.raw.isContextMenu())){ 
        return await this.raw.reply({files: [file], content: text})
        }
    }

    async edit(oldMsg: Message, newMsg: string): Promise<Message> {
        return await oldMsg.edit(newMsg);
    }

    async defer(): Promise<unknown> {
        if (!this.isMsg(this.raw)) {
            if (this.raw.isCommand() || (this.raw.isContextMenu())){ 
            return await this.raw.deferReply();
        }
        }
    }

    async getTarget(): Promise<string | undefined> {
        if (!this.isMsg(this.raw)) {
            if (!this.raw.isContextMenu()) return;
            return await this.raw.targetId
        }
    }

    async followUp (msg: string | MessagePayload | InteractionReplyOptions): Promise<unknown> {
        if (!this.isMsg(this.raw)) {
            if (this.raw.isCommand() || (this.raw.isContextMenu())){ 
            return this.raw.followUp(msg);
            }
            return
        }
        return this.raw.channel.send(msg as string | MessagePayload | MessageOptions)
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