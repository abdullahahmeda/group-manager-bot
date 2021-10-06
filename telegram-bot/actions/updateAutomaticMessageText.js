const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')

function updateAutomaticMessageText (msg) {
  const chatId = msg.chat.id
  const messageText = (msg.photo ? msg.caption : msg.text) || ''
  const messagePhoto = msg.photo ? msg.photo[0].file_id : null

  try {
    const stmt = db.prepare(
      'UPDATE settings SET value = ? WHERE key = ?'
    )
    stmt.run(messageText, settingsKeys.automatic_message_text)
    if (messagePhoto) {
      const stmt = db.prepare(
        'UPDATE settings SET value = ? WHERE key = ?'
      )
      stmt.run(messagePhoto, settingsKeys.automatic_image_id)
    }
    bot.sendMessage(chatId, 'تم تحديث الرسالة بنجاح')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = updateAutomaticMessageText
