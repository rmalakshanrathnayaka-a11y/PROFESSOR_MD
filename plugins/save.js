const { cmd } = require("../command");
const { getContentType } = require("@whiskeysockets/baileys"); 

// 🖼️ SAVE View Once Image Command
cmd(
{
pattern: "save",
react: "💾",
desc: "Saves and resends a View Once image.",
category: "media",
filename: __filename,
},
async (zanta, mek, m, { from, reply }) => {
try {
if (!m.quoted) {
return reply("කරුණාකර *View Once Image* පණිවිඩයක් Reply කරන්න.");
}

const quotedObject = m.quoted;

// msg.js මගින් De-wrap වූ Inner Message Object එක ගනී
const innerMessage = quotedObject.msg || quotedObject.message; 

if (!innerMessage) {
return reply(`❌ Reply කළ පණිවිඩයේ දත්ත සොයා ගැනීමට නොහැක.`);
}

// 1. 🚨 FINAL CHECK: View Once Message එකක් දැයි පරීක්ෂා කිරීම (නවතම Baileys යතුර)
            // msg.js මගින් De-wrap කළ image object එකේ 'viewOnce: true' තිබිය යුතුය.
            if (!innerMessage.viewOnce) {
                // එය View Once Message එකක් නොවේ නම්, Type එක පෙන්වමු.
                const type = innerMessage.type || getContentType(innerMessage);
                return reply(`මෙය *View Once Image* පණිවිඩයක් නොවේ. (Actual Type: ${type})`);
            }

            // 2. Image එකක්දැයි පරීක්ෂා කිරීම
const actualMessageType = innerMessage.type || getContentType(innerMessage);

if (actualMessageType !== 'imageMessage') {
return reply("කරුණාකර *Image* එකක් Reply කරන්න.");
}

reply("💾 View Once Image එක Download කරමින්...");

// 3. Media Buffer එක Download කිරීම
// m.quoted.download() මගින් Inner Image Data එක කෙලින්ම ගනී.
const mediaBuffer = await quotedObject.download();

if (!mediaBuffer || mediaBuffer.length === 0) {
return reply("❌ Image එක Download කිරීමට නොහැකි විය.");
}

// 4. Image එක නැවත Chat එකට යැවීම
await zanta.sendMessage(
from,
{
image: mediaBuffer,
caption: `🖼️ *Saved View Once Image*\nSender: @${quotedObject.sender.split('@')[0]}`,
mentions: [quotedObject.sender]
},
{ quoted: mek }
);

await zanta.sendMessage(from, { react: { text: '✅', key: mek.key } });

} catch (e) {
console.error("Save Command Error:", e);
reply(`*Error:* Save කිරීමේදී දෝෂයක් සිදුවිය. ${e.message}`);
}
}
);
