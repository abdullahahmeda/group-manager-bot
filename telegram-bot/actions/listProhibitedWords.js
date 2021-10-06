const bot = require('../bot')
const db = require('../../db')

function listProhibitedWords (chatId) {
  try {
    const stmt = db.prepare('SELECT * FROM prohibited_words')
    const prohibitedWords = stmt.all()
    if (prohibitedWords.length > 0) {
      bot.sendMessage(
        chatId,
                  `
              الكلمات المحظورة: 
${prohibitedWords
  .map(
      (wordObj) =>
          `${wordObj.word} ${
              wordObj.punishment === 'kick' ? '(تؤدي للحظر المباشر)' : ''
          }`
  )
  .join('\n')}
              `
      )
    } else bot.sendMessage(chatId, '(لا يوجد كلمات محظورة)')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = listProhibitedWords
