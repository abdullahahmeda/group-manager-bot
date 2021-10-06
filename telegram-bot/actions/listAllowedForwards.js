const bot = require('../bot')
const db = require('../../db')

function listAllowedForwards (chatId) {
  try {
    const stmt = db.prepare('SELECT * FROM allowed_forwards')
    const allowedForwards = stmt.all()
    if (allowedForwards.length > 0) {
      bot.sendMessage(
        chatId,
                  `
              اليوزرات المقبول تحويل الرسائل منهم: 
${allowedForwards
  .map(
      (user) =>
          `${user.username}`
  )
  .join('\n')}
              `
      )
    } else bot.sendMessage(chatId, '(لا يوجد عضويات يقبل منها النحويل)')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = listAllowedForwards
