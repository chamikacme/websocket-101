const wsConnected = document.getElementById("ws-connected");
const wsRuns = document.getElementById("ws-runs");

function updateRuns(runs) {
  wsRuns.innerHTML = runs;
}

function setConnected(connected) {
  wsConnected.innerHTML = connected ? "Connected" : "Disconnected";
}

let ws;

function connect() {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    setConnected(true);
  };

  ws.onmessage = (e) => {
    updateRuns(JSON.parse(e.data).score);
  };

  ws.onclose = () => {
    setConnected(false);
  };
}

connect();
