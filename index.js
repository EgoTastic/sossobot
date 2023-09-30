const { loadQuotes } = require("./sossoquotes");
const { startTelegramBot } = require("./telegram/index");

//Initial launch #sorry
const start = async () => {

  await loadQuotes();
  await startTelegramBot();
  
};

start();