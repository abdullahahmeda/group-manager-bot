const { thanksPhrases } = require('../../constants')
const bot = require('../bot')

function handleThanksMessage (msg, thankPhrase) {
  const chatId = msg.chat.id

  try {
    bot.sendMessage(chatId, thanksPhrases[thankPhrase], {
      parse_mode: 'html',
      reply_to_message_id: msg.message_id
    })
  } catch (error) { console.log(error) }
}

module.exports = handleThanksMessage
