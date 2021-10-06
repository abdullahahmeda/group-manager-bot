const { paths } = require('../../constants')
const bot = require('../bot')
const jsonfile = require('jsonfile')

function answerCallbackQuery (msg) {
  if (msg.data.indexOf('automatic_reply') === 0) {
    const dataArr = msg.data.split('-')
    const replyIndex = dataArr[1]
    const responseIndex = dataArr[2]
    jsonfile.readFile(paths.automaticReplies)
      .then(data => {
        bot.answerCallbackQuery(msg.id)
        bot.editMessageText(`
<strong>${data[replyIndex].responses[responseIndex].title}</strong>

${data[replyIndex].responses[responseIndex].content}
        `, {
          chat_id: msg.message.chat.id,
          message_id: msg.message.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: data[replyIndex].responses.map((reply, index) => ([{ text: reply.title, callback_data: `automatic_reply-${replyIndex}-${index}` }]))
          }
        })
      })
  }
}

module.exports = answerCallbackQuery
