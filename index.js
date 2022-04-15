const { loadQuotes } = require("./sossoquotes");
const { startTelegramBot } = require("./telegram/index");

const start = async () => {
  //await connectToDatabase();
  await startTelegramBot();
  loadQuotes();

};

start();