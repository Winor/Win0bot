import Discord, { Intents } from 'discord.js'

const client = new Discord.Client({ intents: [Intents.ALL] });
export default client