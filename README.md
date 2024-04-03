# WebSockets 101

## Getting Started with Two-Way Communication

### Steps:

#### Server side

1. Create the web socket server first. Make `server/index.js` file.
2. Install ws package

```
npm i ws
```

3. Import ws

```
const WebSocket = require("ws");
```

4. Create server instance

```
const wss = new WebSocket.Server({ port: 8080 });
```

5. Log when server is started

```
console.log("WebSocket server is running on port 8080");
```

6. Add on connection started callback

```
wss.on("connection", (ws) => {
    console.log("Client connected");
});
```

7. Add initial score

```
let score = 0;
```

8. Send current score as soon as connected

```
wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.send(JSON.stringify({ score }));
});
```

9. Add on close callback

```
wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.send(JSON.stringify({ score }));

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
```

#### Client side

10. Create the web socket client. Make `client/index.html` file and `client/index.js` file.
11. Add html content to display score and link the js file

```
<html lang="en">
  <body>
    <h1>Cricket score dashboard</h1>
    <p id="ws-connected">Disconnected</p>

    <p>Runs:</p>
    <p id="ws-runs"></p>

    <script src="./index.js"></script>
  </body>
</html>
```

12. Add html content update functionality in js file (Connected state and runs)

```
const wsConnected = document.getElementById("ws-connected");
const wsRuns = document.getElementById("ws-runs");

function updateRuns(runs) {
  wpRuns.innerText = runs;
}

function setConnected(connected) {
  wpConnect.innerText = connected ? "Connected" : "Disconnected";
}
```

13. Add ws varialbe

```
let ws
```

14. Create web socket connection conncetion function

```
function connect() {
  ws = new WebSocket("ws://localhost:8080");
}
```

15. Update connected state on connection open and close

```
function connect() {
  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    setConnected(true);
  };

  ws.onclose = () => {
    setConnected(false);
  };
}
```

16. Call connect function on page load

```
connect();
```

17. Add on message callback to update runs

```
function connect() {
  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    setConnected(true);
  };

  ws.onmessage = function (e) {
    updateRuns(JSON.parse(e.data).score);
  };

  ws.onclose = () => {
    setConnected(false);
  };
}
```

18. When opening the connection, close the existing connection if any

```
function connect() {
  if (ws) {
    ws.close();
  }

    // Rest of the code
}
```

#### Server side (Continued)

19. Add on message callback to update score

```
wss.on("connection", (ws) => {
    // Rest of the code

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.action === "add") {
            score += data.runs;
        } else if (data.action === "reset") {
            score = 0;
        }

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ score }));
            }
        });
    });

    // Rest of the code
});
```

#### Client side (Continued)

20. Add addRuns and resetScore functions

```
function addRuns(runs) {
  ws.send(JSON.stringify({ action: "add", runs }));
}

function resetScore() {
  ws.send(JSON.stringify({ action: "reset" }));
}

```

21. Add button to add runs and reset score

```
<button onclick="addRuns(1)">+1</button>
<button onclick="addRuns(2)">+2</button>
<button onclick="addRuns(3)">+3</button>
<button onclick="addRuns(4)">+4</button>
<button onclick="addRuns(6)">+6</button>
<button onclick="resetScore()">Reset</button>
```

#### Public page (Optional)

22. Add public folder, copy client files to public folder and remove score update functionality.
