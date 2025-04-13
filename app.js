// app.js
const express = require("express");
const { alerts } = require("./detector"); // Import alerts from detector.js
const { SECRET_TOKEN } = require("./secret"); // Import secret token

const app = express();
const port = 3000;

// Middleware to handle JSON responses
app.use(express.json());

// Middleware to check if request has valid token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token && token === `Bearer ${SECRET_TOKEN}`) {
    return next(); // Token is valid, proceed to the next middleware
  } else {
    return res.status(403).json({ message: "Forbidden: Invalid or missing token" });
  }
};

// Route to fetch last 10 alerts (with token authentication)
app.post("/alerts", verifyToken, (req, res) => {
    if (alerts.length === 0) {
      res.status(200).json({
        message: "No alerts found at the moment",
        alerts: [],
      });
    } else if (alerts.length > 0) {
      res.status(200).json({
        message: "Last 10 Alerts",
        alerts: alerts.slice(0, 10),
      });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});
