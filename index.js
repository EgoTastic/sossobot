const { loadQuotes } = require("./sossoquotes");
const { startTelegramBot } = require("./telegram/index");

//Initial launch
const start = async () => {

  await loadQuotes();
  await startTelegramBot();
  
};

start();