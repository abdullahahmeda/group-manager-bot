const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')

function showAutomaticMessage (chatId) {
  try {
    let stmt = db.prepare('SELECT * FROM settings WHERE key = ?')
    const automaticMessageText = stmt.get(settingsKeys.automatic_message_text).value
    stmt = db.prepare('SELECT * FROM settings WHERE key = ?')
    const automaticImage = stmt.get(settingsKeys.automatic_image_id).value
    if (automaticImage) {
      if (automaticMessageText) bot.sendPhoto(chatId, automaticImage, { caption: automaticMessageText })
      else bot.sendPhoto(chatId, automaticImage)
    } else {
      if (automaticMessageText.length === 0) bot.sendMessage(chatId, '(الرسالة فارغة)')
      else bot.sendMessage(chatId, automaticMessageText)
    }
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = showAutomaticMessage
