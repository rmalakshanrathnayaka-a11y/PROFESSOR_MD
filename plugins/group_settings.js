const { cmd, commands } = require("../command");

const checkAdminRights = (reply, isGroup, isBotAdmins, isAdmins) => {
    if (!isGroup) {
        reply("*This command can only be used in a Group!* 🙁");
        return false;
    }
    if (!isBotAdmins) {
        reply("*I need to be an Admin in this group to use this command!* 🤖❌");
        return false;
    }
    if (!isAdmins) {
        reply("*You must be an Admin to change Group Settings!* 👮‍♂️❌");
        return false;
    }
    return true;
};

// --- MUTE/CLOSE COMMAND (Only Admins Can Send Messages) ---
cmd(
  {
    pattern: "mute",
    alias: ["close"],
    react: "🔒",
    desc: "Closes the group so only admins can send messages.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins }) => {
    try {
      if (!checkAdminRights(reply, isGroup, isBotAdmins, isAdmins)) return;

      reply("*Closing group for members... 🔒*");
      
      // Update the group setting to restrict messages to admins only
      await zanta.groupSettingUpdate(from, 'announcement');
      
      return reply(`*Group successfully closed! Only Admins can send messages now. 🤐✅*`);
      
    } catch (e) {
      console.error(e);
      reply(`*Error:* Failed to mute the group. ${e.message || e}`);
    }
  }
);

// --- UNMUTE/OPEN COMMAND (All Members Can Send Messages) ---
cmd(
  {
    pattern: "unmute",
    alias: ["open"],
    react: "🔓",
    desc: "Opens the group so all members can send messages.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins }) => {
    try {
      if (!checkAdminRights(reply, isGroup, isBotAdmins, isAdmins)) return;

      reply("*Opening group for all members... 🔓*");
      
      // Update the group setting to allow all members to send messages
      await zanta.groupSettingUpdate(from, 'not_announcement');
      
      return reply(`*Group successfully opened! All members can send messages now. 💬✅*`);
      
    } catch (e) {
      console.error(e);
      reply(`*Error:* Failed to unmute the group. ${e.message || e}`);
    }
  }
);

// --- INVITE LINK COMMAND ---
cmd(
  {
    pattern: "invite",
    alias: ["link"],
    react: "🔗",
    desc: "Gets the group invite link.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins }) => {
    try {
      if (!isGroup) {
        return reply("*This command can only be used in a Group!* 🙁");
      }
      
      // Bot must be an admin to generate the invite link
      if (!isBotAdmins) {
        return reply("*I need to be an Admin to generate the invite link!* 🤖❌");
      }
      
      reply("*Generating Invite Link... 🔗*");
      
      // Baileys function to get the group invite code
      const code = await zanta.groupInviteCode(from);
      
      if (!code) {
          return reply("*Failed to generate the invite link.* 😔");
      }

      const inviteLink = `https://chat.whatsapp.com/${code}`;
      
      await zanta.sendMessage(
        from,
        { 
          text: `*🔗 Group Invite Link:*\n\n${inviteLink}`,
        },
        { quoted: mek }
      );
      
      return reply("> *Done✅*");
      
    } catch (e) {
      console.error(e);
      // Catch error if the invite link was recently reset, etc.
      reply(`*Error:* Failed to fetch the invite link. ${e.message || e}`);
    }
  }
);
