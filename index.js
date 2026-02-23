const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

// Lấy token từ Railway Variables
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// ====== Hàm hỏi Gemini ======
async function askGemini(question) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Kiểm tra nếu Gemini không trả về kết quả
    if (!data.candidates || !data.candidates.length) {
      console.log("Gemini lỗi:", data);
      return "Gemini không phản hồi 😢 (check API key)";
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.log("Lỗi Gemini:", error);
    return "Có lỗi xảy ra khi gọi Gemini 😢";
  }
}

// ====== Khi có tin nhắn ======
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "/start") {
    return bot.sendMessage(chatId, "Chào bạn! Bot đang hoạt động 🚀");
  }

  try {
    const reply = await askGemini(msg.text);
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "Có lỗi xảy ra 😢");
  }
});

console.log("Bot đang chạy...");
