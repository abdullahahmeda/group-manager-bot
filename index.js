require('dotenv').config()
const { setupDB, setupJobs } = require('./setup')
const {
  containsTelegramURL,
  containsProhibited,
  containsAutomaticReply,
  containsThanks
} = require('./utils/check')

const handlers = require('./telegram-bot/handlers')

const bot = require('./telegram-bot/bot')
const db = require('./db')
const server = require('./webserver/server')
const scheduler = require('./scheduler')

try {
  setupDB(db)
  setupJobs(scheduler)
} catch (error) {
  console.log(error)
  process.exit(1)
}

console.log('Bot has started')

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`SERVER HAS STARTED AT ${PORT}`))

bot.on('new_chat_members', handlers.enterAndLeaveMessages)
bot.on('left_chat_member', handlers.enterAndLeaveMessages)

bot.on('callback_query', (msg) => handlers.answerCallbackQuery(msg))

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const messageText = msg.text

  if (`${chatId}` === `${process.env.TELEGRAM_GROUP_ID}`) {
    const thankPhrase = await containsThanks(msg)
    const prohibited = containsProhibited(messageText)
    const automaticReplyIndex = await containsAutomaticReply(msg)

    if (containsTelegramURL(msg)) return handlers.urlViolation(msg)
    else if (prohibited === 1) return handlers.prohibitedWord(msg)
    else if (prohibited === 2) return handlers.extraProhibitedWord(msg)

    if (msg.forward_date) handlers.forwardedMessage(msg)

    if (automaticReplyIndex !== null) handlers.automaticReply(msg, automaticReplyIndex)

    if (thankPhrase !== null) handlers.thanksMessage(msg, thankPhrase)
  } else if (`${chatId}` === `${process.env.TELEGRAM_ADMIN_ID}`) handlers.adminMessage(msg)
})

process.on('exit', () => db.close())

bot.on('polling_error', (err) => console.log(err))
