const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Generate a mock 10x10 table
let table = Array.from({ length: 10 }, () =>
  Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
);

// REST endpoint to fetch the full table
app.get("/api/table", (req, res) => {
  res.json({ table });
});

// WebSocket logic for live updates
wss.on("connection", (socket) => {
  console.log("WebSocket connection established.");

  // Simulate random updates to the table
  setInterval(() => {
    const rowIndex = Math.floor(Math.random() * 10);
    const colIndex = Math.floor(Math.random() * 10);
    const value = Math.floor(Math.random() * 100);

    // Update the table
    table[rowIndex][colIndex] = value;

    // Broadcast the update to the client
    const update = { rowIndex, colIndex, value };
    socket.send(JSON.stringify(update));
  }, 100);

  socket.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

// Start the server
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});