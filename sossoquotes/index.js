const request = require("request");
const parse = require("himalaya");
const JSSoup = require("jssoup").default;
var quoteMap = new Map();
var quoteAmount;

const loadQuotes = () => {
    quoteMap.clear();
    request(
        {url: "http://sosso.fi/sammakkopalsta/" },
        function(error, response, body) {
          var soup = new JSSoup(body);
          var quotes = soup.findAll("div", "perfect-quotes");
          quoteAmount = Object.keys(quotes).length;
          
          for (var i = 0; i < Object.keys(quotes).length; i++) {
          var quote = quotes[i].nextElement._text;
          var frog = (quotes[i].nextElement.nextElement.nextElement._text);
          var fullQuote = quote + "\n" + frog;
          quoteMap.set(i, fullQuote);
          }
          console.log("loaded " + quoteAmount + " quotes");
        }
      )
}

const getQuote = () => {
    var quoteNumber = Math.floor(Math.random() * (quoteAmount - 1) );
    return quoteMap.get(quoteNumber);
}

module.exports = {
    loadQuotes,
    getQuote,
}