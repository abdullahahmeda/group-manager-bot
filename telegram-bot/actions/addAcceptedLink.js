const bot = require('../bot')
const db = require('../../db')

function addAcceptedLink (msg) {
  const chatId = msg.chat.id
  const messageText = msg.text

  if (messageText) {
    try {
      const stmt = db.prepare(
        'INSERT INTO accepted_links (link) VALUES (?)'
      )
      stmt.run(messageText.trim())
      bot.sendMessage(chatId, 'تم اضافة الرابط بنجاح')
    } catch (error) {
      console.log(error)
      bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
    }
  } else bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
}

module.exports = addAcceptedLink
