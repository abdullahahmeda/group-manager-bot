const jsonfile = require('jsonfile')
const { paths } = require('../../constants')
const bot = require('../bot')

function handleThanksMessage (msg, mentionReplyIndex) {
  const chatId = msg.chat.id

  jsonfile.readFile(paths.mentionReplies)
    .then(data => {
      try {
        bot.sendMessage(chatId, data[mentionReplyIndex].message, {
          parse_mode: 'html',
          reply_to_message_id: msg.message_id
        })
      } catch (error) { console.log(error) }
    })
}

module.exports = handleThanksMessage
