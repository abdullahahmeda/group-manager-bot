const myEmitter = require("./events");
const bot = require("../bot");

/**
 *
 * @param {TelegramBot.Message} msg The message object
 */
const onURLViolation = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    console.log(`URL violation, trying to delete the message`);
    bot.deleteMessage(chatId, messageId);

    myEmitter.emit("add_alert_to_member", {
        msg,
        reason: "telegram_url",
    });
};

/**
 *
 * @param {TelegramBot.Message} msg The message object
 */
const onProhibitedViolation = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    console.log(`Prohibited word violation, trying to delete the message`);
    bot.deleteMessage(chatId, messageId);

    myEmitter.emit("add_alert_to_member", {
        msg,
        reason: "prohibited_word",
    });
};

/**
 *
 * @param {TelegramBot.Message} msg The message object
 */
const onMentionViolation = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    console.log(`Mention violation, trying to delete the message`);
    bot.deleteMessage(chatId, messageId);

    myEmitter.emit("add_alert_to_member", { msg, reason: "mention" });
};

exports.onURLViolation = onURLViolation;
exports.onProhibitedViolation = onProhibitedViolation;
exports.onMentionViolation = onMentionViolation;
