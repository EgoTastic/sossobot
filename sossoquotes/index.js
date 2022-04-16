const request = require("request");
const parse = require("himalaya");
const JSSoup = require("jssoup").default;
const {saveNewQuote, getTelegramQuote, getQuoteAmount, getAll} = require("../database/index");
var quoteMap = new Map();
var quoteAmount;

const loadQuotes = async () => {
    quoteMap.clear();
    request(
        {url: "http://sosso.fi/sammakkopalsta/" },
        function(error, response, body) {
          var soup = new JSSoup(body);
          var quotes = soup.findAll("div", "perfect-quotes");
          quoteAmount = Object.keys(quotes).length;
          
            for (var i = 0; i < Object.keys(quotes).length; i++) {
            var quote = quotes[i].nextElement._text;
            if (!quotes[i].nextElement.nextElement.nextElement._text.includes("-")){
                var frog = "";
            } else {
                var frog = "\n" + (quotes[i].nextElement.nextElement.nextElement._text);
            }
          
          var fullQuote = quote + frog;
          quoteMap.set(i, fullQuote);
          }
          console.log("loaded " + quoteAmount + " quotes");
        }
    )
};

const getQuote = async () => {
    if (quoteMap.size == 0){
        return "error: sammakkolampi on tyhjä"
    }
    var tgQuotes = await getQuoteAmount();
    var quoteNumber = Math.floor(Math.random() * (quoteAmount + tgQuotes));
    if (quoteNumber < quoteAmount) {
        return quoteMap.get(quoteNumber);
    } else {
        return await getTelegramQuote(quoteNumber - quoteAmount);
    }
};

const saveTGQuote = async (quote) => {
    await saveNewQuote(quote);
};


module.exports = {
    loadQuotes,
    getQuote,
    saveTGQuote,
};