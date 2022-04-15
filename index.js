const { loadQuotes } = require("./sossoquotes");
const { startTelegramBot } = require("./telegram/index");

const start = async () => {
  //await connectToDatabase();
  loadQuotes();
  await startTelegramBot();
  

};

start();