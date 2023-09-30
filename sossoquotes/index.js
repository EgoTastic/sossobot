const request = require("request");
const JSSoup = require("jssoup").default;
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
                if (quotes[i].nextElement.nextElement.nextElement._text == undefined || !quotes[i].nextElement.nextElement.nextElement._text.includes("-")){
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
    if (quoteMap.size == 0){
        return "error: sammakkolampi on tyhjä"
    };
    
    var quoteNumber = Math.floor(Math.random() * (quoteAmount));
    return quoteMap.get(quoteNumber);

};

//Searches quotes for word (simple search)
const findQuote = async (category) => {
    var found = new Array();
    console.log("haetaan: " + category)
    for (let quote of quoteMap.values()){
        if (quote.toLowerCase().includes(category.toLowerCase())) {
            console.log("matchi: " + quote);
            found.push(quote);
        };
    };
    if (found.length === 0) return null;
    return found[Math.floor(Math.random()*found.length)];
};



module.exports = {
    loadQuotes,
    getQuote,
    findQuote,
};