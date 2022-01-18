import config from '../config'
import client from  "./djsClient"
import Message from './adapter'
import * as db from '../db'
import contains from '../listenerMap'
import type { VoiceState, Activity, GuildMember, PartialGuildMember } from 'discord.js'
client.login(config.discordToken)

// on rdy
client.on('ready', () => {
    if(client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
        //client.user.setAvatar('./logo.png')

        // // delete old cmds
        // client.guilds.cache.get('196376973084327936')?.commands.fetch().then(
        //   (cmd) => {
        //     cmd.forEach(elm => {
        //       client.guilds.cache.get('196376973084327936')?.commands.delete(elm)
        //     });
        //   }
        // ).finally(
        //   () => {
        //     // add new cmds
        // commandData.forEach(command => {
        //   // client.application?.commands.create(command);
        //   client.guilds.cache.get('196376973084327936')?.commands.create(command);
          
        // });
        //   }
        // )
        client.guilds.cache.get('196376973084327936')?.members.fetch().then(
          (members) => {
            members.forEach(createUser)
          }
        )
        
    }
})

// db stuff
async function isUser(id: string): Promise<boolean> {
  return await db.findUser({discordId: id}) ? true : false
}

async function createUser(user: GuildMember) {
  try {
    if (!await isUser(user.id)) {
      await db.createUser({
        discordId: user.id,
        name: user.displayName
    })
  }
  } catch(error) {
    console.log(error)
  }
  
}

async function deleteUser(user: GuildMember | PartialGuildMember) {
  try {
    if (await isUser(user.id)) {
      await db.deleteUser({discordId: user.id})
  }
  } catch(error) {
    console.log(error)
  }
  
}

client.on('guildMemberAdd', user => {
createUser(user)
})

client.on('guildMemberRemove', user => {
  deleteUser(user)
  })

// on msg
  client.on('messageCreate', msg => {
    const w0bMsg = new Message(msg)
    if (!msg.author.bot) {
      if (w0bMsg.hasCommand) {
        contains("cmdTriggers", w0bMsg)
      } else if (!contains("hear", w0bMsg)){
        contains("globalHear", w0bMsg)
      }
    }
  })

  // on interaction
  client.on('interactionCreate', interaction => {
    if ((interaction.isCommand()) || (interaction.isContextMenu())) {
      const w0bMsg = new Message(interaction)
      if (!interaction.channel) return;
      contains("name", w0bMsg)
    }
    // const inputs:  string[] = []
    // interaction.options.forEach(opt => {
    //   if (opt.value) {
    //     inputs.push(opt.value.toString())
    //   }

    // })
  });

  // on voice
  async function overwriteTextChPermission (textCH: `${bigint}`, voiceState: VoiceState, view: boolean) {
    try {
      if (voiceState.member) {
      const channel = await voiceState.guild.channels.cache.get(textCH)
      if (channel?.type !== 'GUILD_TEXT') return;
      await channel.permissionOverwrites.edit(voiceState?.member.id, {VIEW_CHANNEL: view})
      if (view) {
        if (channel.isText()){
        await channel.send(`${voiceState.member} ${config.voiceChannleJoinMsg}`)
        }
      }
    }
  } catch(err) {
    console.error(err)
  }
}

const voiceTextMap = new Map(Object.entries(config.voiceTextChnList))

async function getNotifyList(): Promise<Map<string, string[]> | undefined> {
  const notifyList = await db.getAllStore('notify')
  const notifyMap: Map<string, string[]> = new Map()

  if (!notifyList) return

  notifyList.forEach((member) => {
    (member.data as string[]).forEach((user) => {
      if (!notifyMap.has(user)) {
        if (member.user.discordId) {
        notifyMap.set(user, [member.user.discordId])
      }
      } else {
        const list = notifyMap.get(user)
        if ((member.user.discordId) && (list)) {
        list?.push(member.user.discordId)
        notifyMap.set(user, list)
        }
      }
    })
  })
  return notifyMap
}

async function notify (oldState: VoiceState, newState: VoiceState) {
  if ((newState.channelId) && (!oldState.channelId)) {
  const notifyList = await getNotifyList()
    if (notifyList) {
    for (const [key, value] of notifyList) {
      if (key === newState.member?.id) {
        value.forEach(async (user) => {
          const clientUser = await client.users.fetch(user)
          if((newState.channel?.permissionsFor(clientUser)?.has("VIEW_CHANNEL") && (!newState.channel?.members.has(clientUser.id)))) {
          clientUser.send(`Your friend <@${key}> just joined ${newState.channel} over at ${newState.guild}\n ${'```'} To stop notifications for this user right click on his name over at ${newState.guild} server and select apps>notify again${'```'}`)
        }
        })
      }
  }
}
}
}

function privateRooms (oldState: VoiceState, newState: VoiceState) {
  if ((newState.member?.user.bot) || (oldState.member?.user.bot)) {
    return
  }

  if ((newState.channelId) && (!oldState.channelId)) {
    const newChn = voiceTextMap.get(newState.channelId) as `${bigint}`
    if (newChn) {
      overwriteTextChPermission(newChn, newState, true)
    }
    return
  }

  if ((!newState.channelId) && (oldState.channelId)) {
    const oldChn = voiceTextMap.get(oldState.channelId) as `${bigint}`
    if (oldChn) {
      overwriteTextChPermission(oldChn, newState, false)
    }
    return
  }

  if ((newState.channelId) && (oldState.channelId)) {
    const oldChn = voiceTextMap.get(oldState.channelId) as `${bigint}`
    const newChn = voiceTextMap.get(newState.channelId) as `${bigint}`
    if (oldChn) {
      if (newState.channelId === oldState.channelId) {return}
      overwriteTextChPermission(oldChn, newState, false)
    }
    if (newChn) {
      if (newState.channelId === oldState.channelId) {return}
      overwriteTextChPermission(newChn, newState, true)
    }
    return
  }
}

  client.on('voiceStateUpdate', (oldState, newState) => {
    // private rooms
    privateRooms(oldState, newState)
    
    // notify
    notify(oldState, newState)
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