// detector.js
// ---------------------------------------------------
// Detects anomalies using Spike (first) and Moving Average (second)
// ---------------------------------------------------

const { stockSymbols, stockPrices } = require("./simulator");
const config = require("./config.json");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Store last 10 alerts
const alerts = [];

// Store price history for moving average strategy
const priceHistory = {};

// Utility: Calculate average of an array
const getAverage = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

// Main function to detect anomalies
const checkAnomalies = async () => {
  const now = new Date();
  const formattedTime = moment(now).format("YYYY-MM-DD hh:mm:ss A");

  for (const symbol of stockSymbols) {
    const price = stockPrices[symbol].price;
    const conf = config[symbol];

    if (!conf) {
      continue; // skip if no config
    }

    // --------------------------------------------------
    // Strategy: Spike Detection (based on % change)
    // --------------------------------------------------
    if (conf.strategy === "spike") {
      if (!conf.oldPrices) {
        conf.oldPrices = [];
      }

      // Add current price with timestamp
      conf.oldPrices.push({ price, time: now });

      // Keep prices within configured time window
      conf.oldPrices = conf.oldPrices.filter((p) => {
        return now - new Date(p.time) <= conf.windowSec * 1000;
      });

      let oldPrice = conf.oldPrices[0]?.price || price;
      let changePercent = Math.abs((price - oldPrice) / oldPrice) * 100;

      if (changePercent > conf.thresholdPercent) {  
        let  changeType = (price > oldPrice) ? 'spike' : 'drop';      
        alerts.unshift({
          stockSymbol: symbol,
          strategy: "% spike OR drop",
          timestamp: formattedTime,
          reason: `Price ${changeType} by ${changePercent.toFixed(2)}% in last ${conf.windowSec} sec`
        });
        logAlertToFile(alerts[0]);
        console.log(`Alert [SPIKE] ${symbol} alert at ${formattedTime} — Price changed by ${changePercent.toFixed(2)}%`);

        if (alerts.length > 10) {
          alerts.pop();
        }
      }
    }

    // ----------------------------------------------------------
    // Strategy: Moving Average Deviation
    // ----------------------------------------------------------
    else if (conf.strategy === "movingAverage") {
      if (!priceHistory[symbol]) {
        priceHistory[symbol] = [];
      }

      // Add current price to history
      priceHistory[symbol].push(price);

      // Keep only last N values
      if (priceHistory[symbol].length > conf.sampleSize) {
        priceHistory[symbol].shift();
      }

      // If we have enough samples, check deviation
      if (priceHistory[symbol].length === conf.sampleSize) {
        const avg = getAverage(priceHistory[symbol]);
        const deviation = Math.abs((price - avg) / avg) * 100;

        if (deviation > conf.deviationPercent) {
          alerts.unshift({
            stockSymbol: symbol,
            strategy: "movingAverage",
            timestamp: formattedTime,
            reason: `Price deviated by ${deviation.toFixed(2)}% from moving average`,
            
          });
          logAlertToFile(alerts[0]);

          console.log(`[ALERT - Moving Avg] ${alert.timestamp} | ${alert.stockSymbol} | ${alert.reason}`);

          if (alerts.length > 10) {
            alerts.pop();
          }
        }
      }
    }
  }
};

// Run anomaly check every second
setInterval(async () => {
  try {
    await checkAnomalies();
  } catch (err) {
    console.error("Error in anomaly detection:", err.message);
  }
}, 1000);

// Log alert to file
const logAlertToFile = (alert) => {
    const logPath = path.join(__dirname, "alerts_log.txt");
    const logEntry = JSON.stringify(alert) + ",\n";
    fs.appendFile(logPath, logEntry, (err) => {
      if (err) console.error("Error writing alert to file:", err.message);
    });
  };

// Export for API
module.exports = {
  alerts
};
