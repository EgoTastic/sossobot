const { loadQuotes } = require("./sossoquotes");
const { startTelegramBot } = require("./telegram/index");
const {connectToDatabase} = require("./database/index");

const start = async () => {

  await connectToDatabase();
  await loadQuotes();
  await startTelegramBot();
  
};

start();