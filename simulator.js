// simulator.js
// ---------------------------------------
// Real-Time Stock Price Simulator
// ---------------------------------------

const config = require("./config.json");
const moment = require("moment"); 
const stockSymbols = Object.keys(config); // Dynamically from config
const stockPrices = {};  // Store prices for each stock

stockSymbols.forEach((symbol) => {
   stockPrices[symbol] = {
    price: Math.random() * 1000 + 100 // random price 100 to 1100
   };
});


// Async function to update stock prices every second
const updatePrices = async () => {
    let timestamp = moment().format("YYYY-MM-DD hh:mm:ss A");

    for (let symbol of stockSymbols) {
      let oldPrice = stockPrices[symbol].price; // Get the current price of the stock
      let fluctuation = (Math.random() - 0.5) * 10; // Simulate random fluctuation between -5 and +5
      let newPrice = oldPrice + fluctuation; // Calculate new price by applying the fluctuation
  
      stockPrices[symbol].price = newPrice;
  
      // Log updated price
      console.log(`${symbol} - ${timestamp} : $${newPrice.toFixed(2)}`);
    }
  };

//Run the price update every second
setInterval(async () => {
    try{
        await updatePrices();
    } catch (error) {
        console.error("Error updating stock prices:", error.message);
    }
}, 1000);

// exporting the use in other modules 
module.exports = {
    stockSymbols,
    stockPrices
}