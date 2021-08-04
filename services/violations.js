const myEmitter = require("./events");

/**
 *
 * @param {TelegramBot} bot A telegram bot instance
 * @param {TelegramBot.Message} msg The message object
 * @param {Database} db The database instance
 */
const onURLViolation = (bot, msg, db) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderId = msg.from.id;

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
        senderId,
        db,
        reason: "telegram_url",
    });
};

/**
 *
 * @param {TelegramBot} bot A telegram bot instance
 * @param {TelegramBot.Message} msg The message object
 * @param {Database} db The database instance
 */
const onProhibitedViolation = (bot, msg, db) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderId = msg.from.id;

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
        senderId,
        db,
        reason: "prohibited_word",
    });
};

/**
 *
 * @param {TelegramBot} bot A telegram bot instance
 * @param {TelegramBot.Message} msg The message object
 * @param {Database} db The database instance
 */
const onMentionViolation = (bot, msg, db) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderId = msg.from.id;

    bot.deleteMessage(chatId, messageId);

    const senderName = msg.from.last_name
        ? `${msg.from.first_name} ${msg.from.last_name}`
        : msg.from.first_name;
    const message = `
    ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>أسماء الحسابات والقروبات ممنوعة</strong>
    `;

    bot.sendMessage(chatId, message, { parse_mode: "html" });
    myEmitter.emit("add_alert_to_member", { senderId, db, reason: "mention" });
};

exports.onURLViolation = onURLViolation;
exports.onProhibitedViolation = onProhibitedViolation;
exports.onMentionViolation = onMentionViolation;
