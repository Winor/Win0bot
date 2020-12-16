import type Discord from 'discord.js'

interface w0bMessage extends Discord.Message {
    hasPrefix: boolean
    args: string[]
    hasCommand: string | false
}

interface w0bClientEvents extends Discord.ClientEvents  {
    message: [w0bMessage];
}

interface w0bClient extends Discord.Client {
    public on<K extends keyof w0bClientEvents>(event: K, listener: (...args: w0bClientEvents[K]) => void): this;
}