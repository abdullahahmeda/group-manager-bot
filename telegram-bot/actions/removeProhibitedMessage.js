const bot = require('../bot')
const db = require('../../db')

function removeProhibitedMessage (msg) {
  const chatId = msg.chat.id
  const messageText = msg.text

  try {
    const stmt = db.prepare(
      'DELETE FROM prohibited_words WHERE word = ?'
    )
    stmt.run(messageText.trim())
    bot.sendMessage(chatId, 'تم حذف الكلمة بنجاح')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = removeProhibitedMessage
