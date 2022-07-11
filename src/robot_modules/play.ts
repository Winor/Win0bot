/* eslint-disable @typescript-eslint/no-unused-vars */
import { Interaction, GuildMember, Snowflake, Message, MessageSelectMenu, MessageActionRow, SelectMenuInteraction } from 'discord.js';
import {
    AudioPlayerStatus,
    AudioResource,
    DiscordGatewayAdapterCreator,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import Commend from '../Commend'
import type w0bMessage from '../discord/adapter'
//
import { Track } from '../discord/music/track';
import { MusicSubscription } from '../discord/music/subscription';
import subscriptions from '../discord/music/'
import ytsr, { Video } from 'ytsr'


export default class Play extends Commend {
    constructor() {
        super({
            name: 'play',
            cmd: ['play', 'ply'],
            hear: [],
            globalHear: [],
            platform: "discord",
            discord: {
                options: [{
                name: 'song',
                type: 'STRING' as const,
                description: 'The URL of the song to play',
                required: true,
            }]
        }
        })
    }

    async run(msg: w0bMessage): Promise<void> {
        try {
            if (msg.guildId) {
                let subscription = subscriptions.get(msg.guildId);
                await msg.defer()
                // Extract the video URL from the command
                const input = msg.args.slice(1).join(' ')
                let url = ''
                //cheak if URL or serch
                if (!input.includes('https://')) {
                    const filter = await ytsr.getFilters(input);
                    const videos = filter.get('Type')?.get('Video')
                    if(videos && videos.url) {
                    const searchResults = await ytsr(videos.url, {limit: 8});
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('select')
                                .setPlaceholder('Nothing selected')
                                .addOptions(searchResults.items.map((item, i) =>({ label: (item as Video).title, value: (item as Video).url })))
                                )
                    const newMsg = await msg.followUp({ content: 'Select a song to play...', components: [row] }) as Message | Interaction
                    const discordInput = await msg.collector(newMsg)
                    if (discordInput?.componentType === "SELECT_MENU") {
                    url = (discordInput as SelectMenuInteraction).values[0]
                    await discordInput.update({ content:'Ok.', components: [] })
                    } else {
                        url = input
                    }

                }

                }
                // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
                // and create a subscription.
                if ((!subscription) || (subscription?.queueLock)) {
                    if (msg.raw.member instanceof GuildMember && msg.raw.member.voice.channel) {
                        const channel = msg.raw.member.voice.channel;
                        subscription = new MusicSubscription(
                            joinVoiceChannel({
                                channelId: channel.id,
                                selfDeaf: false,
                                guildId: channel.guild.id,
                                adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
                            }),
                        );
                        subscription.voiceConnection.on('error', console.warn);
                        subscriptions.set(msg.guildId, subscription);
                    }
                }
                // If there is no subscription, tell the user they need to join a channel.
                if (!subscription) {
                    await msg.followUp('Join a voice channel and then try that again!');
                    return;
                }
                try {
                    await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
                } catch (error) {
                    console.warn(error);
                    await msg.followUp('Failed to join voice channel within 20 seconds, please try again later!');
                    return;
                }
                try {
                    // Attempt to create a Track from the user's video URL
                    const track = await Track.from(url, {
                        onStart() {
                            msg.followUp({ content: 'Now playing!', ephemeral: true }).catch(console.warn);
                        },
                        onFinish() {
                            msg.followUp({ content: 'Now finished!', ephemeral: true }).catch(console.warn);
                        },
                        onError(error) {
                            console.warn(error);
                            msg.followUp({ content: `Error: ${error.message}`, ephemeral: true }).catch(console.warn);
                        },
                    });
                    // Enqueue the track and reply a success message to the user
                    subscription.enqueue(track);
                    await msg.followUp(`Enqueued **${track.title}**`);
                } catch (error) {
                    console.warn(error);
                    await msg.back('Failed to play track, please try again later!');
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}