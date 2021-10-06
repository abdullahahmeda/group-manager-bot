const jsonfile = require('jsonfile')
const { paths } = require('../../constants')
const bot = require('../bot')

function automaticReply (msg, automaticReplyIndex) {
  jsonfile.readFile(paths.automaticReplies)
    .then(data => {
      const automaticReplyObj = data[automaticReplyIndex].responses
      bot.sendMessage(process.env.TELEGRAM_GROUP_ID, data[automaticReplyIndex].message, {
        reply_markup: {
          inline_keyboard: automaticReplyObj.map((response, index) => ([{ text: response.title, callback_data: `automatic_reply-${automaticReplyIndex}-${index}` }]))
        }
      })
    })
}

module.exports = automaticReply
