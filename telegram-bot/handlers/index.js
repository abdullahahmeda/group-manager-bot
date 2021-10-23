const enterAndLeaveMessages = require('./enterAndLeaveMessages')
const prohibitedWord = require('./prohibitedWord')
const extraProhibitedWord = require('./extraProhibitedWord')
const urlViolation = require('./urlViolation')
const adminMessage = require('./adminMessage')
const forwardedMessage = require('./forwardedMessage')
const automaticReply = require('./automaticReply')
const answerCallbackQuery = require('./answerCallbackQuery')
const mentionReply = require('./mentionReply')

module.exports = {
  enterAndLeaveMessages,
  prohibitedWord,
  extraProhibitedWord,
  urlViolation,
  adminMessage,
  forwardedMessage,
  automaticReply,
  answerCallbackQuery,
  mentionReply
}
