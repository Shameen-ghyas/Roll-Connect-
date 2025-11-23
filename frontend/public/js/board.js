// ==========================
//   SOCKET & GAME STATE
// ==========================
const socket = window.socket || io();
let gameId = null;
let playerName = null;
let gameData = null;
let myColor = null;

// ==========================
//       GLOBALS
// ==========================
const colors = ["red", "green", "yellow", "blue"];
const diceList = document.querySelectorAll(".dice");
let moveInProgress = false;
let isMyTurn = false;
let currentDiceValue = null;

// Safe spots where pawns cannot be captured
const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47];

// ==========================
//   BOARD PATHS
// ==========================
const boardPathRed = [
  { top: 182, left: 298 }, { top: 136.5, left: 298 }, { top: 95, left: 298 }, { top: 50, left: 298 }, { top: 8.5, left: 298 },
  { top: -33.5, left: 254 }, { top: -33.5, left: 207 }, { top: -33.5, left: 158 }, { top: -33.5, left: 107 }, { top: -33.5, left: 57 },
  { top: -33.5, left: 7 }, { top: -70, left: 7 }, { top: -112, left: 7 }, { top: -112, left: 57 }, { top: -112, left: 107 },
  { top: -112, left: 157 }, { top: -112, left: 207 }, { top: -112, left: 257 }, { top: -154, left: 298 }, { top: -194, left: 298 },
  { top: -241, left: 298 }, { top: -281, left: 298 }, { top: -329, left: 298 }, { top: -378, left: 298 }, { top: -378, left: 340 },
  { top: -378, left: 380 }, { top: -330, left: 380 }, { top: -284, left: 380 }, { top: -241, left: 380 }, { top: -194, left: 380 },
  { top: -154, left: 380 }, { top: -112, left: 423 }, { top: -112, left: 470 }, { top: -112, left: 520 }, { top: -112, left: 570 },
  { top: -112, left: 620 }, { top: -112, left: 665 }, { top: -69, left: 665 }, { top: -33.5, left: 665 }, { top: -33.5, left: 620 },
  { top: -33.5, left: 380 }, { top: -33.5, left: 570 }, { top: -33.5, left: 520 }, { top: -33.5, left: 470 }, { top: -33.5, left: 423 },
  { top: 8.5, left: 380 }, { top: 50, left: 380 }, { top: 95, left: 380 }, { top: 138, left: 380 }, { top: 182, left: 380 },
  { top: 225, left: 380 }, { top: 225, left: 340 }, { top: 225, left: 298 }
];

const boardPathGreen = [
  { top: 185, left: -117 }, { top: 143, left: -117 }, { top: 96, left: -117 }, { top: 50, left: -117 }, { top: 6, left: -117 },
  { top: -31, left: -163 }, { top: -31, left: -210 }, { top: -31, left: -260 }, { top: -31, left: -310 }, { top: -31, left: -360 },
  { top: -31, left: -410 }, { top: -70, left: -410 }, { top: -111, left: -410 }, { top: -111, left: -360 }, { top: -111, left: -310 },
  { top: -111, left: -260 }, { top: -111, left: -210 }, { top: -111, left: -163 }, { top: -155, left: -117 }, { top: -195, left: -117 },
  { top: -240, left: -117 }, { top: -280, left: -117 }, { top: -330, left: -117 }, { top: -375, left: -117 }, { top: -375, left: -78 },
  { top: -375, left: -38 }, { top: -330, left: -38 }, { top: -280, left: -38 }, { top: -240, left: -38 }, { top: -195, left: -38 },
  { top: -155, left: -38 }, { top: -111, left: 4 }, { top: -111, left: 53 }, { top: -111, left: 104 }, { top: -111, left: 153 },
  { top: -111, left: 200 }, { top: -111, left: 250 }, { top: -70, left: 250 }, { top: -31, left: 250 }, { top: -31, left: 200 },
  { top: -31, left: 153 }, { top: -31, left: 104 }, { top: -31, left: 53 }, { top: -31, left: 6 }, { top: 6, left: -37 },
  { top: 50, left: -37 }, { top: 96, left: -37 }, { top: 143, left: -37 }, { top: 185, left: -37 }, { top: 227, left: -37 },
  { top: 227, left: -77 }, { top: 227, left: -117 }
];

const boardPathYellow = [
  { top: 570, left: 298 }, { top: 520, left: 298 }, { top: 480, left: 298 }, { top: 430, left: 298 }, { top: 390, left: 298 },
  { top: 350, left: 255 }, { top: 350, left: 205 }, { top: 350, left: 155 }, { top: 350, left: 105 }, { top: 350, left: 55 },
  { top: 270, left: 5 }, { top: 310, left: 5 }, { top: 350, left: 5 }, { top: 270, left: 55 }, { top: 270, left: 105 },
  { top: 270, left: 155 }, { top: 270, left: 205 }, { top: 270, left: 255 }, { top: 229, left: 298 }, { top: 187, left: 298 },
  { top: 140, left: 298 }, { top: 100, left: 298 }, { top: 50, left: 298 }, { top: 6, left: 298 }, { top: 6, left: 340 },
  { top: 6, left: 380 }, { top: 50, left: 380 }, { top: 100, left: 380 }, { top: 140, left: 380 }, { top: 187, left: 380 },
  { top: 229, left: 380 }, { top: 270, left: 420 }, { top: 270, left: 470 }, { top: 270, left: 520 }, { top: 270, left: 570 },
  { top: 270, left: 620 }, { top: 270, left: 670 }, { top: 310, left: 670 }, { top: 350, left: 670 }, { top: 350, left: 620 },
  { top: 350, left: 380 }, { top: 350, left: 570 }, { top: 350, left: 520 }, { top: 350, left: 470 }, { top: 350, left: 420 },
  { top: 390, left: 380 }, { top: 430, left: 380 }, { top: 480, left: 380 }, { top: 520, left: 380 }, { top: 570, left: 380 },
  { top: 610, left: 380 }, { top: 610, left: 340 }, { top: 610, left: 298 }
];

const boardPathBlue = [
  { top: 570, left: -115 }, { top: 520, left: -115 }, { top: 478, left: -115 }, { top: 438, left: -115 }, { top: 390, left: -115 },
  { top: 350, left: -160 }, { top: 350, left: -210 }, { top: 350, left: -260 }, { top: 350, left: -310 }, { top: 350, left: -360 },
  { top: 350, left: -410 }, { top: 310, left: -410 }, { top: 270, left: -410 }, { top: 270, left: -360 }, { top: 270, left: -310 },
  { top: 270, left: -260 }, { top: 270, left: -210 }, { top: 270, left: -160 }, { top: 230, left: -115 }, { top: 185, left: -115 },
  { top: 140, left: -115 }, { top: 95, left: -115 }, { top: 50, left: -115 }, { top: 5, left: -115 }, { top: 5, left: -75 },
  { top: 5, left: -35 }, { top: 50, left: -35 }, { top: 95, left: -35 }, { top: 140, left: -35 }, { top: 185, left: -35 },
  { top: 230, left: -35 }, { top: 270, left: 5 }, { top: 270, left: 55 }, { top: 270, left: 105 }, { top: 270, left: 155 },
  { top: 270, left: 205 }, { top: 270, left: 255 }, { top: 310, left: 255 }, { top: 350, left: 255 }, { top: 350, left: 205 },
  { top: 350, left: 155 }, { top: 350, left: 105 }, { top: 350, left: 55 }, { top: 350, left: 5 }, { top: 390, left: -35 },
  { top: 438, left: -35 }, { top: 478, left: -35 }, { top: 520, left: -35 }, { top: 570, left: -35 }, { top: 610, left: -35 },
  { top: 610, left: -75 }, { top: 610, left: -115 }
];

const redHomePath = [
  { top: 184, left: 340 }, { top: 140, left: 340 }, { top: 95, left: 340 }, { top: 48, left: 340 }, { top: 4, left: 340 }
];

const greenHomePath = [
  { top: -70, left: 200 }, { top: -70, left: 152 }, { top: -70, left: 104 }, { top: -70, left: 53 }, { top: -70, left: 4 }
];

const yellowHomePath = [
  { top: 310, left: 55 }, { top: 310, left: 105 }, { top: 310, left: 155 }, { top: 310, left: 205 }, { top: 310, left: 255 }
];

const blueHomePath = [
  { top: 50, left: -75 }, { top: 95, left: -75 }, { top: 140, left: -75 }, { top: 185, left: -75 }, { top: 230, left: -75 }
];

const colorPaths = {
  red: boardPathRed,
  green: boardPathGreen,
  yellow: boardPathYellow,
  blue: boardPathBlue
};

const homePaths = {
  red: redHomePath,
  green: greenHomePath,
  yellow: yellowHomePath,
  blue: blueHomePath
};

const pawns = {
  red: ["red1", "red2", "red3", "red4"].map(id => document.getElementById(id)),
  green: ["green1", "green2", "green3", "green4"].map(id => document.getElementById(id)),
  yellow: ["yellow1", "yellow2", "yellow3", "yellow4"].map(id => document.getElementById(id)),
  blue: ["blue1", "blue2", "blue3", "blue4"].map(id => document.getElementById(id))
};

Object.values(pawns).forEach(list => list.forEach(p => p.dataset.index = "-1"));

// ==========================
//   UTILITY FUNCTIONS
// ==========================
function rollDiceVisual(dice, number) {
  dice.style.animation = "rolling 1s";
  setTimeout(() => {
    const angles = {
      1: "rotateX(0deg) rotateY(0deg)",
      2: "rotateX(-90deg) rotateY(0deg)",
      3: "rotateX(0deg) rotateY(90deg)",
      4: "rotateX(0deg) rotateY(-90deg)",
      5: "rotateX(90deg) rotateY(0deg)",
      6: "rotateX(180deg) rotateY(0deg)"
    };
    dice.style.transform = angles[number];
    dice.style.animation = "none";
  }, 1000);
}

function canPawnMove(pawnData, diceValue) {
  if (pawnData.position === -1 && diceValue === 6) return true;
  
  if (pawnData.position >= 0 && !pawnData.isHome) {
    const newPos = pawnData.position + diceValue;
    return newPos <= 57;
  }
  
  return false;
}

// ==========================
//   UI UPDATES
// ==========================
function updateGameUI() {
  if (!gameData) return;

  console.log("🔄 Updating UI...");

  // Update all player names
  gameData.players.forEach(p => {
    const elem = document.getElementById(`${p.color}-name`);
    if (elem) {
      elem.textContent = p.playerName;
    }
  });

  const currentPlayer = gameData.players[gameData.currentTurn];
  const currentColor = currentPlayer.color;
  
  isMyTurn = currentPlayer.playerName.trim() === playerName.trim();

  console.log(`Current: "${currentPlayer.playerName}" | Me: "${playerName}" | My Turn: ${isMyTurn}`);

  // Update turn indicator
  let turnIndicator = document.getElementById('turn-indicator');
  if (!turnIndicator) {
    turnIndicator = document.createElement('div');
    turnIndicator.id = 'turn-indicator';
    turnIndicator.style.cssText = 'position:fixed;top:50px;right:10px;padding:10px 20px;border-radius:5px;z-index:9999;font-weight:bold;transition:all 0.3s;';
    document.body.appendChild(turnIndicator);
  }
  
  if (isMyTurn) {
    turnIndicator.style.background = '#4CAF50';
    turnIndicator.style.color = 'white';
    turnIndicator.textContent = '🎲 YOUR TURN - ROLL DICE!';
    turnIndicator.style.fontSize = '18px';
  } else {
    turnIndicator.style.background = 'rgba(0,0,0,0.8)';
    turnIndicator.style.color = 'white';
    turnIndicator.textContent = `⏳ Waiting for ${currentPlayer.playerName}...`;
    turnIndicator.style.fontSize = '16px';
  }

  // Enable/disable dice
  diceList.forEach(dice => {
    const slot = dice.parentElement;
    let diceColor = null;

    if (slot.classList.contains('red-dice-slot')) diceColor = 'red';
    else if (slot.classList.contains('green-dice-slot')) diceColor = 'green';
    else if (slot.classList.contains('yellow-dice-slot')) diceColor = 'yellow';
    else if (slot.classList.contains('blue-dice-slot')) diceColor = 'blue';

    if (diceColor === currentColor && isMyTurn) {
      dice.style.pointerEvents = "auto";
      dice.style.opacity = "1";
      dice.classList.add("glow");
    } else {
      dice.style.pointerEvents = "none";
      dice.style.opacity = "0.5";
      dice.classList.remove("glow");
    }
  });
}

function highlightSelectablePawns(diceNum) {
  if (!isMyTurn || !gameData) return;

  removeAllHighlights();
  const currentPlayer = gameData.players[gameData.currentTurn];
  const currentColor = currentPlayer.color;

  let hasMovablePawn = false;

  currentPlayer.pawns.forEach((pawnData, idx) => {
    const pawn = document.getElementById(`${currentColor}${idx + 1}`);
    
    if (canPawnMove(pawnData, diceNum)) {
      hasMovablePawn = true;
      pawn.classList.add("selectable");
      pawn.style.cursor = "pointer";
      pawn.onclick = () => movePawnRequest(idx);
    }
  });

  if (!hasMovablePawn) {
    console.log("❌ No valid moves");
    alert(`No valid moves! Turn will be skipped.`);
    setTimeout(() => {
      socket.emit('next-turn', { gameId });
    }, 1500);
  }
}

function removeAllHighlights() {
  Object.values(pawns).forEach(colorPawns => {
    colorPawns.forEach(pawn => {
      pawn.classList.remove("selectable");
      pawn.style.cursor = "default";
      pawn.onclick = null;
    });
  });
}

// ==========================
//   PAWN MOVEMENT
// ==========================
function movePawnRequest(pawnId) {
  if (moveInProgress || !isMyTurn) return;
  moveInProgress = true;
  removeAllHighlights();

  console.log(`📤 Moving pawn: ${pawnId}`);
  socket.emit('move-pawn', {
    gameId: gameId,
    playerName: playerName,
    pawnId: pawnId
  });
}

// ==========================
//   DICE CLICK
// ==========================
function handleDiceClick(event) {
  console.log("🎲 Dice clicked!");

  if (moveInProgress) {
    console.log("❌ Move in progress");
    return;
  }
  
  if (!isMyTurn) {
    console.log("❌ Not my turn");
    alert("It's not your turn!");
    return;
  }

  const dice = event.target.closest(".dice");
  if (!dice) return;

  const diceValue = Math.floor(Math.random() * 6) + 1;
  // currentDiceValue = diceValue;
  
  console.log(`✅ Rolled: ${diceValue}`);
  
  rollDiceVisual(dice, diceValue);

  socket.emit('roll-dice', {
    gameId: gameId,
    playerName: playerName,
    diceValue: diceValue 
  });


  setTimeout(() => {
    // ✅ CRITICAL: Refresh game state before highlighting
    socket.emit('get-game-state', { gameId });
    
    setTimeout(() => {
      if (currentDiceValue && isMyTurn) {
        highlightSelectablePawns(currentDiceValue);
      }
    }, 300);
  }, 1200);
}

// ==========================
//   SOCKET EVENTS
// ==========================

socket.on('game-state', (data) => {
  gameData = data;
  gameId = data.gameId;
  
  const me = gameData.players.find(p => p.playerName.trim() === playerName.trim());
  if (me) myColor = me.color;

  console.log('📥 Game state received');
  updateGameUI();
});

socket.on('game-started', (data) => {
  gameData = data;
  console.log('🎮 Game started!');
  updateGameUI();
});

// ✅ CRITICAL FIX: Listen to dice-rolled and auto-update UI
socket.on('dice-rolled', (data) => {
  console.log('🎲 Dice rolled by:', data.playerName);

  // Find the player who rolled
  const rollingPlayer = gameData.players.find(p => p.playerName === data.playerName);
  if (!rollingPlayer) return;

  const diceColor = rollingPlayer.color;
  
  // Animate the dice for ALL players
  const diceElement = Array.from(diceList).find(d => {
    const slot = d.parentElement;
    if (diceColor === 'red') return slot.classList.contains('red-dice-slot');
    if (diceColor === 'green') return slot.classList.contains('green-dice-slot');
    if (diceColor === 'yellow') return slot.classList.contains('yellow-dice-slot');
    if (diceColor === 'blue') return slot.classList.contains('blue-dice-slot');
  });

  if (diceElement) {
    rollDiceVisual(diceElement, data.diceValue);
  }

  currentDiceValue = data.diceValue;
  
  // ✅ Show notification to other players
  if (data.playerName.trim() !== playerName.trim()) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:120px;right:10px;padding:15px;background:#2196F3;color:white;border-radius:5px;z-index:9999;font-weight:bold;animation:slideIn 0.3s;';
    notification.textContent = `${data.playerName} rolled ${data.diceValue}`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
});

// ✅ CRITICAL FIX: Auto-update pawn positions for ALL players
socket.on('pawn-moved', (data) => {
  console.log('♟️ Pawn moved:', data);

  const pawnElement = document.getElementById(`${data.color}${data.pawnId + 1}`);
  if (!pawnElement) return;

  const path = colorPaths[data.color];
  const homePath = homePaths[data.color];

  if (data.isHome) {
    const homeIdx = data.newPosition - 52;
    if (homePath[homeIdx]) {
      pawnElement.style.top = homePath[homeIdx].top + "px";
      pawnElement.style.left = homePath[homeIdx].left + "px";
    }
  } else {
    if (path[data.newPosition]) {
      pawnElement.style.top = path[data.newPosition].top + "px";
      pawnElement.style.left = path[data.newPosition].left + "px";
    }
  }

  moveInProgress = false;
  currentDiceValue = null;
  
  // ✅ CRITICAL: Refresh game state immediately
  setTimeout(() => {
    socket.emit('get-game-state', { gameId });
  }, 300);
});

// ✅ CRITICAL FIX: Auto-update UI when turn changes
socket.on('turn-changed', (data) => {
  console.log('🔄 Turn changed to:', data.currentPlayer);
  
  // Update gameData first
  if (gameData) {
    gameData.currentTurn = data.currentTurn;
  }
  
  moveInProgress = false;
  currentDiceValue = null;
  removeAllHighlights();
  
  // ✅ Refresh game state to ensure sync
  socket.emit('get-game-state', { gameId });
  
  // Update UI immediately
  updateGameUI();
  
  // ✅ Show turn notification
  const notification = document.createElement('div');
  notification.style.cssText = 'position:fixed;top:120px;right:10px;padding:15px;background:#FF9800;color:white;border-radius:5px;z-index:9999;font-weight:bold;animation:slideIn 0.3s;';
  notification.textContent = `Turn: ${data.currentPlayer}`;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 2500);
});

socket.on('extra-turn-granted', (data) => {
  console.log('🎉 Extra turn!');
  alert(`🎉 ${data.currentPlayer} gets another turn!`);
  moveInProgress = false;
  currentDiceValue = null;
  
  // ✅ Refresh state
  socket.emit('get-game-state', { gameId });
  updateGameUI();
});

socket.on('pawn-captured', (data) => {
  console.log('💥 Pawn captured:', data);
  alert(`${data.message}`);
  
  const capturedPawn = document.getElementById(`${data.capturedPlayer}${data.capturedPawnId + 1}`);
  if (capturedPawn) {
    capturedPawn.style.top = "83px";
    capturedPawn.style.left = "72.5px";
  }
  
  // ✅ Refresh state
  socket.emit('get-game-state', { gameId });
});

socket.on('player-finished', (data) => {
  console.log('🏁 Player finished:', data);
  alert(`🎉 ${data.playerName} finished at Rank ${data.rank}!`);
});

socket.on('game-over', (data) => {
  console.log('🏆 Game over:', data);
  let message = data.message + "\n\n";
  data.rankings.forEach((r, i) => {
    message += `${i + 1}. ${r.playerName} (${r.color})\n`;
  });
  alert(message);
  window.location.href = '/';
});

socket.on('error', (data) => {
  console.error('❌ Error:', data);
  alert('Error: ' + data.message);
  moveInProgress = false;
  currentDiceValue = null;
});

// ✅ CRITICAL: Auto-refresh game state every 2 seconds as backup
setInterval(() => {
  if (gameId && socket.connected) {
    socket.emit('get-game-state', { gameId });
  }
}, 2000);

// ==========================
//   INITIALIZATION
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");
  
  let storedPlayerName = sessionStorage.getItem("myPlayerName");
  
  if (storedPlayerName) {
    console.log("📌 Found player name:", storedPlayerName);
    playerName = storedPlayerName;
    
    const localGame = localStorage.getItem("currentGame") ? JSON.parse(localStorage.getItem("currentGame")) : null;
    if (localGame) {
      gameId = localGame.gameId;
    }
  } else {
    const gameInfo = localStorage.getItem("currentGame") ? JSON.parse(localStorage.getItem("currentGame")) : null;
    
    if (gameInfo) {
      gameId = gameInfo.gameId;
      playerName = gameInfo.playerName;
      
      sessionStorage.setItem("myPlayerName", playerName);
      console.log("💾 Saved player name:", playerName);
    }
  }

  if (!gameId || !playerName) {
    console.error("❌ Missing game info");
    alert("⚠️ No game info found!");
    return;
  }

  console.log(`✅ Game: ${gameId}, Player: ${playerName}`);

  // Show player indicator
  const indicator = document.createElement('div');
  indicator.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:white;padding:10px 20px;border-radius:5px;z-index:9999;font-weight:bold;font-size:18px;';
  indicator.textContent = `YOU ARE: ${playerName}`;
  document.body.appendChild(indicator);

  // Add dice listeners
  diceList.forEach((dice) => {
    dice.addEventListener("click", handleDiceClick);
  });


  // ✅ Join game room and get initial state
  setTimeout(() => {
    socket.emit('join-game', { gameId, playerName });
    socket.emit('get-game-state', { gameId });
  }, 500);
});