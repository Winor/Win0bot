import { Telegraf } from 'telegraf'
import config from '../config'
const bot = new Telegraf(config.telegramToken)
export default bot