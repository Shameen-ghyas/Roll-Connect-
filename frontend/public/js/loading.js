const colorMap = {
  red: "#ff4a4a",
  blue: "#3aaaff",
  green: "#4fff4f",
  yellow: "#f5f54a"
};

window.addEventListener("load", async () => {
  // ✅ FIX: Get player name properly
  let playerName;
  
  // First check sessionStorage (unique per tab)
  let storedName = sessionStorage.getItem("myPlayerName");
  
  if (storedName) {
    playerName = storedName;
    console.log("📌 Using existing player from this tab:", playerName);
  } else {
    // Get from localStorage or user object
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      playerName = u?.username || localStorage.getItem("playerName") || localStorage.getItem("username");
    } catch {
      playerName = localStorage.getItem("playerName") || localStorage.getItem("username");
    }
    
    // Save to sessionStorage for this tab
    if (playerName) {
      sessionStorage.setItem("myPlayerName", playerName);
      console.log("💾 Saved player name to this tab:", playerName);
    }
  }

  const gameData = JSON.parse(localStorage.getItem("currentGame") || "null");
  if (!gameData) {
    document.getElementById("msg").innerText = "No game data found!";
    return;
  }

  const { gameId } = gameData;

  // ✅ CRITICAL: Store playerName in localStorage for board.js
  localStorage.setItem("currentGame", JSON.stringify({
    gameId: gameId,
    playerName: playerName,  // ← This player's name
    mode: gameData.mode || "online"
  }));

  console.log("✅ Game setup:", { gameId, playerName });

  const startBtn = document.getElementById("startGameBtn");
  if (startBtn) startBtn.style.display = "none";

  const msgEl = document.getElementById("msg");
  const playerList = document.getElementById("playerList");
  const gameIdElem = document.getElementById("gameId");
  const gameModeElem = document.getElementById("gameMode");
  const gameStatusElem = document.getElementById("gameStatus");

  function appendMessage(text) {
    const p = document.createElement("p");
    p.textContent = text;
    msgEl.appendChild(p);
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  function applyGameState(game) {
    if (!game) return;

    gameIdElem.textContent = "Game ID: " + game.gameId;
    gameModeElem.textContent = "Mode: " + game.mode;
    gameStatusElem.textContent = "Status: " + game.gameStatus;

    playerList.innerHTML = "";
    game.players.forEach((p) => {
      const li = document.createElement("li");
      li.style.color = colorMap[p.color] || "#fff";
      li.style.fontSize = "20px";
      li.style.margin = "6px 0";
      
      // ✅ Show "YOU" next to current player
      if (p.playerName.trim() === playerName.trim()) {
        li.textContent = `${p.playerName} (${p.color}) ← YOU`;
        li.style.fontWeight = "bold";
      } else {
        li.textContent = `${p.playerName} (${p.color})`;
      }
      
      playerList.appendChild(li);
    });

    if (startBtn) {
      if (game.players.length >= 2 && game.gameStatus === "waiting") {
        startBtn.style.display = "block";
      } else {
        startBtn.style.display = "none";
      }
    }
  }

  function loadSocketClient() {
    return new Promise((res, rej) => {
      if (window.io) return res(window.io);
      const s = document.createElement("script");
      s.src = "/socket.io/socket.io.js";
      s.onload = () => res(window.io);
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  try {
    await loadSocketClient();
    const socket = io();

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      socket.emit("join-game", { gameId, playerName });
      socket.emit("get-game-state", { gameId });
    });

    socket.on("game-state", (data) => {
      console.log("Game state received:", data);
      applyGameState(data);
    });

    socket.on("player-joined", (data) => {
      console.log("Player joined:", data);
      appendMessage(`${data.newPlayer} joined the game`);
      applyGameState(data);
    });

    socket.on("player-left", (data) => {
      console.log("Player left:", data);
      appendMessage(`${data.leftPlayer} left the game`);
      applyGameState(data);
    });

    socket.on("game-started", (data) => {
      console.log("✅ Game started! Redirecting...");
      appendMessage("Game started!");
      applyGameState(data);

      // ✅ Update localStorage with CURRENT player's name
      localStorage.setItem("currentGame", JSON.stringify({
        gameId: gameId,
        playerName: playerName,  // ← Keep THIS player's name
        mode: data.mode || "online",
        players: data.players,
        currentTurn: data.currentTurn
      }));

      setTimeout(() => {
        console.log("Redirecting to board...");
        window.location.href = "../html_files/ludo_Classic.html";
      }, 2000);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data);
      appendMessage("❌ Error: " + data.message);
    });

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        console.log("Starting game...");
        socket.emit("start-game", { gameId });
      });
    }

  } catch (err) {
    console.error("Socket error:", err);
    msgEl.innerText = "Socket failed - Check console";
  }

  // Copy Game ID button
  const copyBtn = document.getElementById('copyGameId');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(gameId).then(() => {
        alert('Game ID copied!');
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    });
  }
});