const TelegramBot = require("node-telegram-bot-api");

// Node 18+ đã có fetch sẵn nên KHÔNG cần require node-fetch

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// ===== Hàm gọi Gemini =====
async function askGemini(question) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

    // Nếu Gemini không trả dữ liệu
    if (!data.candidates || !data.candidates.length) {
      console.log("Gemini lỗi:", data);
      return "Gemini không phản hồi 😢";
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.log("Lỗi khi gọi Gemini:", error);
    return "Có lỗi xảy ra 😢";
  }
}

// ===== Khi nhận tin nhắn =====
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.text) return;

  if (msg.text === "/start") {
    return bot.sendMessage(chatId, "Bot đang hoạt động 🚀");
  }

  const reply = await askGemini(msg.text);
  bot.sendMessage(chatId, reply);
});

console.log("Bot đang chạy...");
