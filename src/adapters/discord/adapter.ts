import { Interaction, InteractionReplyOptions, Message, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, MessageComponentInteraction, MessageOptions, MessagePayload, ButtonStyle, InteractionResponse, InteractionDeferReplyOptions } from "discord.js";
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
                if (opt.attachment) {
                    inputs.push(opt.attachment.url);
                    return
                }
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

    async back(msg: string | InteractionReplyOptions | MessagePayload | MessageOptions): Promise<Message<boolean> | InteractionResponse<boolean> | undefined> {
        if (this.isMsg(this.raw)) {
            return await this.raw.channel.send(msg as string | MessagePayload | MessageOptions);
        }
        if ((this.raw.isCommand()) || (this.raw.isContextMenuCommand())){ 
        return await this.raw.reply(msg as InteractionReplyOptions)
        }
    }

    async backPhoto(photo: string | Buffer, text?: string): Promise<unknown> {
        const file = new AttachmentBuilder(photo);
        if (this.isMsg(this.raw)) {
            return await this.raw.channel.send({files: [file], content: text });
        }
        if (this.raw.isCommand() || (this.raw.isContextMenuCommand())){ 
        return await this.raw.followUp({files: [file], content: text})
        }
    }

    async edit(oldMsg: Message, newMsg: string): Promise<Message> {
        return await oldMsg.edit(newMsg);
    }

    async defer(options?: InteractionDeferReplyOptions ): Promise<unknown> {
        if (!this.isMsg(this.raw)) {
            if (this.raw.isCommand() || (this.raw.isContextMenuCommand())){ 
            return await this.raw.deferReply(options);
        }
        }
    }

    async getTarget(): Promise<string | undefined> {
        if (!this.isMsg(this.raw)) {
            if (!this.raw.isContextMenuCommand()) return;
            return await this.raw.targetId
        }
    }

    async followUp (msg: string | MessagePayload | InteractionReplyOptions): Promise<unknown> {
        if (!this.isMsg(this.raw)) {
            if (this.raw.isCommand() || (this.raw.isContextMenuCommand())){ 
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

    createRow(components: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder> {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(components)
    }

    createBtn(lable: string, style: ButtonStyle = 1, url?: string): ButtonBuilder {
        this.btnCount++
        if (url) {
            return new ButtonBuilder()
                .setLabel(lable)
                .setStyle(5)
                .setURL(url)
        }
        return new ButtonBuilder()
        .setCustomId(this.btnCount.toString())
        .setLabel(lable)
        .setStyle(style)
    }
}

export default Adapter