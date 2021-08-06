const db = require("../db");

/**
 *
 * Returns whether a string contains a telegram URL or not
 *
 * @param {string} s
 * @returns {boolean}
 */
const containsTelegramURL = (s) => {
    const regex = /([https]+?:\/+)?[a-z0-9]*?\.?(telegram|t)\.me/i;
    return regex.test(s);
};

/**
 *
 * @param {string} s
 * @returns {boolean}
 */
const containsProhibited = (s) => {
    const stmt = db.prepare(`SELECT * FROM prohibited_words`);
    const words = stmt.all();
    for (let wordObj of words) {
        if (s.indexOf(wordObj.word) > -1) return true;
    }
    return false;
};

/**
 *
 * Returns whether the message contain a mention or not
 *
 * @param {TelegramBot.Message} msg The message object
 * @returns {boolean}
 */
const containsMention = (msg) => {
    const entities = msg.entities ? msg.entities : [];
    for (let entity of entities) {
        if (entity.type.indexOf("mention") > -1) return true;
    }
    return false;
};

exports.containsTelegramURL = containsTelegramURL;
exports.containsProhibited = containsProhibited;
exports.containsMention = containsMention;
