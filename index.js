const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

bot.on("message", async (msg) => {
  if (msg.text === "/start") {
    return bot.sendMessage(msg.chat.id, "Chào bạn! Hỏi mình bất cứ điều gì 🤖");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là trợ lý AI, trả lời bằng tiếng Việt." },
        { role: "user", content: msg.text }
      ],
    });

    bot.sendMessage(msg.chat.id, completion.choices[0].message.content);

  } catch (error) {
    console.error(error);
    bot.sendMessage(msg.chat.id, "Có lỗi xảy ra 😢");
  }
});
