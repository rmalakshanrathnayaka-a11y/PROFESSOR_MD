// plugins/aliveMsg.js

function getAliveMessage() {

    // config අගයන් වෙනුවට භාවිතා කළ යුතු placeholders
    const messageTemplate = `*{BOT_NAME} 𝐈𝐒 𝐎𝐍𝐋𝐈𝐍𝐄 💞*\n\n*╭────♡◉◉◉♡────⌬*\n💖 *Hey...I’m {BOT_NAME}🙃, your lovely assistant — alive and sparkling now!*\n*╰────♡◉◉◉♡────⌬*\n\n*📅 Date: ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}*\n*⌚ Time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}*\n*───────────────*\n\n*📱 Number: {OWNER_NUMBER}*\n*💬 Prefix: .* *───────────────*\n*🌐 Contact Zanta*\n> http://wa.me/+94743404814?text=*Hey__ZANTA*\n\n> *© ZANTA-MD WA BOT*`;

    return messageTemplate;
}

module.exports = {
    getAliveMessage: getAliveMessage,
};
