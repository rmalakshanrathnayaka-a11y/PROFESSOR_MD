const { cmd } = require("../command");
const { ytmp4, ytmp3 } = require("@vreden/youtube_scraper");
const yts = require("yt-search");
const axios = require('axios');
const { sleep } = require("../lib/functions");

// --- 🛠️ Core Helper Function ---
async function downloadYoutubeVreden(url, format, zanta, from, mek, reply, data) {
    if (!url) return reply("❌ Invalid YouTube URL.");

    let durationParts = data.timestamp.split(":").map(Number);
    let totalSeconds = durationParts.length === 3 
        ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2] 
        : durationParts[0] * 60 + durationParts[1];

    // සීමාවන් පරීක්ෂාව
    if (format === 'mp4' && totalSeconds > 600) return reply("⏳ *වීඩියෝව විනාඩි 10 කට වඩා වැඩි බැවින් බාගත කළ නොහැක.*");
    if (format === 'mp3' && totalSeconds > 3600) return reply("⏳ *සින්දුව විනාඩි 60 කට වඩා වැඩි බැවින් බාගත කළ නොහැක.*");

    const botName = global.CURRENT_BOT_SETTINGS.botName;
    let tempMsg;

    try {
        let quality = (format === 'mp4') ? '360' : '192';
        tempMsg = await reply(`*📥 Downloading ${format.toUpperCase()}...*\n\n🎬 *Title:* ${data.title}\n⭐ *Quality:* ${quality}p`);

        let finalData = (format === 'mp4') ? await ytmp4(url, quality) : await ytmp3(url, quality);

        if (!finalData || !finalData.download || !finalData.download.url) {
            return await zanta.sendMessage(from, { text: "❌ *බාගත කිරීමේ ලින්ක් එක ලබා ගැනීමට නොහැකි විය.*", edit: tempMsg.key });
        }

        // Axios හරහා Buffer එක ලබා ගැනීම
        const response = await axios.get(finalData.download.url, { responseType: 'arraybuffer', timeout: 60000 });
        const mediaBuffer = response.data;

        const caption = `*✅ Download Complete!*\n\n🎬 *Title:* ${data.title}\n\n> *© ${botName}*`;

        if (format === 'mp4') {
            await zanta.sendMessage(from, { video: mediaBuffer, caption: caption, mimetype: 'video/mp4' }, { quoted: mek });
        } else {
            await zanta.sendMessage(from, { audio: mediaBuffer, mimetype: 'audio/mpeg' }, { quoted: mek });
        }

        return await zanta.sendMessage(from, { text: `*වැඩේ හරි 🙃✅*`, edit: tempMsg.key });

    } catch (e) {
        console.error(e);
        if (tempMsg) await zanta.sendMessage(from, { text: `❌ *Error:* ${e.message}`, edit: tempMsg.key });
    }
}

// --- 🎞️ YT MP4 Command ---
cmd({
    pattern: "ytmp4",
    alias: ["video", "vid"],
    react: "🎞️",
    desc: "Download YouTube videos.",
    category: "download",
    filename: __filename,
}, async (zanta, mek, m, { from, reply, q }) => {
    if (!q) return reply("❌ *කරුණාකර YouTube ලින්ක් එකක් හෝ සෙවිය යුතු නම ලබා දෙන්න.*");
    const search = await yts(q);
    if (!search.videos[0]) return reply("❌ *වීඩියෝව සොයාගත නොහැකි විය.*");
    await downloadYoutubeVreden(search.videos[0].url, 'mp4', zanta, from, mek, reply, search.videos[0]);
});

// --- 🎶 YT MP3 Command ---
cmd({
    pattern: "ytmp3",
    alias: ["ytaudio", "song2"],
    react: "🎶",
    desc: "Download YouTube audio.",
    category: "download",
    filename: __filename,
}, async (zanta, mek, m, { from, reply, q }) => {
    if (!q) return reply("❌ *කරුණාකර YouTube ලින්ක් එකක් හෝ සෙවිය යුතු නම ලබා දෙන්න.*");
    const search = await yts(q);
    if (!search.videos[0]) return reply("❌ *වීඩියෝව සොයාගත නොහැකි විය.*");
    await downloadYoutubeVreden(search.videos[0].url, 'mp3', zanta, from, mek, reply, search.videos[0]);
});
