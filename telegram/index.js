require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const {getQuote, loadQuotes} = require("../sossoquotes/index");
var overlord = false;
const overlordId = process.env.OVERLORDID;

bot.command('reloadQuotes', ctx => {
    if(overlord){
        return;
    }
    loadQuotes();
})

bot.command('overlord_stop', ctx => {
    if (ctx.from.id == overlordId) {
        overlord = true;
    }
})
bot.command('overlord_start', ctx => {
    if (ctx.from.id == overlordId) {
        overlord = false;
    }
})

bot.command("sammakko", ctx => {
    if(overlord){
        return;
    }
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