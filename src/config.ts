import dotenv from 'dotenv'
dotenv.config()

interface GetEnvFlags {
  entry: string
  parse?: boolean
  required?: boolean
}

function getEnv({entry, parse = false, required = true}: GetEnvFlags) {
  const env = process.env[entry]
  if (env === undefined) {
    if (required) {
    throw new Error(`Missing confing entry for ${entry}`)
  }
  return undefined
  }
  if (parse) {
    return JSON.parse(env)
  }
  return env
}

function getUrl() {
  const dburl = getEnv({ entry: 'DATABASE_URL', required: false})
  if (dburl) {
    return dburl
  }
  const dbHost = getEnv({ entry: 'POSTGRESQL_URL'})
  const dbUser = getEnv({ entry: 'POSTGRES_USER'})
  const dbPassw = getEnv({ entry: 'POSTGRESQL_PASSWORD'})
  const dbPort = getEnv({ entry: 'POSTGRESQL_PORT_NUMBER'})
  return `postgresql://${dbUser}:${dbPassw}@${dbHost}:${dbPort}/mydb?schema=public`
}

export default {
    discordToken: getEnv({ entry: 'discordToken'}),
    telegramToken: getEnv({ entry: 'telegramToken'}),
    admins: getEnv({ entry: 'admins', parse: true}),
    mods: getEnv({ entry: 'mods', parse: true}),
    prefix: getEnv({ entry: 'prefix'}),
    voiceTextChnList: getEnv({ entry: 'voiceTextChnList', parse: true}),
    voiceChannleJoinMsg: getEnv({ entry: 'voiceChannleJoinMsg'}),
    effectiveRoles: getEnv({ entry: 'effectiveRoles', parse: true}),
    dbUrl: getUrl()
  }