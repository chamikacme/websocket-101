const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let score = 0;

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.send(JSON.stringify({ score }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    
    if (data.action == "add") {
      score += data.runs;
    } else if (data.action == "reset") {
      score = 0;
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ score }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on port 8080");
