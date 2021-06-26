import dotenv from 'dotenv'
dotenv.config()

function getEnv(entry: string, parse?: boolean) {
  const env = process.env[entry]
  if (env === undefined) {
    throw new Error(`Missing confing entry for ${entry}`)
  }
  if (parse) {
    return JSON.parse(env)
  }
  return env
}

export default {
    discordToken: getEnv('discordToken'),
    telegramToken: getEnv('telegramToken'),
    admins: getEnv('admins', true),
    mods: getEnv('mods', true),
    prefix: getEnv('prefix'),
    voiceTextChnList: getEnv('voiceTextChnList', true),
    voiceChannleJoinMsg: getEnv('voiceChannleJoinMsg'),
    effectiveRoles: getEnv('effectiveRoles', true)
  }