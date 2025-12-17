const { cmd } = require("../command");
const getFbVideoInfo = require("@xaviabot/fb-downloader");

cmd({
    pattern: "fb",
    alias: ["facebook"],
    react: "📥",
    desc: "Download Facebook Videos with Message Edit.",
    category: "download",
    filename: __filename,
}, async (zanta, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❤️ *කරුණාකර Facebook වීඩියෝ ලින්ක් එකක් ලබා දෙන්න.*");

        const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
        if (!fbRegex.test(q)) return reply("☹️ *ලින්ක් එක වැරදියි.*");

        // මුලින්ම පණිවිඩය යවා එහි ID එක ලබා ගනී
        const sentMsg = await zanta.sendMessage(from, { text: "❤️ *Downloading your video...*" }, { quoted: mek });

        const result = await getFbVideoInfo(q);
        if (!result || (!result.sd && !result.hd)) {
            // අසාර්ථක වුවහොත් පණිවිඩය Edit කරයි
            return await zanta.sendMessage(from, { text: "☹️ *Failed to download video.*", edit: sentMsg.key });
        }

        const currentBotName = global.CURRENT_BOT_SETTINGS.botName;
        const bestUrl = result.hd || result.sd;
        const quality = result.hd ? "HD" : "SD";

        // බාගත කිරීම අවසන් වූ පසු පණිවිඩය Edit කිරීම
        await zanta.sendMessage(from, { text: "✅ *Download Completed! Sending video...*", edit: sentMsg.key });

        const desc = `╭━─━─━─━─━─━──━╮\n┃ *${currentBotName} FB Downloader*\n╰━─━─━─━─━─━──━╯\n\n👻 *Quality*: ${quality}`;

        // Logo එක යැවීම
        await zanta.sendMessage(from, {
            image: { url: "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/fb.jpg?raw=true" },
            caption: desc,
        }, { quoted: mek });

        // වීඩියෝව යැවීම
        await zanta.sendMessage(from, {
            video: { url: bestUrl },
            caption: `*📥 Quality: ${quality}*\n\n> *© ${currentBotName}*`,
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});
