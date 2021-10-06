const bot = require('../bot')
const addAcceptedLink = require('../actions/addAcceptedLink')
const addProhibitedMessage = require('../actions/addProhibitedMessage')
const removeProhibitedMessage = require('../actions/removeProhibitedMessage')
const updateAutomaticMessagePeriod = require('../actions/updateAutomaticMessagePeriod')
const updateAutomaticMessageText = require('../actions/updateAutomaticMessageText')
const updateMaxAllowedAlerts = require('../actions/updateMaxAllowedAlerts')
const enableAutomaticMessage = require('../actions/enableAutomaticMessage')
const listProhibitedWords = require('../actions/listProhibitedWords')
const disableAutomaticMessage = require('../actions/disableAutomaticMessage')
const showAutomaticMessage = require('../actions/showAutomaticMessage')
const updateRemoveEnterAndLeaveMessages = require('../actions/updateRemoveEnterAndLeaveMessages')
const addAllowedForward = require('../actions/addAllowedForward')
const listAllowedForwards = require('../actions/listAllowedForwards')
const removeAllowedForward = require('../actions/removeAllowedForward')

let waitingUserInput = null
const replies = {
  addProhibitdWord: 'إضافة كلمة محظورة عادية',
  waitingInputForAddProhibitdWord: 'اكتب الكلمة المراد إضافتها',

  addExtraProhibitedWord: 'إضافة كلمة محظورة تؤدي للحظر المباشر',
  waitingInputForAddExtraProhibitedWord: 'اكتب الكلمة المراد إضافتها',

  listProhibitedWords: 'رؤية الكلمات المحظورة',

  removeProhibitedWord: 'حذف كلمة من الكلمات المحظورة',
  waitingInputForRemoveProhibitedWord: 'اكتب الكلمة المراد حذفها',

  editAutomaticMessageText: 'تعديل الرسالة التلقائية',
  waitingInputForEditAutomaticMessageText: 'اكتب الرسالة الجديدة (يمكنك إضافة صورة أيضاً)',

  editAutomaticMessagePeriod: 'تعديل مدة الرسالة التلقائية',
  waitingInputForEditAutomaticMessagePeriod:
        'اكتب رقم بين 1 و 24 ليتم التكرار كل عدد معين من الساعات',

  editMaxAllowedAlerts: 'تعديل أقصى عدد من الانذارات قبل الحظر',
  waitingInputForEditMaxAllowedAlerts:
        'اكتب أكبر عدد من الانذارات قبل الحظر (رقم أكبر من 1)',

  addAcceptedLink: 'إضافة رابط استثنائي (لا يؤدي للعقوبة)',
  waitingInputForAddAcceptedLink: 'اكتب رابط القناة أو المجموعة المستثناة',

  addAllowedForward: 'إضافة يوزرنيم للتحويل',
  waitingInputForAddAllowedForward: 'اكتب اليوزرنيم (بدون علامة @)',

  listAllowedForwards: 'رؤية اليوزرات المقبول منها التحويل',

  removeAllowedForward: 'حذف يوزر من التحويل',
  waitingInputForRemoveAllowedForward: 'اكتب اليوزرنيم المراد حذفه',

  enableAutomaticMessage: 'تفعيل الرسالة التلقائية',

  disableAutomaticMessage: 'إيقاف الرسالة التلقائية',

  showAutomaticMessage: 'عرض الرسالة التلقائية',

  enableRemoveEnterAndLeaveMessages: 'تفعيل حذف رسائل الدخول والخروج من المجموعة',

  disableRemoveEnterAndLeaveMessages: 'إيقاف حذف رسائل الدخول والخروج من المجموعة'
}

const keyboard = [
  [
    { text: replies.addProhibitdWord },
    { text: replies.addExtraProhibitedWord },
    { text: replies.listProhibitedWords },
    { text: replies.removeProhibitedWord }
  ],
  [
    { text: replies.enableAutomaticMessage },
    { text: replies.disableAutomaticMessage },
    { text: replies.editAutomaticMessageText },
    { text: replies.editAutomaticMessagePeriod },
    { text: replies.showAutomaticMessage }
  ],
  [
    { text: replies.editMaxAllowedAlerts },
    { text: replies.enableRemoveEnterAndLeaveMessages },
    { text: replies.disableRemoveEnterAndLeaveMessages }
    // { text: replies.addAcceptedLink }
  ],
  [
    { text: replies.addAllowedForward },
    { text: replies.listAllowedForwards },
    { text: replies.removeAllowedForward }
  ]
]

function handleAdminMessage (msg) {
  const chatId = msg.chat.id
  const messageText = msg.text

  if (waitingUserInput) {
    if (waitingUserInput === 'waitingInputForAddProhibitdWord') addProhibitedMessage(msg)
    else if (waitingUserInput === 'waitingInputForAddExtraProhibitedWord') addProhibitedMessage(msg, 'kick')
    else if (waitingUserInput === 'waitingInputForRemoveProhibitedWord') removeProhibitedMessage(msg)
    else if (waitingUserInput === 'waitingInputForEditAutomaticMessageText') updateAutomaticMessageText(msg)
    else if (waitingUserInput === 'waitingInputForEditAutomaticMessagePeriod') updateAutomaticMessagePeriod(msg)
    else if (waitingUserInput === 'waitingInputForEditMaxAllowedAlerts') updateMaxAllowedAlerts(msg)
    else if (waitingUserInput === 'waitingInputForAddAcceptedLink') addAcceptedLink(msg)
    else if (waitingUserInput === 'waitingInputForAddAllowedForward') addAllowedForward(msg)
    else if (waitingUserInput === 'waitingInputForRemoveAllowedForward') removeAllowedForward(msg)
    else bot.sendMessage(chatId, 'حدث خطأ ما.')
    waitingUserInput = null
    return
  }

  if (messageText === replies.addProhibitdWord) waitForInput(chatId, 'addProhibitdWord')
  else if (messageText === replies.addExtraProhibitedWord) waitForInput(chatId, 'addExtraProhibitedWord')
  else if (messageText === replies.removeProhibitedWord) waitForInput(chatId, 'removeProhibitedWord')
  else if (messageText === replies.editAutomaticMessageText) waitForInput(chatId, 'editAutomaticMessageText')
  else if (messageText === replies.editAutomaticMessagePeriod) waitForInput(chatId, 'editAutomaticMessagePeriod')
  else if (messageText === replies.editMaxAllowedAlerts) waitForInput(chatId, 'editMaxAllowedAlerts')
  else if (messageText === replies.addAcceptedLink) waitForInput(chatId, 'addAcceptedLink')
  else if (messageText === replies.addAllowedForward) waitForInput(chatId, 'addAllowedForward')
  else if (messageText === replies.removeAllowedForward) waitForInput(chatId, 'removeAllowedForward')
  else if (messageText === replies.listProhibitedWords) listProhibitedWords(chatId)
  else if (messageText === replies.listAllowedForwards) listAllowedForwards(chatId)
  else if (messageText === replies.enableAutomaticMessage) enableAutomaticMessage(chatId)
  else if (messageText === replies.disableAutomaticMessage) disableAutomaticMessage(chatId)
  else if (messageText === replies.showAutomaticMessage) showAutomaticMessage(chatId)
  else if (messageText === replies.enableRemoveEnterAndLeaveMessages) updateRemoveEnterAndLeaveMessages(chatId, 'enabled')
  else if (messageText === replies.disableRemoveEnterAndLeaveMessages) updateRemoveEnterAndLeaveMessages(chatId, 'disabled')
  else {
    bot.sendMessage(chatId, 'ماذا تريد أن تفعل؟', {
      reply_markup: { keyboard }
    })
  }
}

function waitForInput (chatId, input) {
  input = input[0].toUpperCase() + input.slice(1)
  const waiting = `waitingInputFor${input}`
  bot.sendMessage(
    chatId,
    replies[waiting]
  )
  waitingUserInput = waiting
}

module.exports = handleAdminMessage
