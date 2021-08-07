const getArReason = (reason) => {
    let arReason;
    if (reason === "prohibited_word") {
        arReason = `كلمة محظورة`;
    } else if (reason === "mention") {
        arReason = `أسماء الحسابات والقروبات ممنوعة`;
    } else if (reason === "telegram_url") {
        arReason = `وضع رابط خارجي`;
    }
    return arReason;
};

module.exports = getArReason;
