// window.onload = async () => {
//     const gameData = JSON.parse(localStorage.getItem("currentGame"));
//     if (!gameData) {
//         alert("No game data found");
//         return window.location.href = "ludo_main.html";
//     }

//     const { gameId } = gameData;

//     try {
//         const res = await fetch(`http://localhost:5000/game/${gameId}`, { method: "POST" });
//         const result = await res.json();

//         if (!res.ok || result.error) {
//             alert(result.error || "Error fetching game details");
//             return window.location.href = "ludo_main.html";
//         }

//         const game = result.data;

//         document.getElementById("gameId").innerText = "Game ID: " + game.gameId;
//         document.getElementById("mode").innerText = "Mode: " + game.mode;
//         document.getElementById("status").innerText = "Status: " + game.gameStatus;

//         const ul = document.getElementById("playerList");
//         ul.innerHTML = "";
//         game.players.forEach(player => {
//             const li = document.createElement("li");
//             li.innerText = `${player.playerName} (${player.color})`;
//             ul.appendChild(li);
//         });

//     } catch (err) {
//         alert("Error fetching game details");
//         console.error(err);
//     }
// };
// 













// // loading.js
// const colorMap = {
//   red: "#ff4a4a",
//   blue: "#3aaaff",
//   green: "#4fff4f",
//   yellow: "#f5f54a"
// };

// // helper for small transient messages
// function flashMessage(text, ms = 2500) {
//   const el = document.getElementById("msg");
//   if (!el) return;
//   el.innerText = text;
//   el.style.opacity = "1";
//   clearTimeout(el._flashTimer);
//   el._flashTimer = setTimeout(() => {
//     el.style.opacity = "0.85";
//   }, ms);
// }

// window.addEventListener("load", async () => {
//   // resolve playerName robustly (your app sometimes stores user)
//   let playerName;
//   try {
//     const userObj = JSON.parse(localStorage.getItem("user") || "null");
//     playerName = userObj?.username || localStorage.getItem("playerName") || localStorage.getItem("username");
//   } catch (e) {
//     playerName = localStorage.getItem("playerName") || localStorage.getItem("username");
//   }

//   const gameData = JSON.parse(localStorage.getItem("currentGame") || "null");
//   if (!gameData) {
//     document.getElementById("msg").innerText = "No game data found!";
//     return;
//   }
//   const { gameId } = gameData;

//   const startBtn = document.getElementById("startGameBtn");
//   if (startBtn) startBtn.style.display = "none";

//   // --- Polling fallback (keeps UI working if socket fails) ---
//   let pollingInterval = null;
//   async function pollUpdate() {
//     try {
//       const r = await fetch(`/game/${gameId}`);
//       if (!r.ok) return;
//       const json = await r.json();
//       if (json.error) {
//         flashMessage(json.error);
//         return;
//       }
//       applyGameState(json.data);
//     } catch (err) {
//       // network unreachable
//       console.warn("poll error", err);
//     }
//   }

//   // --- apply game state to UI ---
//   function applyGameState(game) {
//     if (!game) return;
//     document.getElementById("gameId").innerText = "Game ID: " + game.gameId;
//     document.getElementById("gameMode").innerText = "Mode: " + game.mode;
//     document.getElementById("gameStatus").innerText = "Status: " + game.gameStatus;

//     // players list
//     const ul = document.getElementById("playerList");
//     ul.innerHTML = "";
//     game.players.forEach((p) => {
//       const li = document.createElement("li");
//       li.style.color = colorMap[p.color] || "#fff";
//       li.style.fontSize = "20px";
//       li.style.margin = "6px 0";
//       li.innerHTML = `${p.playerName} <b>(${p.color})</b>`;
//       ul.appendChild(li);
//     });

//     // enable start button when >=2 players and waiting
//     if (startBtn) {
//       if (game.players.length >= 2 && game.gameStatus === "waiting") {
//         startBtn.style.display = "block";
//       } else {
//         startBtn.style.display = "none";
//       }
//     }

//     // status message
//     if (game.gameStatus === "waiting") {
//       document.getElementById("msg").innerText = "Waiting for players...";
//     } else if (game.gameStatus === "active") {
//       document.getElementById("msg").innerText = "Game started — redirecting…";
//       setTimeout(() => {
//         window.location.href = "../html_files/ludo_classic.html";
//       }, 900);
//     }
//   }

//   // --- load socket.io client dynamically from server (so no HTML change needed) ---
//   function loadSocketClientAndConnect() {
//     return new Promise((resolve, reject) => {
//       // if already loaded
//       if (window.io) return resolve(window.io);

//       const s = document.createElement("script");
//       s.src = "/socket.io/socket.io.js"; // served by socket.io on server
//       s.onload = () => resolve(window.io);
//       s.onerror = (e) => reject(e);
//       document.head.appendChild(s);
//     });
//   }

//   // connect sockets and wire events
//   try {
//     await loadSocketClientAndConnect();
//     const socket = io(); // connects to same host/port

//     socket.on("connect", () => {
//       console.log("socket connected:", socket.id);
//       flashMessage("Connected to server");
//       // ask for current game state
//       socket.emit("get-game-state", { gameId });

//       // optionally join room for server side broadcasts (server's join-game also joins room, but get-game-state is ok)
//       // we won't call 'join-game' here to avoid duplicating DB join — server's handler adds player if not present.
//       // If you want socket join to add player on socket connect, use:
//       // socket.emit('join-game', { gameId, playerName });
//     });

//     // when a new player joins (server emits player-joined)
//     socket.on("player-joined", (payload) => {
//       if (!payload) return;
//       flashMessage(`${payload.newPlayer} joined the game`);
//       applyGameState({ ...payload, players: payload.players });
//     });

//     socket.on("player-left", (payload) => {
//       if (!payload) return;
//       flashMessage(`${payload.leftPlayer} left the game`);
//       applyGameState({ ...payload, players: payload.players });
//     });

//     socket.on("player-disconnected", (payload) => {
//       if (!payload) return;
//       flashMessage(`${payload.playerName} disconnected`);
//     });

//     socket.on("game-started", (payload) => {
//       flashMessage(payload.message || "Game started");
//       applyGameState({ ...payload, players: payload.players });
//       // redirect after short delay
//       setTimeout(() => {
//         window.location.href = "../html_files/ludo_classic.html";
//       }, 900);
//     });

//     socket.on("turn-changed", (payload) => {
//       flashMessage(payload.message || "Turn changed");
//     });

//     socket.on("dice-rolled", (payload) => {
//       flashMessage(payload.message || "Dice rolled");
//     });

//     socket.on("extra-turn-granted", (payload) => {
//       flashMessage(payload.message || "Extra turn!");
//     });

//     socket.on("game-state", (payload) => {
//       // direct response to get-game-state
//       applyGameState(payload);
//     });

//     socket.on("error", (err) => {
//       console.warn("socket error", err);
//       flashMessage(typeof err === "string" ? err : err.message || "Socket error");
//     });

//     // if socket disconnects, start polling fallback
//     socket.on("disconnect", (reason) => {
//       console.warn("socket disconnected:", reason);
//       flashMessage("Disconnected from server — using polling");
//       if (!pollingInterval) pollingInterval = setInterval(pollUpdate, 2000);
//     });

//     // when socket connects, stop polling (socket is authoritative)
//     socket.on("connect", () => {
//       if (pollingInterval) {
//         clearInterval(pollingInterval);
//         pollingInterval = null;
//       }
//     });

//     // Start button action uses socket to start game if possible; fallback to HTTP start
//     if (startBtn) {
//       startBtn.addEventListener("click", async () => {
//         // prefer socket event so all clients get immediate push
//         try {
//           socket.emit("start-game", { gameId });

//           // also call REST start endpoint to ensure API state updated (safe to call)
//           const r = await fetch("/game/start", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ gameId }),
//           });
//           const json = await r.json();
//           if (json.error) {
//             flashMessage(json.error);
//             return;
//           }
//           flashMessage("Starting game…");
//         } catch (err) {
//           console.error("start error", err);
//           flashMessage("Failed to start game");
//         }
//       });
//     }

//     // initial poll once (in case socket events missed)
//     pollUpdate();

//   } catch (sockErr) {
//     console.warn("socket init failed:", sockErr);
//     flashMessage("Realtime unavailable, using polling");
//     // fallback polling
//     pollUpdate();
//     pollingInterval = setInterval(pollUpdate, 2000);
//   }
// });








// // loading.js
// const colorMap = {
//   red: "#ff4a4a",
//   blue: "#3aaaff",
//   green: "#4fff4f",
//   yellow: "#f5f54a"
// };

// function flashMessage(text, ms = 2500) {
//   const el = document.getElementById("msg");
//   if (!el) return;
//   el.innerText = text;
//   el.style.opacity = "1";
//   clearTimeout(el._flashTimer);
//   el._flashTimer = setTimeout(() => {
//     el.style.opacity = "0.85";
//   }, ms);
// }

// window.addEventListener("load", async () => {
//   let playerName;
//   try {
//     const u = JSON.parse(localStorage.getItem("user") || "null");
//     playerName = u?.username || localStorage.getItem("playerName") || localStorage.getItem("username");
//   } catch {
//     playerName = localStorage.getItem("playerName") || localStorage.getItem("username");
//   }

//   const gameData = JSON.parse(localStorage.getItem("currentGame") || "null");
//   if (!gameData) {
//     document.getElementById("msg").innerText = "No game data found!";
//     return;
//   }
//   const { gameId } = gameData;

//   const startBtn = document.getElementById("startGameBtn");
//   if (startBtn) startBtn.style.display = "none";

//   let pollingInterval = null;
//   async function pollUpdate() {
//     try {
//       const r = await fetch(`/game/${gameId}`);
//       if (!r.ok) return;
//       const js = await r.json();
//       if (js.error) return;
//       applyGameState(js.data);
//     } catch {}
//   }

//   function applyGameState(game) {
//     if (!game) return;

//     document.getElementById("gameId").innerText = "Game ID: " + game.gameId;
//     document.getElementById("gameMode").innerText = "Mode: " + game.mode;
//     document.getElementById("gameStatus").innerText = "Status: " + game.gameStatus;

//     const ul = document.getElementById("playerList");
//     ul.innerHTML = "";
//     game.players.forEach((p) => {
//       const li = document.createElement("li");
//       li.style.color = colorMap[p.color] || "#fff";
//       li.style.fontSize = "20px";
//       li.style.margin = "6px 0";
//       li.innerHTML = `${p.playerName} <b>(${p.color})</b>`;
//       ul.appendChild(li);
//     });

//     if (startBtn) {
//       if (game.players.length >= 2 && game.gameStatus === "waiting") {
//         startBtn.style.display = "block";
//       } else {
//         startBtn.style.display = "none";
//       }
//     }

//     if (game.gameStatus === "waiting") {
//       document.getElementById("msg").innerText = "Waiting for players...";
//     } else if (game.gameStatus === "active") {
//       document.getElementById("msg").innerText = "Game started — redirecting…";
//       setTimeout(() => {
//         window.location.href = "../html_files/ludo_Classic.html";
//       }, 900);
//     }
//   }

//   // --- load socket.io automatically
//   function loadSocketClient() {
//     return new Promise((res, rej) => {
//       if (window.io) return res(window.io);
//       const s = document.createElement("script");
//       s.src = "/socket.io/socket.io.js";
//       s.onload = () => res(window.io);
//       s.onerror = rej;
//       document.head.appendChild(s);
//     });
//   }

//   try {
//     await loadSocketClient();
//     const socket = io();

//     // ⭐ IMPORTANT FIX #1 — join room directly when page opens
//     socket.on("connect", () => {
//       console.log("socket connected:", socket.id);
//       socket.emit("join-game", { gameId, playerName }); // ← automatic
//       socket.emit("get-game-state", { gameId });
//     });

//     // ⭐ IMPORTANT FIX #2 — update UI with FULL game state
//     socket.on("player-joined", (p) => {
//       flashMessage(`${p.newPlayer} joined`);
//       applyGameState({ gameId, ...p });
//     });

//     socket.on("player-left", (p) => {
//       flashMessage(`${p.leftPlayer} left`);
//       applyGameState({ gameId, ...p });
//     });

//     socket.on("game-started", (p) => {
//       flashMessage("Game started");
//       applyGameState(p);
//     });

//     socket.on("game-state", (p) => applyGameState(p));

//     socket.on("disconnect", () => {
//       flashMessage("Disconnected — switching to polling");
//       pollingInterval = setInterval(pollUpdate, 2000);
//     });

//     if (startBtn) {
//       startBtn.addEventListener("click", async () => {
//         socket.emit("start-game", { gameId });
//         await fetch("/game/start", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ gameId }),
//         });
//       });
//     }

//     pollUpdate();

//   } catch {
//     pollingInterval = setInterval(pollUpdate, 2000);
//   }
// });

// document.getElementById('copyGameId').addEventListener('click', () => {
//     const text = gameIdElem.textContent.replace('Game ID: ', '');
//     navigator.clipboard.writeText(text)
//         .then(() => alert('Game ID copied!'))
//         .catch(err => alert('Failed to copy Game ID'));
// });






// const colorMap = {
//   red: "#ff4a4a",
//   blue: "#3aaaff",
//   green: "#4fff4f",
//   yellow: "#f5f54a"
// };

// window.addEventListener("load", async () => {
//   let playerName;
//   try {
//     const u = JSON.parse(localStorage.getItem("user") || "null");
//     playerName = u?.username || localStorage.getItem("playerName") || localStorage.getItem("username");
//   } catch {
//     playerName = localStorage.getItem("playerName") || localStorage.getItem("username");
//   }

//   const gameData = JSON.parse(localStorage.getItem("currentGame") || "null");
//   if (!gameData) {
//     document.getElementById("msg").innerText = "No game data found!";
//     return;
//   }
//   const { gameId } = gameData;

//   const startBtn = document.getElementById("startGameBtn");
//   if (startBtn) startBtn.style.display = "none";

//   const msgEl = document.getElementById("msg");
//   const playerList = document.getElementById("playerList");
//   const gameIdElem = document.getElementById("gameId");
//   const gameModeElem = document.getElementById("gameMode");
//   const gameStatusElem = document.getElementById("gameStatus");

//   function appendMessage(text) {
//     const p = document.createElement("p");
//     p.textContent = text;
//     msgEl.appendChild(p);
//     msgEl.scrollTop = msgEl.scrollHeight; // auto-scroll
//   }

//   function applyGameState(game) {
//     if (!game) return;

//     gameIdElem.textContent = "Game ID: " + game.gameId;
//     gameModeElem.textContent = "Mode: " + game.mode;
//     gameStatusElem.textContent = "Status: " + game.gameStatus;

//     playerList.innerHTML = "";
//     game.players.forEach((p) => {
//       const li = document.createElement("li");
//       li.style.color = colorMap[p.color] || "#fff";
//       li.style.fontSize = "20px";
//       li.style.margin = "6px 0";
//       li.textContent = `${p.playerName} (${p.color})`;
//       playerList.appendChild(li);
//     });

//     if (startBtn) {
//       if (game.players.length >= 2 && game.gameStatus === "waiting") startBtn.style.display = "block";
//       else startBtn.style.display = "none";
//     }
//   }

//   function loadSocketClient() {
//     return new Promise((res, rej) => {
//       if (window.io) return res(window.io);
//       const s = document.createElement("script");
//       s.src = "/socket.io/socket.io.js";
//       s.onload = () => res(window.io);
//       s.onerror = rej;
//       document.head.appendChild(s);
//     });
//   }

//   try {
//     await loadSocketClient();
//     const socket = io();

//     socket.on("connect", () => {
//       socket.emit("join-game", { gameId, playerName });
//       socket.emit("get-game-state", { gameId });
//     });

//     // real-time updates
//     socket.on("player-joined", (data) => {
//       appendMessage(`${data.newPlayer} joined the game`);
//       applyGameState({ gameId, ...data });
//     });

//     socket.on("player-left", (data) => {
//       appendMessage(`${data.leftPlayer} left the game`);
//       applyGameState({ gameId, ...data });
//     });

//     socket.on("game-started", (data) => {
//       appendMessage("Game started!");
//       applyGameState(data);
//       setTimeout(() => {
//         window.location.href = "../html_files/ludo_Classic.html";
//       }, 1000);
//     });

//     socket.on("dice-rolled", (data) => {
//       appendMessage(`${data.playerName} rolled a ${data.diceValue}`);
//     });

//     socket.on("turn-changed", (data) => {
//       appendMessage(`It's now ${data.currentPlayer}'s turn`);
//     });

//     if (startBtn) {
//       startBtn.addEventListener("click", () => {
//         socket.emit("start-game", { gameId });
//       });
//     }

//   } catch {
//     msgEl.innerText = "Socket failed, falling back to polling...";
//   }

//   // Copy Game ID button
//   document.getElementById('copyGameId').addEventListener('click', () => {
//     navigator.clipboard.writeText(gameId).then(() => alert('Game ID copied!'));
//   });
// });





const colorMap = {
  red: "#ff4a4a",
  blue: "#3aaaff",
  green: "#4fff4f",
  yellow: "#f5f54a"
};

window.addEventListener("load", async () => {
  let playerName;
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    playerName = u?.username || localStorage.getItem("playerName") || localStorage.getItem("username");
  } catch {
    playerName = localStorage.getItem("playerName") || localStorage.getItem("username");
  }

  const gameData = JSON.parse(localStorage.getItem("currentGame") || "null");
  if (!gameData) {
    document.getElementById("msg").innerText = "No game data found!";
    return;
  }

  const { gameId } = gameData;

  // ✅ STORE IN localStorage FOR board.js TO USE
  localStorage.setItem("currentGame", JSON.stringify({
    gameId: gameId,
    playerName: playerName,
    mode: gameData.mode || "online"
  }));

  console.log("✅ Stored in localStorage:", { gameId, playerName });

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
      li.textContent = `${p.playerName} (${p.color})`;
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

    // Real-time updates
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
      console.log("✅ Game started! Redirecting to board...");
      appendMessage("Game started!");
      applyGameState(data);

      // ✅ UPDATE localStorage WITH FINAL GAME STATE
      localStorage.setItem("currentGame", JSON.stringify({
        gameId: gameId,
        playerName: playerName,
        mode: data.mode || "online",
        players: data.players,
        currentTurn: data.currentTurn
      }));

      // Redirect to board after 2 seconds
      setTimeout(() => {
        console.log("Redirecting to board...");
        window.location.href = "../html_files/ludo_Classic.html";
      }, 2000);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data);
      appendMessage("❌ Error: " + data.message);
    });

    // Start Game button
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        console.log("Starting game...");
        socket.emit("start-game", { gameId });
      });
    }

  } catch (err) {
    console.error("Socket error:", err);
    msgEl.innerText = "Socket failed - Check console for details";
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