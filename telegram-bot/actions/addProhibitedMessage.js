const bot = require('../bot')
const db = require('../../db')

function addProhibitedMessage (msg, punsihment = 'alert') {
  const chatId = msg.chat.id
  const messageText = msg.text

  try {
    const stmt = db.prepare(
      'INSERT INTO prohibited_words (word, punishment) VALUES (?, ?)'
    )
    stmt.run(messageText.trim(), punsihment)
    bot.sendMessage(chatId, 'تم إضافة الكلمة بنجاح')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = addProhibitedMessage
