const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN; // Lấy token từ biến môi trường

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Chào bạn! Bot đang hoạt động 🚀');
    } else {
        bot.sendMessage(chatId, 'Bạn vừa gửi: ' + msg.text);
    }
});

console.log("Bot is running...");
