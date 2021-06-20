/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Player } from 'discord-player'
import Discord from 'discord.js'
import client from  "./djsClient"

const player = new Player(client);

export default player

player

// Send a message when a track starts
.on('trackStart', (message: { channel: { send: (arg0: string) => any; }; }, track: { title: any; }) => message.channel.send(`Now playing ${track.title}...`))

// Send a message when something is added to the queue
.on('trackAdd', (message: { channel: { send: (arg0: string) => any; }; }, _queue: any, track: { title: any; }) => message.channel.send(`${track.title} has been added to the queue!`))
// Send messages to format search results
.on('searchResults', (message: { channel: { send: (arg0: any) => void; }; }, query: any, tracks: any) => {

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Here are your search results for ${query}!`)
    .setDescription(tracks.map((t: { title: any; }, i: any) => `${i + 1}. ${t.title}`).join('\n'))
    .setFooter('Send the number of the song you want to play!')
    message.channel.send(embed);

})
.on('searchInvalidResponse', (message: { channel: { send: (arg0: string) => void; }; }, _query: any, tracks: string | any[], content: string, collector: { stop: () => void; }) => {

    if (content === 'cancel') {
        collector.stop()
        return message.channel.send('Search cancelled!')
    }

    message.channel.send(`You must send a valid number between 1 and ${tracks.length}!`)

})
.on('searchCancel', (message: { channel: { send: (arg0: string) => any; }; }, _query: any, _tracks: any) => message.channel.send('You did not provide a valid response... Please send the command again!'))
.on('noResults', (message: { channel: { send: (arg0: string) => any; }; }, query: any) => message.channel.send(`No results found on YouTube for ${query}!`))

// Send a message when the music is stopped
.on('queueEnd', (message: { channel: { send: (arg0: string) => any; }; }, _queue: any) => message.channel.send('Music stopped as there is no more music in the queue!'))
.on('channelEmpty', (message: { channel: { send: (arg0: string) => any; }; }, _queue: any) => message.channel.send('Music stopped as there is no more member in the voice channel!'))
.on('botDisconnect', (message: { channel: { send: (arg0: string) => any; }; }) => message.channel.send('Music stopped as I have been disconnected from the channel!'))

// Error handling
.on('error', (error: any, message: { channel: { send: (arg0: string) => void; }; }) => {
    switch(error){
        case 'NotPlaying':
            message.channel.send('There is no music being played on this server!')
            break;
        case 'NotConnected':
            message.channel.send('You are not connected in any voice channel!')
            break;
        case 'UnableToJoin':
            message.channel.send('I am not able to join your voice channel, please check my permissions!')
            break;
        case 'LiveVideo':
            message.channel.send('YouTube lives are not supported!')
            break;
        case 'VideoUnavailable':
            message.channel.send('This YouTube video is not available!');
            break;
        default:
            message.channel.send(`Something went wrong... Error: ${error}`)
    }
})