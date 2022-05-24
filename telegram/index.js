require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const {getQuote, loadQuotes, saveTGQuote, findQuote, findTGQuote} = require("../sossoquotes/index");
var overlord = false;
const overlordId = process.env.OVERLORDID;


bot.hears("moi", async ctx => {
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, "moi");
})


//Forces bot to reload websössö quotes
bot.command('reloadQuotes', async ctx => {
    if(overlord){
        return;
    }
    
    try {
        await loadQuotes();
    }
    catch (error) {
        console.log(error);
    }
    
});

const sendToTelegram = async (chatId, replyId, message) => {
    try {
        await bot.telegram.sendMessage(chatId, message, {
            reply_to_message_id: replyId,
        });
    }
    catch (error) {
        console.log(error);
    }
}

const sendPhotoToTelegram = async(chatId, replyId, photoURL) => {
    try {
        await bot.telegram.sendPhoto(chatId, photoURL, {
        reply_to_message_id: replyId,
    });
    }
    catch (error) {
        console.log(error);
    }
}


//Stops bot from listening to commands
bot.command('overlord_stop', async ctx => {
    if (ctx.from.id == overlordId) {
        overlord = true;
    }
    
    let message = "All hail the overlord!";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);

});

//Starts bot to listen to commands
bot.command('overlord_start', async ctx => {
    if (ctx.from.id == overlordId) {
        overlord = false;
    }
    
    let message = "All hail the overlord!";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
});

//Finds either random quote or searches with keyword if command is "/sammakko keyword"
bot.command("sammakko", async ctx => {
    if(overlord){
        return;
    }

    let category = ctx.message.text.split(" ")[1];
    let message;

    if (category){
        message = await findQuote(category);
        if (!message) {
            message = await findTGQuote(category);
        }
        if (!message) {
            message = "Ei sammakkoa hakukriteerillä";
        }
    } else {
        message = await getQuote();
    }

    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
});

//Saves new telegram quote
bot.command("kroak", async ctx => {
    if(overlord){
        return;
    }
    
    try {
        if(ctx.message.reply_to_message && ctx.message.reply_to_message.text){
            await saveTGQuote(ctx.message.reply_to_message.text);
            await bot.telegram.sendMessage(ctx.message.chat.id, "Sammakkolahti täyttyy", {
                reply_to_message_id: ctx.message.message_id,
            });
        } 
    }
    catch (error) {
        console.log(error);
    }
});

//Sahkojakaa
bot.command("mita_sahko_tekee", async ctx => {
    if(overlord){
        return;
    }
    
    let message = "Sähkö jakaa!\nSähkö jakaa!\nSähkö jakaa!\nSähkö jakaa!";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
})

//Simpsonit
bot.command("ok", async ctx => {
    if(overlord){
        return;
    }
    
    let message = "iha ok, mut ootteko kattonu simpsonit sarjasta jakson himo läski homer :D siinä esiintyy koko simpsonit perhe eli myös bart simpsons homer poika fanit saavat nauraa ja naurattaahan se tietty myös vaikka homerin läski kuteet ja muut :D kannattaa kattoo nopee";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
})

//Jappadaida
bot.command("jappadaida", async ctx => {
    if(overlord) return;
    
    let message = "Hyvä KIK!";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
})

//EZ4SIK
bot.command("ez4sik", async ctx => {
    if (overlord) return;
    
    let message = "https://soundcloud.com/the-haalarz/ez4sik";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
})

//Perjantai
bot.command("perjantai", async ctx => {
    if (overlord) return;
    
    let message = "https://www.ukko.fi/pojat";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
})

//Lavan oikee puoli
bot.command("00_00_lavan_oikee_puoli", async ctx => {
    if (overlord) return;
    
    let photoURL = "https://raw.githubusercontent.com/EgoTastic/sossobot/master/telegram/00.png";
    sendPhotoToTelegram(ctx.message.chat.id, ctx.message.message_id, photoURL);
})

bot.command("00_00_lavan_oikea_puoli", async ctx => {
    if (overlord) return;

    let photoURL = "https://raw.githubusercontent.com/EgoTastic/sossobot/master/telegram/00.png";
    sendPhotoToTelegram(ctx.message.chat.id, ctx.message.message_id, photoURL);
})

bot.command("lavan_oikee_puoli", async ctx => {
    if (overlord) return;
    
    let photoURL = "https://raw.githubusercontent.com/EgoTastic/sossobot/master/telegram/00.png";
    sendPhotoToTelegram(ctx.message.chat.id, ctx.message.message_id, photoURL);
})

bot.command("lavan_oikea_puoli", async ctx => {
    if (overlord) return;
    
    let photoURL = "https://raw.githubusercontent.com/EgoTastic/sossobot/master/telegram/00.png";
    sendPhotoToTelegram(ctx.message.chat.id, ctx.message.message_id, photoURL);
})

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