import * as config from '../config.json'
import client from  "./djsClient"
import Message from './adapter'
import contains, {commandData} from '../listenerMap'
import type { TextChannel, VoiceState, Activity } from 'discord.js'

client.login(config.discordToken)

// on rdy
client.on('ready', () => {
    if(client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
        //client.user.setAvatar('./logo.png')

        // delete old cmds
        client.guilds.cache.get('196376973084327936')?.commands.fetch().then(
          (cmd) => {
            cmd.forEach(elm => {
              client.guilds.cache.get('196376973084327936')?.commands.delete(elm)
            });
          }
        )

        // add new cmds
        commandData.forEach(command => {
          // client.application?.commands.create(command);
          client.guilds.cache.get('196376973084327936')?.commands.create(command);
          
        });
    }
})

// on msg
  client.on('message', msg => {
    const w0bMsg = new Message(msg, msg.content)
    if (!msg.author.bot) {
      if (w0bMsg.hasCommand) {
        contains("cmdTriggers", w0bMsg)
      } else if (!contains("hear", w0bMsg)){
        contains("globalHear", w0bMsg)
      }
    }
  })

  // on interaction
  client.on('interaction', interaction => {
    if (!interaction.isCommand()) return;
    const inputs:  string[] = []
    interaction.options.forEach(opt => {
      if (opt.value) {
        inputs.push(opt.value.toString())
      }

    })
    const w0bMsg = new Message(interaction, `${interaction.commandName} ${inputs.join(' ')}`)
    if (!interaction.channel) return;
    contains("name", w0bMsg)
  });

  // on voice
  async function overwriteTextChPermission (textCH: string, voiceState: VoiceState, view: boolean) {
    try {
      if (voiceState.member) {
      const channel = await voiceState.guild.channels.resolve(textCH)
      if (!((channel): channel is TextChannel => channel?.type === 'text')(channel)) return;
      await channel.updateOverwrite(voiceState?.member.id, {VIEW_CHANNEL: view})
      if (view) {
        await channel.send(`${voiceState.member} ${config.voiceChannleJoinMsg}`)
      }
    }
  } catch(err) {
    console.error(err)
  }
}

const voiceTextMap = new Map(Object.entries(config.voiceTextChnList))

  client.on('voiceStateUpdate', (oldState, newState) => {

    if ((newState.member?.user.bot) || (oldState.member?.user.bot)) {
      return
    }

    if ((newState.channelID) && (!oldState.channelID)) {
      const newChn = voiceTextMap.get(newState.channelID)
      if (newChn) {
        overwriteTextChPermission(newChn, newState, true)
      }
      return
    }

    if ((!newState.channelID) && (oldState.channelID)) {
      const oldChn = voiceTextMap.get(oldState.channelID)
      if (oldChn) {
        overwriteTextChPermission(oldChn, newState, false)
      }
      return
    }

    if ((newState.channelID) && (oldState.channelID)) {
      const oldChn = voiceTextMap.get(oldState.channelID)
      const newChn = voiceTextMap.get(newState.channelID)
      if (oldChn) {
        if (newState.channelID === oldState.channelID) {return}
        overwriteTextChPermission(oldChn, newState, false)
      }
      if (newChn) {
        if (newState.channelID === oldState.channelID) {return}
        overwriteTextChPermission(newChn, newState, true)
      }
      return
    }
  })

// presence
function upperCaseString (string: string) {
  const rolename = string.toLowerCase();
  return rolename.charAt(0).toUpperCase() + rolename.slice(1);
}

  client.on('presenceUpdate', (oldPresence, newPresence) => {
    newPresence.activities.forEach((activity: Activity) => {
      if (activity.type === 'PLAYING') {
        const game = upperCaseString(activity.name)
        const guildRole = newPresence.guild?.roles.cache.find((r => r.name === game))
        if (guildRole) {
          if (config.effectiveRoles.includes(guildRole.id)) {return}
          const memberRole = newPresence.member?.roles.cache.find((r => r.name === game))
          if (!memberRole) {
            newPresence.member?.roles.add(guildRole)
          }
        }
      }
    })
  })