const bot = require('../bot')
const db = require('../../db')

function addAllowedForward (msg) {
  const chatId = msg.chat.id
  const messageText = msg.text

  if (messageText) {
    try {
      const stmt = db.prepare(
        'INSERT INTO allowed_forwards (username) VALUES (?)'
      )
      stmt.run(messageText.trim())
      bot.sendMessage(chatId, 'تم اضافة اليوزرنيم بنجاح. سيتم استقبال التحويلات منه.')
    } catch (error) {
      console.log(error)
      bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
    }
  } else bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
}

module.exports = addAllowedForward
