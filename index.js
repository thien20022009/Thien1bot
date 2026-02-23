const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

async function askGemini(question) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

bot.on("message", async (msg) => {
  if (msg.text === "/start") {
    return bot.sendMessage(msg.chat.id, "Chào bạn! Hỏi mình bất cứ điều gì 🤖");
  }

  try {
    const reply = await askGemini(msg.text);
    bot.sendMessage(msg.chat.id, reply);
  } catch (err) {
    console.log(err);
    bot.sendMessage(msg.chat.id, "Có lỗi xảy ra 😢");
  }
});
