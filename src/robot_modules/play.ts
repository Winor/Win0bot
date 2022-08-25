/* eslint-disable @typescript-eslint/no-unused-vars */
import { Interaction, GuildMember, Message, SelectMenuBuilder, ActionRowBuilder, SelectMenuInteraction, ComponentType, EmbedBuilder } from 'discord.js';
import {
    AudioPlayerStatus,
    AudioResource,
    DiscordGatewayAdapterCreator,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'
//
import { Track } from '../adapters/discord/music/track';
import { MusicSubscription } from '../adapters/discord/music/subscription';
import subscriptions from '../adapters/discord/music'
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
                type: 3,
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
                await msg.defer({ ephemeral: true })
                // Extract the video URL from the command
                const input = msg.text
                let url = ''
                //cheak if URL or serch
                if (!input.includes('https://')) {
                    const filter = await ytsr.getFilters(input);
                    const videos = filter.get('Type')?.get('Video')
                    if(videos && videos.url) {
                    const searchResults = await ytsr(videos.url, {limit: 8});
                    const row = new ActionRowBuilder<SelectMenuBuilder>()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId('select')
                                .setPlaceholder('Nothing selected')
                                .addOptions(searchResults.items.map((item, i) =>({ label: (item as Video).title, value: (item as Video).url })))
                                )
                    const newMsg = await msg.followUp({ ephemeral: true, content: 'Select a song to play...', components: [row] }) as Message | Interaction
                    const discordInput = await msg.collector(newMsg)
                    if (discordInput?.componentType === ComponentType.SelectMenu) {
                    url = (discordInput as SelectMenuInteraction).values[0]
                    await discordInput.update({ content:'Ok.', components: [] })
                    }
                }
            }
            else {
                url = input
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
                            const embed = new EmbedBuilder()
                            .setTitle(track.title)
                            .setAuthor({ name: 'Now Playing' })
                            .setDescription('Music Player')
                            .setColor('Green')
                            .setImage(track.thumbnail)
                            .setFooter({ text: `Requested by ${msg.raw.member?.user.username}`})
                            .setTimestamp();
                            msg.followUp({ embeds: [embed], ephemeral: false }).catch(console.warn);
                        },
                        onFinish() {
                            const embed = new EmbedBuilder()
                            .setTitle(track.title)
                            .setAuthor({ name: 'Finished playing' })
                            .setDescription('Music Player')
                            .setColor('Red')
                            .setImage(track.thumbnail)
                            .setFooter({ text: `Requested by ${msg.raw.member?.user.username}`})
                            .setTimestamp();
                            msg.followUp({ embeds: [embed], ephemeral: false }).catch(console.warn);
                        },
                        onError(error) {
                            console.warn(error);
                            msg.followUp({ content: `Error: ${error.message}`, ephemeral: true }).catch(console.warn);
                        },
                    });
                    // Enqueue the track and reply a success message to the user
                    subscription.enqueue(track);
                    // discord Embed
                    const embed = new EmbedBuilder()
                    .setTitle(track.title)
                    .setAuthor({ name: 'Enqueued' })
                    .setDescription('Music Player')
                    .setColor('Yellow')
                    .setImage(track.thumbnail)
                    .setFooter({ text: `Requested by ${msg.raw.member?.user.username}`})
                    .setTimestamp();
                    await msg.followUp({embeds: [embed]});
                } catch (error) {
                    console.warn(error);
                    await msg.followUp('Failed to play track, please try again later!');
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}