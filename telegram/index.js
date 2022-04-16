require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const {getQuote, loadQuotes, saveTGQuote, findQuote, findTGQuote} = require("../sossoquotes/index");
var overlord = false;
const overlordId = process.env.OVERLORDID;

//Forces bot to reload websössö quotes
bot.command('reloadQuotes', async ctx => {
    if(overlord){
        return;
    }
    await loadQuotes();
});

//Stops bot from listening to commands
bot.command('overlord_stop', async ctx => {
    if (ctx.from.id == overlordId) {
        overlord = true;
    }
    await bot.telegram.sendMessage(ctx.message.chat.id, "All hail the overlord!", {
        reply_to_message_id: ctx.message.message_id,
    });
});

//Starts bot to listen to commands
bot.command('overlord_start', async ctx => {
    if (ctx.from.id == overlordId) {
        overlord = false;
    }
    await bot.telegram.sendMessage(ctx.message.chat.id, "All hail the overlord!", {
        reply_to_message_id: ctx.message.message_id,
    });
});

//Finds either random quote or searches with keyword if command is "/sammakko keyword"
bot.command("sammakko", async ctx => {
    if(overlord){
        return;
    }

    let category = ctx.message.text.split(" ")[1];
    let quote;

    if (category){
        quote = await findQuote(category);
        if (!quote) {
            quote = await findTGQuote(category);
        }
        if (!quote) {
            quote = "Ei sammakkoa hakukriteerillä";
        }
    } else {
        quote = await getQuote();
    }

    await bot.telegram.sendMessage(ctx.message.chat.id, quote, {
        reply_to_message_id: ctx.message.message_id,
    });
});

//Saves new telegram quote
bot.command("kroak", async ctx => {
    if(overlord){
        return;
    }
    if(ctx.message.reply_to_message && ctx.message.reply_to_message.text){
        await saveTGQuote(ctx.message.reply_to_message.text);
        await bot.telegram.sendMessage(ctx.message.chat.id, "Sammakkolahti täyttyy", {
            reply_to_message_id: ctx.message.message_id,
        });
    } 
});

//Initial connection to telegram API
const startTelegramBot = async () => {
    try {
        await bot.launch();
        console.log("Telegram up");
    } catch (error) {
        console.log("Telegram connection failed");
        return process.exit(1);
    }
}



module.exports = {
    startTelegramBot,
}