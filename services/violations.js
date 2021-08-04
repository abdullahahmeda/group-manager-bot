const myEmitter = require("./events");
const bot = require("../bot");

/**
 *
 * @param {TelegramBot.Message} msg The message object
 */
const onURLViolation = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    bot.deleteMessage(chatId, messageId);

    const senderName = msg.from.last_name
        ? `${msg.from.first_name} ${msg.from.last_name}`
        : msg.from.first_name;
    const message = `
    ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>وضع رابط خارجي</strong>
    `;

    bot.sendMessage(chatId, message, { parse_mode: "html" });
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

    bot.deleteMessage(chatId, messageId);

    const senderName = msg.from.last_name
        ? `${msg.from.first_name} ${msg.from.last_name}`
        : msg.from.first_name;
    const message = `
    ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>كلمة محظورة</strong>
    `;

    bot.sendMessage(chatId, message, { parse_mode: "html" });
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

    bot.deleteMessage(chatId, messageId);

    const senderName = msg.from.last_name
        ? `${msg.from.first_name} ${msg.from.last_name}`
        : msg.from.first_name;
    const message = `
    ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>أسماء الحسابات والقروبات ممنوعة</strong>
    `;

    bot.sendMessage(chatId, message, { parse_mode: "html" });
    myEmitter.emit("add_alert_to_member", { msg, reason: "mention" });
};

exports.onURLViolation = onURLViolation;
exports.onProhibitedViolation = onProhibitedViolation;
exports.onMentionViolation = onMentionViolation;
