const request = require("request");
const JSSoup = require("jssoup").default;
const {saveNewQuote, getTelegramQuote, getQuoteAmount, getCategoryQuote} = require("../database/index");
var quoteMap = new Map();
var quoteAmount;

//Loads sammakkopalsta HTML, parses JSON, iterates and adds to quoteMap
const loadQuotes = async () => {
    quoteMap.clear();
    try{
        request(
            {url: "http://sosso.fi/sammakkopalsta/" },
            function(error, response, body) {
            var soup = new JSSoup(body);
            var quotes = soup.findAll("div", "perfect-quotes");
            quoteAmount = Object.keys(quotes).length;
          
            for (var i = 0; i < quoteAmount; i++) {
                var quote = quotes[i].nextElement._text;
                if (!quotes[i].nextElement.nextElement.nextElement._text.includes("-")){
                    var frog = "";
                } else {
                    var frog = "\n" + (quotes[i].nextElement.nextElement.nextElement._text);
                }
          
            var fullQuote = quote + frog;
            quoteMap.set(i, fullQuote);
            }
            quoteAmount = quoteMap.size;
            console.log("loaded " + quoteAmount + " quotes");
            }
        )
    } catch (error) {
        console.log("Error while loading Quotes, sosso.fi down?");
        return process.exit(1);
    }
};

//Randomizes quote from websössö or telegram quotes
const getQuote = async () => {
    var tgQuotes = await getQuoteAmount();
    if (quoteMap.size + tgQuotes == 0){
        return "error: sammakkolampi on tyhjä"
    };
    
    var quoteNumber = Math.floor(Math.random() * (quoteAmount + tgQuotes));
    if (quoteNumber < quoteAmount) {
        return quoteMap.get(quoteNumber);
    } else {
        return await getTelegramQuote(quoteNumber - quoteAmount + 1);
    };
};

//Searches quotes for word (simple search)
const findQuote = async (category) => {
    var found = new Array();
    for (let quote of quoteMap.values()){
        if (quote.toLowerCase().includes(category.toLowerCase())) {
            found.push(quote);
        };
    };
    if (found.length === 0) return null;
    return found[Math.floor(Math.random()*found.length)];
};

//Relays quote to save to database
const saveTGQuote = async (quote) => {
    await saveNewQuote(quote);
};

//Relays search to database
const findTGQuote = async (category) => {
    return await getCategoryQuote(category);
}


module.exports = {
    loadQuotes,
    getQuote,
    saveTGQuote,
    findQuote,
    findTGQuote,
};