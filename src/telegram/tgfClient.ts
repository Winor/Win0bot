import { Telegraf } from 'telegraf'
import * as config from '../config.json'
const bot = new Telegraf(config.telegramToken)
export default bot