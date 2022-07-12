import bot from  "./tgfClient"
import Message from './adapter'
import contains from '../../listenerMap'

bot.on('text', (ctx) => {
  const w0bMsg = new Message(ctx)
  if (w0bMsg.hasCommand) {
    contains("cmdTriggers", w0bMsg)
  } else if (!contains("hear", w0bMsg)){
    contains("globalHear", w0bMsg)
  }
  })

  bot.launch()