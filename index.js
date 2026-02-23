require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!TELEGRAM_TOKEN || !GEMINI_API_KEY) {
  console.error("Thiếu TELEGRAM_TOKEN hoặc GEMINI_API_KEY");
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

console.log("Bot đang chạy...");

bot.on("message", async (msg) => {
  if (!msg.text) return;

  try {
    const result = await model.generateContent(msg.text);
    const response = result.response.text();
    bot.sendMessage(msg.chat.id, response);
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, "Có lỗi xảy ra.");
  }
});
