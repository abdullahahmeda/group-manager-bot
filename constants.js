const path = require('path')

const paths = {
  root: __dirname,
  webserver: path.resolve(__dirname, 'webserver'),
  telegramBot: path.resolve(__dirname, 'telegram-bot'),
  automaticReplies: path.resolve(__dirname, 'automatic_replies.json')
}

const settingsKeys = {
  max_alerts: 'max_alerts',
  automatic_message_status: 'automatic_message_status',
  automatic_message_text: 'automatic_message_text',
  automatic_image_id: 'automatic_image_id',
  automatic_message_repetition_period: 'automatic_message_repetition_period',
  delete_enter_and_leave_messages: 'delete_enter_and_leave_messages'
}

module.exports = {
  settingsKeys,
  paths
}
