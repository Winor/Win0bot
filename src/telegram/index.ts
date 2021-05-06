import bot from  "./tgfClient"
import Message from './adapter'
import contains from '../listenerMap'

bot.on('text', (ctx) => {
  const w0bMsg = new Message(ctx)
    contains(w0bMsg)
  })

  bot.launch()