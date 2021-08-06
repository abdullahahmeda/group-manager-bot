const EventEmitter = require("events");
const db = require("../db");
const bot = require("../bot");
const { startJob, stopJob, setJobPeriod } = require("./jobs");

const myEmitter = new EventEmitter();

myEmitter.on("add_alert_to_member", ({ msg, reason }) => {
    const senderId = msg.from.id + "";
    const chatId = msg.chat.id;
    let arReason;
    let punishment;

    if (reason === "prohibited_word") {
        arReason = `كلمة محظورة`;
    } else if (reason === "mention") {
        arReason = `أسماء الحسابات والقروبات ممنوعة`;
    } else if (reason === "telegram_url") {
        arReason = `وضع رابط خارجي`;
    }

    const senderName = msg.from.last_name
        ? `${msg.from.first_name} ${msg.from.last_name}`
        : msg.from.first_name;

    let stmt = db.prepare(
        `INSERT INTO alerts (telegram_id, reason) VALUES (?, ?)`
    );
    stmt.run(senderId, reason);

    stmt = db.prepare(`SELECT * FROM alerts WHERE telegram_id = ?`);
    const alerts = stmt.all(senderId);

    stmt = db.prepare(`SELECT * FROM settings WHERE key = ?`);
    const maxAllowedAlerts = stmt.get("max_alerts").value;

    punishment = `تحذير (${
        alerts.length % maxAllowedAlerts
    }/${maxAllowedAlerts})`;
    if (alerts.length % +maxAllowedAlerts === 0) {
        try {
            punishment = `حظر من المجموعة`;
            bot.kickChatMember(chatId, senderId);
        } catch (error) {
            console.log(`Couldn't kick the member`);
            console.log(error);
        }
    }
    const message = `
    ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>${arReason}</strong>
العقوبة: ${punishment}
    `;
    bot.sendMessage(chatId, message, { parse_mode: "html" });
});

let latestMessage = null;
const callbackMessages = {
    add_prohibited_word: "إضافة كلمة محظورة",
    list_prohibited_words: "رؤية الكلمات المحظورة",
    remove_prohibited_word: "حذف كلمة من الكلمات المحظورة",
    edit_automatic_message_text: "تعديل نص الرسالة التلقائية",
    edit_automatic_message_period: "تعديل مدة الرسالة التلقائية",
    edit_max_allowed_alerts: "تعديل أقصى عدد من الانذارات قبل الحظر",

    enable_automatic_message: "تفعيل الرسالة التلقائية",
    disable_automatic_message: "إيقاف الرسالة التلقائية",

    waiting_prohibited_message: "اكتب الكلمة المراد إضافتها",
    waiting_automatic_message_text: "اكتب الرسالة الجديدة",
    waiting_automatic_message_period:
        "اكتب رقم بين 1 و 24 ليتم التكرار كل عدد معين من الساعات",
    waiting_removed_prohibited_message: "اكتب الكلمة المراد حذفها",
    waiting_max_allowed_alerts:
        "اكتب أكبر عدد من الانذارات قبل الحظر (رقم أكبر من 1)",
};

myEmitter.on("admin_message", ({ msg }) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    const keyboard = [
        [
            {
                text: callbackMessages.add_prohibited_word,
            },
            {
                text: callbackMessages.list_prohibited_words,
            },
            {
                text: callbackMessages.remove_prohibited_word,
            },
        ],
        [
            {
                text: callbackMessages.edit_automatic_message_text,
            },
            {
                text: callbackMessages.edit_automatic_message_period,
            },
            {
                text: callbackMessages.edit_max_allowed_alerts,
            },
        ],
        [
            {
                text: callbackMessages.enable_automatic_message,
            },
            {
                text: callbackMessages.disable_automatic_message,
            },
        ],
    ];

    if (latestMessage) {
        if (latestMessage == callbackMessages.waiting_prohibited_message) {
            try {
                const stmt = db.prepare(
                    `INSERT INTO prohibited_words VALUES (?)`
                );
                stmt.run(messageText.trim());
                bot.sendMessage(chatId, "تم إضافة الكلمة بنجاح");
            } catch (error) {
                console.log(error);
                bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
            }
        } else if (
            latestMessage == callbackMessages.waiting_removed_prohibited_message
        ) {
            try {
                const stmt = db.prepare(
                    `DELETE FROM prohibited_words WHERE word = ?`
                );
                stmt.run(messageText.trim());
                bot.sendMessage(chatId, "تم حذف الكلمة بنجاح");
            } catch (error) {
                console.log(error);
                bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
            }
        } else if (
            latestMessage == callbackMessages.waiting_automatic_message_text
        ) {
            try {
                const stmt = db.prepare(
                    `UPDATE settings SET value = ? WHERE key = 'automatic_message_text'`
                );
                stmt.run(messageText);
                bot.sendMessage(chatId, "تم تحديث الرسالة بنجاح");
            } catch (error) {
                console.log(error);
                bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
            }
        } else if (
            latestMessage == callbackMessages.waiting_automatic_message_period
        ) {
            const period = parseInt(messageText);
            if (isNaN(period) || period > 24 || period < 1) {
                bot.sendMessage(chatId, "يجب أن يتم ادخال رقم بين 1 و 24");
            } else {
                try {
                    const stmt = db.prepare(
                        `UPDATE settings SET value = ? WHERE key = 'automatic_message_repetition_period'`
                    );
                    stmt.run(period);
                    setJobPeriod(period);
                    bot.sendMessage(chatId, "تم التحديث بنجاح");
                } catch (error) {
                    console.log(error);
                    bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
                }
            }
        } else if (
            latestMessage == callbackMessages.waiting_max_allowed_alerts
        ) {
            const max_allowed_alerts = parseInt(messageText);
            if (isNaN(max_allowed_alerts) || max_allowed_alerts < 1) {
                bot.sendMessage(chatId, "يجب أن يتم ادخال رقم أكبر من 1");
            } else {
                try {
                    const stmt = db.prepare(
                        `UPDATE settings SET value = ? WHERE key = 'max_alerts'`
                    );
                    stmt.run(max_allowed_alerts + "");
                    bot.sendMessage(chatId, "تم التحديث بنجاح");
                } catch (error) {
                    console.log(error);
                    bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
                }
            }
        }
        latestMessage = null;
        return;
    }

    switch (messageText) {
        case callbackMessages.add_prohibited_word:
            bot.sendMessage(
                chatId,
                callbackMessages.waiting_prohibited_message
            );
            latestMessage = callbackMessages.waiting_prohibited_message;
            break;
        case callbackMessages.list_prohibited_words:
            try {
                const stmt = db.prepare(`SELECT * FROM prohibited_words`);
                let prohibited_words = stmt.all();
                prohibited_words = prohibited_words.map(
                    (wordObj) => wordObj.word
                );
                bot.sendMessage(
                    chatId,
                    `
                الكلمات المحظورة: 
${prohibited_words.join("\n")}
                `
                );
            } catch (error) {
                console.log(error);
                bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
            }
            break;
        case callbackMessages.remove_prohibited_word:
            bot.sendMessage(
                chatId,
                callbackMessages.waiting_removed_prohibited_message
            );
            latestMessage = callbackMessages.waiting_removed_prohibited_message;
            break;
        case callbackMessages.edit_automatic_message_text:
            bot.sendMessage(
                chatId,
                callbackMessages.waiting_automatic_message_text
            );
            latestMessage = callbackMessages.waiting_automatic_message_text;
            break;
        case callbackMessages.edit_automatic_message_period:
            bot.sendMessage(
                chatId,
                callbackMessages.waiting_automatic_message_period
            );
            latestMessage = callbackMessages.waiting_automatic_message_period;
            break;
        case callbackMessages.edit_max_allowed_alerts:
            bot.sendMessage(
                chatId,
                callbackMessages.waiting_max_allowed_alerts
            );
            latestMessage = callbackMessages.waiting_max_allowed_alerts;
            break;
        case callbackMessages.enable_automatic_message:
            try {
                const stmt = db.prepare(
                    `UPDATE settings SET value = ? WHERE key = 'automatic_message_status'`
                );
                stmt.run("enabled");
                startJob();
                bot.sendMessage(chatId, "تم تفعيل الرسالة التلقائية");
            } catch (error) {
                console.log(error);
                bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
            }
            break;
        case callbackMessages.disable_automatic_message:
            try {
                const stmt = db.prepare(
                    `UPDATE settings SET value = ? WHERE key = 'automatic_message_status'`
                );
                stmt.run("disabled");
                stopJob();
                bot.sendMessage(chatId, "تم إيقاف الرسالة التلقائية");
            } catch (error) {
                console.log(error);
                bot.sendMessage(chatId, "حدث خطأ ما. يرجى إعادة المحاولة");
            }
            break;
        default:
            bot.sendMessage(chatId, "ماذا تريد أن تفعل؟", {
                reply_markup: { keyboard },
            });
            break;
    }
});

module.exports = myEmitter;
