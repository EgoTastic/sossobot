require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const {getQuote, loadQuotes, findQuote } = require("../sossoquotes/index");
var overlord = false;
const overlordId = process.env.OVERLORDID;
const overlordId2 = process.env.OVERLORDID2;
const sikID = -1001044711778;
const testID = -1001766021899;

//Forces bot to reload websössö quotes
bot.command('reloadQuotes', async ctx => {
    if(overlord){
        return;
    }
    await loadQuotes();
});

bot.hears("moi", async ctx => {
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, "moi");
})

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
    if (ctx.from.id == overlordId || ctx.from.id == overlordId2 ) {
        overlord = true;
    } else {
        return;
    }
    let message = "All hail the overlord!";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
});
//Starts bot to listen to commands
bot.command('overlord_start', async ctx => {
    if (ctx.from.id == overlordId || ctx.from.id == overlordId2 ) {
        overlord = false;
    } else {
        return;
    }
    let message = "All hail the overlord!";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
});

//Send message to SIK from bot
bot.command('postaa', async ctx => {
    if (ctx.from.id == overlordId || ctx.from.id == overlordId2 ) {
        let tgmessage = ctx.message.text;
        let message = tgmessage.replace("/postaa ", "");
        if (message == "" || ctx.message.text == "/postaa" || ctx.message.text == "/postaa ") {
            return;
        }
        await bot.telegram.sendMessage(sikID, ("" + message));
    }

});

//Finds either random quote or searches with keyword if command is "/sammakko keyword"
bot.command("sammakko", async ctx => {
    if(overlord){
        return;
    }

    let category = ctx.message.text.split(" ")[1];
    let message;

    if (category){
        console.log("kategoria havaittu hakusana: " + category);
        message = await findQuote(category);
        console.log("löydetty:" + message);
        if (!message) {
            message = "Ei sammakkoa hakukriteerillä";
        }
    } else {
        message = await getQuote();
    }

    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
});

//Sahkojakaa
bot.command("mita_sahko_tekee", async ctx => {
    if(overlord){
        return;
    }
    
    let message = "Sähkö jakaa!\nSähkö jakaa!\nSähkö jakaa!\nSähkö jakaa!";
    await sendToTelegram(ctx.message.chat.id, ctx.message.message_id, message);
})

//sik100
bot.command("sik100", async ctx => {
    if(overlord){
        return;
    }
    
    let message = "Kohta se on ohi...";
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
    startTelegramBot
}