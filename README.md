Setup Instructions

1. Clone the Repository
git clone https://github.com/haritgit03/stock-anomaly-detector.git
cd stock-anomaly-detector

2. Install Dependencies
Make sure you have Node.js and npm installed. Then, run the following command to install the required packages:
npm install express moment dotenv jsonwebtoken

4. Start the Server
Once the setup is complete, you can start the app by running:
npm start
This will run the server on localhost:3000

5. API Endpoints
POST /alerts
Fetch the last 10 alerts (anomalies) that were triggered.
Request:
  Headers:
  Authorization: Bearer YOUR_SECRET_TOKEN
Response:
 Returns the last 10 alerts.

6. How It Works
    The stock simulator generates real-time stock price updates for 1000+ stocks.
    Anomaly detection algorithms (Spike and Moving Average Deviation) continuously monitor the prices.
    If any stock price deviates beyond the configured threshold, an alert is triggered.
    Alerts are stored in memory and can be accessed through the /alerts endpoint.

7. Testing
    To simulate how the system performs with 1000+ stocks:
    Modify the stockSymbols in the simulator.js to generate random stocks.
    Run the server and monitor the output as anomalies are detected and alerts are generated
 
8. Security
   Secret Token: Make sure to keep your secret token safe. Use .env or other secure methods to manage your token in production.

9. Tools & Technologies
   1. Node.js for server-side execution
   2. WebSocket for real-time updates
   3. Express.js for API server
   4. JWT for authentication
   5. moment.js for date formatting
