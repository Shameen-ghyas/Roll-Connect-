// Connect frontend to backend socket server
const socket = io("http://localhost:5000");

// Confirm connection
socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});

// Handle events
socket.on("player-joined", (data) => {
  console.log("New player joined:", data.newPlayer);
});

socket.on("game-started", (data) => {
  console.log("🎮 Game started:", data);
});
