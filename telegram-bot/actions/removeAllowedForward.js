const bot = require('../bot')
const db = require('../../db')

function removeAllowedForward (msg) {
  const chatId = msg.chat.id
  const messageText = msg.text

  try {
    const stmt = db.prepare(
      'DELETE FROM allowed_forwards WHERE username = ?'
    )
    stmt.run(messageText.trim())
    bot.sendMessage(chatId, 'تم حذف اليوزر بنجاح. لا يمكنه تحويل رسائل الآن.')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = removeAllowedForward
