const { paths } = require('../../constants')
const bot = require('../bot')
const jsonfile = require('jsonfile')

function answerCallbackQuery (msg) {
  if (msg.data.indexOf('automatic_reply') === 0) {
    const dataArr = msg.data.split('-')
    const replyIndex = dataArr[1]
    const responseIndex = dataArr[2]
    const userId = dataArr[3]
    if (userId === `${msg.from.id}`) {
      jsonfile.readFile(paths.automaticReplies)
        .then(data => {
          bot.answerCallbackQuery(msg.id)
          bot.sendMessage(msg.message.chat.id, `
  <strong>${data[replyIndex].responses[responseIndex].title}</strong>

  ${data[replyIndex].responses[responseIndex].content}
          `, { parse_mode: 'HTML' })
        })
    } else bot.answerCallbackQuery(msg.id)
  }
}

module.exports = answerCallbackQuery
