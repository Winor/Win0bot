import type Discord from 'discord.js'
import type { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { MessageSubType, UpdateType } from "telegraf/typings/telegram-types";

interface w0bMessage {
    content: string
    hasPrefix: boolean
    msgArray: string[]
    args: string[]
    text: string
    hasCommand: string | false
    raw: Discord.Message | Context<MountMap["text"]> | Interaction
    platform: "discord" | "telegram"
}

type MountMap = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [T in UpdateType]: Extract<Update, Record<T, object>>
  } &
    {
      [T in MessageSubType]: {
        message: Extract<Update.MessageUpdate['message'], Record<T, unknown>>
        update_id: number
      }
    }

    // interface ApplicationCommandOptionData {
    //   type: ApplicationCommandOptionType | ApplicationCommandOptionTypes;
    //   name: string;
    //   description: string;
    //   required?: boolean;
    //   choices?: ApplicationCommandOptionChoice[];
    //   options?: this[];
    // }

    // interface ApplicationCommandData {
    //   name: string;
    //   description: string;
    //   options?: ApplicationCommandOptionData[];
    //   defaultPermission?: boolean;
    // }