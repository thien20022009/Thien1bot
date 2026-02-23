const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function askGemini(question) {
  try {
    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.log("Lỗi Gemini:", error);
    return "Có lỗi xảy ra 😢";
  }
}

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
