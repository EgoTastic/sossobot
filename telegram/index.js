require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const {getQuote, loadQuotes} = require("../sossoquotes/index");

bot.command('reloadQuotes', ctx => {
    loadQuotes();
})

bot.command("sammakko", ctx => {
    var quote = getQuote();
    bot.telegram.sendMessage(ctx.chat.id, quote);
})

const startTelegramBot = async () => {
    await bot.launch();
    console.log("Telegram up");
}

//method that displays the inline keyboard buttons 



//method that returns image of a dog



module.exports = {
    startTelegramBot,
}