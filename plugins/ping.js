const { cmd } = require("../command");
const os = require('os');
const { runtime, sleep } = require('../lib/functions'); 
const config = require("../config"); // BOT_NAME ලබා ගැනීමට

// Image URL එක මෙහි ඇත
const STATUS_IMAGE_URL = "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/alive-new.jpg?raw=true";

// Helper function to format bytes to a readable string
function bytesToSize(bytes) {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes === 0) return '0 Byte';
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

cmd(
{
pattern: "ping",
react: "⚙️",
desc: "Display bot information.",
category: "main", 
filename: __filename,
},
async (
zanta,
mek,
m,
{
from,
reply,
}
) => {
try {
// 1. Response Time Calculation - Start Time
const startTime = Date.now();
// පළමු reply එක යවයි (මෙය ක්‍රියාත්මක වන්නේ නම්, දෙවන පණිවිඩයද ක්‍රියාත්මක විය යුතුය)
await reply("*⚙️ Bot තොරතුරු එකතු කරමින්...*"); 

// 2. System and Bot Data Collection
const memoryUsage = process.memoryUsage(); 
const totalMemory = os.totalmem();
const freeMemory = os.freemem();

let pm2_details = "";

if (process.env.NODE_APP_INSTANCE !== undefined) {
pm2_details = `
*┃ ⏳ Uptime:* ${runtime(process.uptime())}
*┃ ⚙️ Process Mode:* PM2 (Managed)
`;
} else {
pm2_details = `
*┃ ⏳ Uptime:* ${runtime(process.uptime())}
*┃ ⚙️ Process Mode:* Standard
`;
}

// 3. Latency calculation - End Time
const endTime = Date.now();
const latency = endTime - startTime;

            // 4. Bot Name, fallback to ZANTA-MD
            const botName = config.BOT_NAME || "ZANTA-MD"; 

// 5. Constructing the formatted Reply Message (Caption)
const statusMessage = `
*╭━━━*「 *${botName} STATUS* 」*━━━╮*
*┃ ⏱️ Response Time:* ${latency} ms
${pm2_details}
*┃ 🌐 Platform:* ${os.platform()}
*┃ 💻 Node Version:* ${process.version}
*╰━━━━━━━━━━━━━━━━━━╯*

*╭━━━*「 *System Resources* 」*━━━╮*
*┃ 🧠 Process RAM:* ${bytesToSize(memoryUsage.rss)}
*┃ 📊 Total System RAM:* ${bytesToSize(totalMemory)}
*┃ 📊 Free System RAM:* ${bytesToSize(freeMemory)}
*╰━━━━━━━━━━━━━━━━━━╯*
`;

// 6. Send the final formatted message WITH IMAGE (Image එක යැවීම)
await zanta.sendMessage(from, {
image: { url: STATUS_IMAGE_URL }, // 🖼️ Image URL එක මෙතනින් යවනවා
caption: statusMessage // 📝 Message එක Caption එක ලෙස යවනවා
}, { quoted: mek });

} catch (e) {
console.error("[STATUS ERROR]", e);
reply(`*🚨 Error:* Bot තොරතුරු ලබා ගැනීමට අසමත් විය. දෝෂය: ${e.message}`);
}
}
);
