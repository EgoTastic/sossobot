require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const {getQuote, loadQuotes, saveTGQuote, getTGQuote} = require("../sossoquotes/index");
var overlord = false;
const overlordId = process.env.OVERLORDID;

bot.command('reloadQuotes', async ctx => {
    if(overlord){
        return;
    }
    await loadQuotes();
});

bot.command('overlord_stop', async ctx => {
    if (ctx.from.id == overlordId) {
        overlord = true;
    }
});

bot.command('overlord_start', async ctx => {
    if (ctx.from.id == overlordId) {
        overlord = false;
    }
});

bot.command("sammakko", async ctx => {
    if(overlord){
        return;
    }
    var quote = await getQuote();
    ctx.reply(quote);
});

bot.command("kroak", async ctx => {
    if(ctx.message.reply_to_message && ctx.message.reply_to_message.text){
        await saveTGQuote(ctx.message.reply_to_message.text);
        bot.telegram.sendMessage(ctx.chat.id, "Sammakkolahti täyttyy");
    } 
});


const startTelegramBot = async () => {
    await bot.launch();
    console.log("Telegram up");
}



module.exports = {
    startTelegramBot,
}