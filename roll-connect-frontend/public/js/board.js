// document.addEventListener("DOMContentLoaded", () => {

//     const socket = window.socket;  // use existing socket

//     const gameId = localStorage.getItem("currentGame")
//         ? JSON.parse(localStorage.getItem("currentGame")).gameId
//         : null;

//     if (!gameId) return;

//     socket.emit("get-game-state", { gameId });

//     socket.on("game-state", (game) => {
//         if (!game || !game.players) return;

//         game.players.forEach(p => {
//             if (p.color === "yellow") document.getElementById("yellow-name").textContent = p.playerName;
//             if (p.color === "blue")   document.getElementById("blue-name").textContent   = p.playerName;
//             if (p.color === "red")    document.getElementById("red-name").textContent    = p.playerName;
//             if (p.color === "green")  document.getElementById("green-name").textContent  = p.playerName;
//         });
//     });

// });




// // ==========================
// //       GLOBALS
// // ==========================
// let currentPlayer = 0; // 0=red, 1=green, 2=yellow, 3=blue
// const colors = ["red", "green", "yellow", "blue"];
// const diceList = document.querySelectorAll(".dice");
// let moveInProgress = false;
// let lastRoll = null;

// // ==========================
// //   BOARD PATHS (52 positions each)
// // ==========================
// const boardPathRed = [
//   { top: 182, left: 298 }, { top: 136.5, left: 298 }, { top: 95, left: 298 }, { top: 50, left: 298 }, { top: 8.5, left: 298 },
//   { top: -33.5, left: 254 }, { top: -33.5, left: 207 }, { top: -33.5, left: 158 }, { top: -33.5, left: 107 }, { top: -33.5, left: 57 },
//   { top: -33.5, left: 7 }, { top: -70, left: 7 }, { top: -112, left: 7 }, { top: -112, left: 57 }, { top: -112, left: 107 },
//   { top: -112, left: 157 }, { top: -112, left: 207 }, { top: -112, left: 257 }, { top: -154, left: 298 }, { top: -194, left: 298 },
//   { top: -241, left: 298 }, { top: -281, left: 298 }, { top: -329, left: 298 }, { top: -378, left: 298 }, { top: -378, left: 340 },
//   { top: -378, left: 380 }, { top: -330, left: 380 }, { top: -284, left: 380 }, { top: -241, left: 380 }, { top: -194, left: 380 },
//   { top: -154, left: 380 }, { top: -112, left: 423 }, { top: -112, left: 470 }, { top: -112, left: 520 }, { top: -112, left: 570 },
//   { top: -112, left: 620 }, { top: -112, left: 665 }, { top: -69, left: 665 }, { top: -33.5, left: 665 }, { top: -33.5, left: 620 },
//   { top: -33.5, left: 380 }, { top: -33.5, left: 570 }, { top: -33.5, left: 520 }, { top: -33.5, left: 470 }, { top: -33.5, left: 423 },
//   { top: 8.5, left: 380 }, { top: 50, left: 380 }, { top: 95, left: 380 }, { top: 138, left: 380 }, { top: 182, left: 380 },
//   { top: 225, left: 380 }, { top: 225, left: 340 }, { top: 225, left: 298 }
// ];

// const boardPathGreen = [
//   { top: 185, left: -117 }, { top: 143, left: -117 }, { top: 96, left: -117 }, { top: 50, left: -117 }, { top: 6, left: -117 },
//   { top: -31, left: -163 }, { top: -31, left: -210 }, { top: -31, left: -260 }, { top: -31, left: -310 }, { top: -31, left: -360 },
//   { top: -31, left: -410 }, { top: -70, left: -410 }, { top: -111, left: -410 }, { top: -111, left: -360 }, { top: -111, left: -310 },
//   { top: -111, left: -260 }, { top: -111, left: -210 }, { top: -111, left: -163 }, { top: -155, left: -117 }, { top: -195, left: -117 },
//   { top: -240, left: -117 }, { top: -280, left: -117 }, { top: -330, left: -117 }, { top: -375, left: -117 }, { top: -375, left: -78 },
//   { top: -375, left: -38 }, { top: -330, left: -38 }, { top: -280, left: -38 }, { top: -240, left: -38 }, { top: -195, left: -38 },
//   { top: -155, left: -38 }, { top: -111, left: 4 }, { top: -111, left: 53 }, { top: -111, left: 104 }, { top: -111, left: 153 },
//   { top: -111, left: 200 }, { top: -111, left: 250 }, { top: -70, left: 250 }, { top: -31, left: 250 }, { top: -31, left: 200 },
//   { top: -31, left: 153 }, { top: -31, left: 104 }, { top: -31, left: 53 }, { top: -31, left: 6 }, { top: 6, left: -37 },
//   { top: 50, left: -37 }, { top: 96, left: -37 }, { top: 143, left: -37 }, { top: 185, left: -37 }, { top: 227, left: -37 },
//   { top: 227, left: -77 }, { top: 227, left: -117 }
// ];

// const boardPathYellow = [
//   { top: 570, left: 298 }, { top: 520, left: 298 }, { top: 480, left: 298 }, { top: 430, left: 298 }, { top: 390, left: 298 },
//   { top: 350, left: 255 }, { top: 350, left: 205 }, { top: 350, left: 155 }, { top: 350, left: 105 }, { top: 350, left: 55 },
//   { top: 270, left: 5 }, { top: 310, left: 5 }, { top: 350, left: 5 }, { top: 270, left: 55 }, { top: 270, left: 105 },
//   { top: 270, left: 155 }, { top: 270, left: 205 }, { top: 270, left: 255 }, { top: 229, left: 298 }, { top: 187, left: 298 },
//   { top: 140, left: 298 }, { top: 100, left: 298 }, { top: 50, left: 298 }, { top: 6, left: 298 }, { top: 6, left: 340 },
//   { top: 6, left: 380 }, { top: 50, left: 380 }, { top: 100, left: 380 }, { top: 140, left: 380 }, { top: 187, left: 380 },
//   { top: 229, left: 380 }, { top: 270, left: 420 }, { top: 270, left: 470 }, { top: 270, left: 520 }, { top: 270, left: 570 },
//   { top: 270, left: 620 }, { top: 270, left: 670 }, { top: 310, left: 670 }, { top: 350, left: 670 }, { top: 350, left: 620 },
//   { top: 350, left: 380 }, { top: 350, left: 570 }, { top: 350, left: 520 }, { top: 350, left: 470 }, { top: 350, left: 420 },
//   { top: 390, left: 380 }, { top: 430, left: 380 }, { top: 480, left: 380 }, { top: 520, left: 380 }, { top: 570, left: 380 },
//   { top: 610, left: 380 }, { top: 610, left: 340 }, { top: 610, left: 298 }
// ];

// const boardPathBlue = [
//   { top: 570, left: -115 }, { top: 520, left: -115 }, { top: 478, left: -115 }, { top: 438, left: -115 }, { top: 390, left: -115 },
//   { top: 350, left: -160 }, { top: 350, left: -210 }, { top: 350, left: -260 }, { top: 350, left: -310 }, { top: 350, left: -360 },
//   { top: 350, left: -410 }, { top: 310, left: -410 }, { top: 270, left: -410 }, { top: 270, left: -360 }, { top: 270, left: -310 },
//   { top: 270, left: -260 }, { top: 270, left: -210 }, { top: 270, left: -160 }, { top: 230, left: -115 }, { top: 185, left: -115 },
//   { top: 140, left: -115 }, { top: 95, left: -115 }, { top: 50, left: -115 }, { top: 5, left: -115 }, { top: 5, left: -75 },
//   { top: 5, left: -35 }, { top: 50, left: -35 }, { top: 95, left: -35 }, { top: 140, left: -35 }, { top: 185, left: -35 },
//   { top: 230, left: -35 }, { top: 270, left: 5 }, { top: 270, left: 55 }, { top: 270, left: 105 }, { top: 270, left: 155 },
//   { top: 270, left: 205 }, { top: 270, left: 255 }, { top: 310, left: 255 }, { top: 350, left: 255 }, { top: 350, left: 205 },
//   { top: 350, left: 155 }, { top: 350, left: 105 }, { top: 350, left: 55 }, { top: 350, left: 5 }, { top: 390, left: -35 },
//   { top: 438, left: -35 }, { top: 478, left: -35 }, { top: 520, left: -35 }, { top: 570, left: -35 }, { top: 610, left: -35 },
//   { top: 610, left: -75 }, { top: 610, left: -115 }
// ];

// // Home paths (5 positions each)
// const redHomePath = [
//   { top: 184, left: 340 }, { top: 140, left: 340 }, { top: 95, left: 340 }, { top: 48, left: 340 }, { top: 4, left: 340 }
// ];

// const greenHomePath = [
//   { top: -70, left: 200 }, { top: -70, left: 152 }, { top: -70, left: 104 }, { top: -70, left: 53 }, { top: -70, left: 4 }
// ];

// const yellowHomePath = [
//   { top: 310, left: 55 }, { top: 310, left: 105 }, { top: 310, left: 155 }, { top: 310, left: 205 }, { top: 310, left: 255 }
// ];

// const blueHomePath = [
//   { top: 50, left: -75 }, { top: 95, left: -75 }, { top: 140, left: -75 }, { top: 185, left: -75 }, { top: 230, left: -75 }
// ];

// // Path mapping
// const colorPaths = {
//   red: boardPathRed,
//   green: boardPathGreen,
//   yellow: boardPathYellow,
//   blue: boardPathBlue
// };

// const homePaths = {
//   red: redHomePath,
//   green: greenHomePath,
//   yellow: yellowHomePath,
//   blue: blueHomePath
// };

// // Board entry index for each color
// const startPosition = {
//   red: 0,
//   green: 39,
//   yellow: 13,
//   blue: 26
// };

// // Pawns reference
// const pawns = {
//   red: ["red1", "red2", "red3", "red4"].map(id => document.getElementById(id)),
//   green: ["green1", "green2", "green3", "green4"].map(id => document.getElementById(id)),
//   yellow: ["yellow1", "yellow2", "yellow3", "yellow4"].map(id => document.getElementById(id)),
//   blue: ["blue1", "blue2", "blue3", "blue4"].map(id => document.getElementById(id))
// };

// // Create proper dice mapping based on slot class
// const diceByColor = {};
// diceList.forEach(dice => {
//   const slot = dice.parentElement;
//   if (slot.classList.contains('red-dice-slot')) diceByColor['red'] = dice;
//   else if (slot.classList.contains('green-dice-slot')) diceByColor['green'] = dice;
//   else if (slot.classList.contains('yellow-dice-slot')) diceByColor['yellow'] = dice;
//   else if (slot.classList.contains('blue-dice-slot')) diceByColor['blue'] = dice;
// });

// console.log('Dice by Color:', diceByColor);

// // Initialize pawns at home
// Object.values(pawns).forEach(list => list.forEach(p => p.dataset.index = "-1"));

// // ==========================
// //   UTILITY FUNCTIONS
// // ==========================
// function randomDice() {
//   return Math.floor(Math.random() * 6) + 1;
// }

// function rollDiceVisual(dice, number) {
//   dice.style.animation = "rolling 1s";
//   setTimeout(() => {
//     const angles = {
//       1: "rotateX(0deg) rotateY(0deg)",
//       2: "rotateX(-90deg) rotateY(0deg)",
//       3: "rotateX(0deg) rotateY(90deg)",
//       4: "rotateX(0deg) rotateY(-90deg)",
//       5: "rotateX(90deg) rotateY(0deg)",
//       6: "rotateX(180deg) rotateY(0deg)"
//     };
//     dice.style.transform = angles[number];
//     dice.style.animation = "none";
//   }, 1000);
// }

// // Animate pawn from index to index (tile by tile)
// async function animatePawnOnBoard(pawn, path, fromIdx, toIdx) {
//   return new Promise(resolve => {
//     const frames = [];
//     const pathLen = path.length;

//     // Build movement frames
//     if (toIdx >= fromIdx) {
//       for (let i = fromIdx; i <= toIdx; i++) frames.push(path[i]);
//     } else {
//       // Wrap around (complete circle)
//       for (let i = fromIdx; i < pathLen; i++) frames.push(path[i]);
//       for (let i = 0; i <= toIdx; i++) frames.push(path[i]);
//     }

//     let frameIdx = 0;
//     function moveNextTile() {
//       if (frameIdx >= frames.length) {
//         resolve();
//         return;
//       }
//       const pos = frames[frameIdx++];
//       pawn.style.top = pos.top + "px";
//       pawn.style.left = pos.left + "px";
//       setTimeout(moveNextTile, 100);
//     }
//     moveNextTile();
//   });
// }

// // Animate pawn into home path
// async function animatePawnIntoHome(pawn, homePath, steps) {
//   return new Promise(resolve => {
//     let idx = 0;
//     function moveNextStep() {
//       if (idx > steps) {
//         resolve();
//         return;
//       }
//       const pos = homePath[idx];
//       pawn.style.top = pos.top + "px";
//       pawn.style.left = pos.left + "px";
//       idx++;
//       setTimeout(moveNextStep, 100);
//     }
//     moveNextStep();
//   });
// }

// // ==========================
// //   TURN MANAGEMENT
// // ==========================
// function updateTurnUI() {
//   const currentColor = colors[currentPlayer];

//   // Enable only current player's dice
//   diceList.forEach((dice) => {
//     const slot = dice.parentElement;
//     let diceColor = null;
    
//     if (slot.classList.contains('red-dice-slot')) diceColor = 'red';
//     else if (slot.classList.contains('green-dice-slot')) diceColor = 'green';
//     else if (slot.classList.contains('yellow-dice-slot')) diceColor = 'yellow';
//     else if (slot.classList.contains('blue-dice-slot')) diceColor = 'blue';
    
//     if (diceColor === currentColor) {
//       dice.style.pointerEvents = "auto";
//       dice.style.opacity = "1";
//       dice.classList.add("glow");
//     } else {
//       dice.style.pointerEvents = "none";
//       dice.style.opacity = "0.5";
//       dice.classList.remove("glow");
//     }
//   });

//   lastRoll = null;
//   removeAllHighlights();
//   console.log(`Turn: ${currentColor}`);
// }

// function advancePlayerTurn() {
//   currentPlayer = (currentPlayer + 1) % 4;
//   updateTurnUI();
// }

// // ==========================
// //   PAWN SELECTION
// // ==========================
// function highlightSelectablePawns(diceNum) {
//   const currentColor = colors[currentPlayer];
//   removeAllHighlights();

//   const colorPawns = pawns[currentColor];
//   let hasMovablePawn = false;

//   colorPawns.forEach(pawn => {
//     const idx = parseInt(pawn.dataset.index);
//     let canMove = false;

//     // Home position (-1): only move with 6
//     if (idx === -1 && diceNum === 6) {
//       canMove = true;
//     }
//     // Already on board (0-51) or in home
//     else if (idx >= 0 || pawn.dataset.index === "home") {
//       canMove = true;
//     }

//     if (canMove) {
//       hasMovablePawn = true;
//       pawn.classList.add("selectable");
//       pawn.style.cursor = "pointer";
//       pawn.onclick = () => movePawn(pawn, diceNum);
//     }
//   });

//   // If no pawn can move, auto-advance turn
//   if (!hasMovablePawn) {
//     console.log(`${currentColor} has no movable pawns. Passing turn...`);
//     advancePlayerTurn();
//   }
// }

// function removeAllHighlights() {
//   Object.values(pawns).forEach(colorPawns => {
//     colorPawns.forEach(pawn => {
//       pawn.classList.remove("selectable");
//       pawn.style.cursor = "default";
//       pawn.onclick = null;
//     });
//   });
// }

// // ==========================
// //   PAWN MOVEMENT
// // ==========================
// async function movePawn(pawn, steps) {
//   moveInProgress = true;
//   removeAllHighlights();

//   const currentColor = colors[currentPlayer];
//   const path = colorPaths[currentColor];
//   const homePath = homePaths[currentColor];
//   const startIdx = startPosition[currentColor];

//   let currentIdx = parseInt(pawn.dataset.index);

//   // Release pawn from home
//   if (currentIdx === -1) {
//     // Place at board starting position
//     const startCoord = path[startIdx];
//     pawn.style.top = startCoord.top + "px";
//     pawn.style.left = startCoord.left + "px";
//     pawn.dataset.index = startIdx;
//     console.log(`${currentColor} pawn released to position ${startIdx}`);
//   } else {
//     // Move on board
//     const homeEntryIdx = startIdx + 51; // Last position before home
//     let nextIdx = currentIdx + steps;

//     // Check if entering home
//     if (currentIdx < homeEntryIdx && nextIdx >= homeEntryIdx) {
//       // Animate to board end
//       await animatePawnOnBoard(pawn, path, currentIdx, homeEntryIdx - 1);
//       // Animate into home
//       const stepsInHome = nextIdx - homeEntryIdx;
//       await animatePawnIntoHome(pawn, homePath, stepsInHome);
//       pawn.dataset.index = "home";
//       console.log(`${currentColor} pawn entered home`);
//     } else if (pawn.dataset.index === "home") {
//       // Already in home, can't move further
//       moveInProgress = false;
//       return;
//     } else {
//       // Normal board movement (wrap around)
//       nextIdx = nextIdx % 52;
//       await animatePawnOnBoard(pawn, path, currentIdx, nextIdx);
//       pawn.dataset.index = nextIdx;
//       console.log(`${currentColor} pawn moved to position ${nextIdx}`);
//     }
//   }

//   moveInProgress = false;

//   // Turn logic
//   if (steps === 6) {
//     // Rolled 6: Get another turn (don't advance player)
//     console.log(`${currentColor} rolled 6 - another turn!`);
//     updateTurnUI();
//   } else {
//     // Not 6: Advance to next player
//     console.log(`${currentColor} rolled ${steps} - turn passed`);
//     advancePlayerTurn();
//   }
// }

// // ==========================
// //   DICE CLICK HANDLER
// // ==========================
// function handleDiceClick(event) {
//   if (moveInProgress) return;

//   const dice = event.target.closest(".dice");
//   if (!dice) return;

//   const diceColor = colors[currentPlayer];

//   // Roll dice
//   const rolled = randomDice();
//   lastRoll = rolled;

//   console.log(`${diceColor} rolled: ${rolled}`);

//   rollDiceVisual(dice, rolled);

//   // Show pawns that can move after dice animation (1200ms for dice roll)
//   setTimeout(() => {
//     highlightSelectablePawns(rolled);
//   }, 1200);
// }

// // ==========================
// //   INITIALIZE GAME
// // ==========================
// diceList.forEach(dice => {
//   dice.addEventListener("click", handleDiceClick);
// });

// updateTurnUI();
// console.log("Ludo game initialized - Red's turn");



 // ==========================
//   SOCKET & GAME STATE
// ==========================
// const socket = window.socket || io();
// let gameId = null;
// let playerName = null;
// let gameData = null;
// let myColor = null;

// // ==========================
// //       GLOBALS
// // ==========================
// const colors = ["red", "green", "yellow", "blue"];
// const diceList = document.querySelectorAll(".dice");
// let moveInProgress = false;
// let isMyTurn = false;

// // ==========================
// //   BOARD PATHS
// // ==========================
// const boardPathRed = [
//   { top: 182, left: 298 }, { top: 136.5, left: 298 }, { top: 95, left: 298 }, { top: 50, left: 298 }, { top: 8.5, left: 298 },
//   { top: -33.5, left: 254 }, { top: -33.5, left: 207 }, { top: -33.5, left: 158 }, { top: -33.5, left: 107 }, { top: -33.5, left: 57 },
//   { top: -33.5, left: 7 }, { top: -70, left: 7 }, { top: -112, left: 7 }, { top: -112, left: 57 }, { top: -112, left: 107 },
//   { top: -112, left: 157 }, { top: -112, left: 207 }, { top: -112, left: 257 }, { top: -154, left: 298 }, { top: -194, left: 298 },
//   { top: -241, left: 298 }, { top: -281, left: 298 }, { top: -329, left: 298 }, { top: -378, left: 298 }, { top: -378, left: 340 },
//   { top: -378, left: 380 }, { top: -330, left: 380 }, { top: -284, left: 380 }, { top: -241, left: 380 }, { top: -194, left: 380 },
//   { top: -154, left: 380 }, { top: -112, left: 423 }, { top: -112, left: 470 }, { top: -112, left: 520 }, { top: -112, left: 570 },
//   { top: -112, left: 620 }, { top: -112, left: 665 }, { top: -69, left: 665 }, { top: -33.5, left: 665 }, { top: -33.5, left: 620 },
//   { top: -33.5, left: 380 }, { top: -33.5, left: 570 }, { top: -33.5, left: 520 }, { top: -33.5, left: 470 }, { top: -33.5, left: 423 },
//   { top: 8.5, left: 380 }, { top: 50, left: 380 }, { top: 95, left: 380 }, { top: 138, left: 380 }, { top: 182, left: 380 },
//   { top: 225, left: 380 }, { top: 225, left: 340 }, { top: 225, left: 298 }
// ];

// const boardPathGreen = [
//   { top: 185, left: -117 }, { top: 143, left: -117 }, { top: 96, left: -117 }, { top: 50, left: -117 }, { top: 6, left: -117 },
//   { top: -31, left: -163 }, { top: -31, left: -210 }, { top: -31, left: -260 }, { top: -31, left: -310 }, { top: -31, left: -360 },
//   { top: -31, left: -410 }, { top: -70, left: -410 }, { top: -111, left: -410 }, { top: -111, left: -360 }, { top: -111, left: -310 },
//   { top: -111, left: -260 }, { top: -111, left: -210 }, { top: -111, left: -163 }, { top: -155, left: -117 }, { top: -195, left: -117 },
//   { top: -240, left: -117 }, { top: -280, left: -117 }, { top: -330, left: -117 }, { top: -375, left: -117 }, { top: -375, left: -78 },
//   { top: -375, left: -38 }, { top: -330, left: -38 }, { top: -280, left: -38 }, { top: -240, left: -38 }, { top: -195, left: -38 },
//   { top: -155, left: -38 }, { top: -111, left: 4 }, { top: -111, left: 53 }, { top: -111, left: 104 }, { top: -111, left: 153 },
//   { top: -111, left: 200 }, { top: -111, left: 250 }, { top: -70, left: 250 }, { top: -31, left: 250 }, { top: -31, left: 200 },
//   { top: -31, left: 153 }, { top: -31, left: 104 }, { top: -31, left: 53 }, { top: -31, left: 6 }, { top: 6, left: -37 },
//   { top: 50, left: -37 }, { top: 96, left: -37 }, { top: 143, left: -37 }, { top: 185, left: -37 }, { top: 227, left: -37 },
//   { top: 227, left: -77 }, { top: 227, left: -117 }
// ];

// const boardPathYellow = [
//   { top: 570, left: 298 }, { top: 520, left: 298 }, { top: 480, left: 298 }, { top: 430, left: 298 }, { top: 390, left: 298 },
//   { top: 350, left: 255 }, { top: 350, left: 205 }, { top: 350, left: 155 }, { top: 350, left: 105 }, { top: 350, left: 55 },
//   { top: 270, left: 5 }, { top: 310, left: 5 }, { top: 350, left: 5 }, { top: 270, left: 55 }, { top: 270, left: 105 },
//   { top: 270, left: 155 }, { top: 270, left: 205 }, { top: 270, left: 255 }, { top: 229, left: 298 }, { top: 187, left: 298 },
//   { top: 140, left: 298 }, { top: 100, left: 298 }, { top: 50, left: 298 }, { top: 6, left: 298 }, { top: 6, left: 340 },
//   { top: 6, left: 380 }, { top: 50, left: 380 }, { top: 100, left: 380 }, { top: 140, left: 380 }, { top: 187, left: 380 },
//   { top: 229, left: 380 }, { top: 270, left: 420 }, { top: 270, left: 470 }, { top: 270, left: 520 }, { top: 270, left: 570 },
//   { top: 270, left: 620 }, { top: 270, left: 670 }, { top: 310, left: 670 }, { top: 350, left: 670 }, { top: 350, left: 620 },
//   { top: 350, left: 380 }, { top: 350, left: 570 }, { top: 350, left: 520 }, { top: 350, left: 470 }, { top: 350, left: 420 },
//   { top: 390, left: 380 }, { top: 430, left: 380 }, { top: 480, left: 380 }, { top: 520, left: 380 }, { top: 570, left: 380 },
//   { top: 610, left: 380 }, { top: 610, left: 340 }, { top: 610, left: 298 }
// ];

// const boardPathBlue = [
//   { top: 570, left: -115 }, { top: 520, left: -115 }, { top: 478, left: -115 }, { top: 438, left: -115 }, { top: 390, left: -115 },
//   { top: 350, left: -160 }, { top: 350, left: -210 }, { top: 350, left: -260 }, { top: 350, left: -310 }, { top: 350, left: -360 },
//   { top: 350, left: -410 }, { top: 310, left: -410 }, { top: 270, left: -410 }, { top: 270, left: -360 }, { top: 270, left: -310 },
//   { top: 270, left: -260 }, { top: 270, left: -210 }, { top: 270, left: -160 }, { top: 230, left: -115 }, { top: 185, left: -115 },
//   { top: 140, left: -115 }, { top: 95, left: -115 }, { top: 50, left: -115 }, { top: 5, left: -115 }, { top: 5, left: -75 },
//   { top: 5, left: -35 }, { top: 50, left: -35 }, { top: 95, left: -35 }, { top: 140, left: -35 }, { top: 185, left: -35 },
//   { top: 230, left: -35 }, { top: 270, left: 5 }, { top: 270, left: 55 }, { top: 270, left: 105 }, { top: 270, left: 155 },
//   { top: 270, left: 205 }, { top: 270, left: 255 }, { top: 310, left: 255 }, { top: 350, left: 255 }, { top: 350, left: 205 },
//   { top: 350, left: 155 }, { top: 350, left: 105 }, { top: 350, left: 55 }, { top: 350, left: 5 }, { top: 390, left: -35 },
//   { top: 438, left: -35 }, { top: 478, left: -35 }, { top: 520, left: -35 }, { top: 570, left: -35 }, { top: 610, left: -35 },
//   { top: 610, left: -75 }, { top: 610, left: -115 }
// ];

// const redHomePath = [
//   { top: 184, left: 340 }, { top: 140, left: 340 }, { top: 95, left: 340 }, { top: 48, left: 340 }, { top: 4, left: 340 }
// ];

// const greenHomePath = [
//   { top: -70, left: 200 }, { top: -70, left: 152 }, { top: -70, left: 104 }, { top: -70, left: 53 }, { top: -70, left: 4 }
// ];

// const yellowHomePath = [
//   { top: 310, left: 55 }, { top: 310, left: 105 }, { top: 310, left: 155 }, { top: 310, left: 205 }, { top: 310, left: 255 }
// ];

// const blueHomePath = [
//   { top: 50, left: -75 }, { top: 95, left: -75 }, { top: 140, left: -75 }, { top: 185, left: -75 }, { top: 230, left: -75 }
// ];

// const colorPaths = {
//   red: boardPathRed,
//   green: boardPathGreen,
//   yellow: boardPathYellow,
//   blue: boardPathBlue
// };

// const homePaths = {
//   red: redHomePath,
//   green: greenHomePath,
//   yellow: yellowHomePath,
//   blue: blueHomePath
// };

// const startPosition = {
//   red: 0,
//   green: 39,
//   yellow: 13,
//   blue: 26
// };

// const pawns = {
//   red: ["red1", "red2", "red3", "red4"].map(id => document.getElementById(id)),
//   green: ["green1", "green2", "green3", "green4"].map(id => document.getElementById(id)),
//   yellow: ["yellow1", "yellow2", "yellow3", "yellow4"].map(id => document.getElementById(id)),
//   blue: ["blue1", "blue2", "blue3", "blue4"].map(id => document.getElementById(id))
// };

// Object.values(pawns).forEach(list => list.forEach(p => p.dataset.index = "-1"));

// // ==========================
// //   UTILITY FUNCTIONS
// // ==========================
// function rollDiceVisual(dice, number) {
//   dice.style.animation = "rolling 1s";
//   setTimeout(() => {
//     const angles = {
//       1: "rotateX(0deg) rotateY(0deg)",
//       2: "rotateX(-90deg) rotateY(0deg)",
//       3: "rotateX(0deg) rotateY(90deg)",
//       4: "rotateX(0deg) rotateY(-90deg)",
//       5: "rotateX(90deg) rotateY(0deg)",
//       6: "rotateX(180deg) rotateY(0deg)"
//     };
//     dice.style.transform = angles[number];
//     dice.style.animation = "none";
//   }, 1000);
// }

// async function animatePawnOnBoard(pawn, path, fromIdx, toIdx) {
//   return new Promise(resolve => {
//     const frames = [];
//     const pathLen = path.length;

//     if (toIdx >= fromIdx) {
//       for (let i = fromIdx; i <= toIdx; i++) frames.push(path[i]);
//     } else {
//       for (let i = fromIdx; i < pathLen; i++) frames.push(path[i]);
//       for (let i = 0; i <= toIdx; i++) frames.push(path[i]);
//     }

//     let frameIdx = 0;
//     function moveNextTile() {
//       if (frameIdx >= frames.length) {
//         resolve();
//         return;
//       }
//       const pos = frames[frameIdx++];
//       pawn.style.top = pos.top + "px";
//       pawn.style.left = pos.left + "px";
//       setTimeout(moveNextTile, 100);
//     }
//     moveNextTile();
//   });
// }

// async function animatePawnIntoHome(pawn, homePath, steps) {
//   return new Promise(resolve => {
//     let idx = 0;
//     function moveNextStep() {
//       if (idx > steps) {
//         resolve();
//         return;
//       }
//       const pos = homePath[idx];
//       pawn.style.top = pos.top + "px";
//       pawn.style.left = pos.left + "px";
//       idx++;
//       setTimeout(moveNextStep, 100);
//     }
//     moveNextStep();
//   });
// }

// // ==========================
// //   UI UPDATES
// // ==========================
// function updateGameUI() {
//   if (!gameData) {
//     console.log("❌ No gameData");
//     return;
//   }

//   console.log("Updating UI... gameData:", gameData);

//   // Update player names
//   gameData.players.forEach(p => {
//     const elem = document.getElementById(`${p.color}-name`);
//     if (elem) {
//       elem.textContent = p.playerName;
//       console.log(`Updated ${p.color}-name to ${p.playerName}`);
//     }
//   });

//   // Update dice - enable only current player's dice
//   const currentPlayer = gameData.players[gameData.currentTurn];
//   const currentColor = currentPlayer.color;
//   isMyTurn = currentPlayer.playerName === playerName;

//   console.log(`Current player: ${currentPlayer.playerName} (${currentColor})`);
//   console.log(`My name: ${playerName}`);
//   console.log(`Is my turn: ${isMyTurn}`);

//   diceList.forEach(dice => {
//     const slot = dice.parentElement;
//     let diceColor = null;

//     if (slot.classList.contains('red-dice-slot')) diceColor = 'red';
//     else if (slot.classList.contains('green-dice-slot')) diceColor = 'green';
//     else if (slot.classList.contains('yellow-dice-slot')) diceColor = 'yellow';
//     else if (slot.classList.contains('blue-dice-slot')) diceColor = 'blue';

//     console.log(`Checking dice: diceColor=${diceColor}, currentColor=${currentColor}, isMyTurn=${isMyTurn}`);

//     if (diceColor === currentColor && isMyTurn) {
//       dice.style.pointerEvents = "auto";
//       dice.style.opacity = "1";
//       dice.classList.add("glow");
//       console.log(`✅ ENABLED ${diceColor} dice`);
//     } else {
//       dice.style.pointerEvents = "none";
//       dice.style.opacity = "0.5";
//       dice.classList.remove("glow");
//       console.log(`❌ DISABLED ${diceColor} dice`);
//     }
//   });

//   console.log(`Turn: ${currentPlayer.playerName} (${currentColor}) - Is My Turn: ${isMyTurn}`);
// }

// function highlightSelectablePawns(diceNum) {
//   if (!isMyTurn || !gameData) return;

//   removeAllHighlights();
//   const currentPlayer = gameData.players[gameData.currentTurn];
//   const currentColor = currentPlayer.color;

//   currentPlayer.pawns.forEach((pawnData, idx) => {
//     const pawn = document.getElementById(`${currentColor}${idx + 1}`);
//     let canMove = false;

//     if (pawnData.position === -1 && diceNum === 6) {
//       canMove = true;
//     } else if (pawnData.position >= 0 && pawnData.position < 58) {
//       canMove = true;
//     }

//     if (canMove) {
//       pawn.classList.add("selectable");
//       pawn.style.cursor = "pointer";
//       pawn.onclick = () => movePawnRequest(idx);
//     }
//   });
// }

// function removeAllHighlights() {
//   Object.values(pawns).forEach(colorPawns => {
//     colorPawns.forEach(pawn => {
//       pawn.classList.remove("selectable");
//       pawn.style.cursor = "default";
//       pawn.onclick = null;
//     });
//   });
// }

// // ==========================
// //   PAWN MOVEMENT
// // ==========================
// function movePawnRequest(pawnId) {
//   if (moveInProgress || !isMyTurn) return;
//   moveInProgress = true;
//   removeAllHighlights();

//   socket.emit('move-pawn', {
//     gameId: gameId,
//     playerName: playerName,
//     pawnId: pawnId
//   });
// }

// // ==========================
// //   DICE CLICK
// // ==========================
// function handleDiceClick(event) {
//   console.log("🎲 Dice clicked!");
//   console.log("moveInProgress:", moveInProgress);
//   console.log("isMyTurn:", isMyTurn);
//   console.log("gameId:", gameId);
//   console.log("playerName:", playerName);

//   if (moveInProgress) {
//     console.log("❌ Move in progress, can't roll");
//     return;
//   }
  
//   if (!isMyTurn) {
//     console.log("❌ Not my turn");
//     return;
//   }

//   if (!gameId || !playerName) {
//     console.log("❌ Missing gameId or playerName");
//     return;
//   }

//   const dice = event.target.closest(".dice");
//   if (!dice) {
//     console.log("❌ No dice element found");
//     return;
//   }

//   console.log("✅ Emitting roll-dice:", { gameId, playerName });
//   socket.emit('roll-dice', {
//     gameId: gameId,
//     playerName: playerName
//   });
// }

// // ==========================
// //   SOCKET EVENTS
// // ==========================

// // Game state loaded
// socket.on('game-state', (data) => {
//   gameData = data;
//   gameId = data.gameId;
  
//   // Get my color
//   const me = gameData.players.find(p => p.playerName === playerName);
//   if (me) myColor = me.color;

//   console.log('Game state received:', data);
//   updateGameUI();
// });

// // Game started
// socket.on('game-started', (data) => {
//   gameData = data;
//   console.log('Game started:', data);
//   updateGameUI();
// });

// // Dice rolled - show animation and highlight pawns
// socket.on('dice-rolled', (data) => {
//   console.log('Dice rolled:', data);

//   if (data.penalty) {
//     alert(`⚠️ ${data.playerName} rolled three 6's! Penalty - Turn lost!`);
//     return;
//   }

//   if (data.noMoves) {
//     alert(`⚠️ ${data.playerName} rolled ${data.diceValue} but has no valid moves. Turn skipped.`);
//     return;
//   }

//   // Show dice animation
//   const currentPlayer = gameData.players[gameData.currentTurn];
//   const diceColor = currentPlayer.color;
//   const diceElement = Array.from(diceList).find(d => {
//     const slot = d.parentElement;
//     if (diceColor === 'red') return slot.classList.contains('red-dice-slot');
//     if (diceColor === 'green') return slot.classList.contains('green-dice-slot');
//     if (diceColor === 'yellow') return slot.classList.contains('yellow-dice-slot');
//     if (diceColor === 'blue') return slot.classList.contains('blue-dice-slot');
//   });

//   if (diceElement) {
//     rollDiceVisual(diceElement, data.diceValue);
//   }

//   setTimeout(() => {
//     highlightSelectablePawns(data.diceValue);
//   }, 1200);
// });

// // Pawn moved - update positions for all players
// socket.on('pawn-moved', async (data) => {
//   console.log('Pawn moved:', data);

//   const pawnElement = document.getElementById(`${data.color}${data.pawnId + 1}`);
//   if (!pawnElement) return;

//   const path = colorPaths[data.color];
//   const homePath = homePaths[data.color];
//   const startIdx = startPosition[data.color];

//   if (data.isHome) {
//     const homeEntryIdx = startIdx + 51;
//     const homeIdx = data.newPosition - homeEntryIdx;
//     if (homePath[homeIdx]) {
//       pawnElement.style.top = homePath[homeIdx].top + "px";
//       pawnElement.style.left = homePath[homeIdx].left + "px";
//     }
//   } else {
//     if (path[data.newPosition]) {
//       pawnElement.style.top = path[data.newPosition].top + "px";
//       pawnElement.style.left = path[data.newPosition].left + "px";
//     }
//   }

//   moveInProgress = false;
  
//   // Update game state from server
//   socket.emit('get-game-state', { gameId });
// });

// // Turn changed - update UI and enable/disable dice
// socket.on('turn-changed', (data) => {
//   console.log('Turn changed:', data);
//   gameData.currentTurn = data.currentTurn;
//   moveInProgress = false;
//   updateGameUI();
// });

// // Extra turn granted
// socket.on('extra-turn-granted', (data) => {
//   console.log('Extra turn granted:', data);
//   moveInProgress = false;
//   updateGameUI();
// });

// // Pawn captured
// socket.on('pawn-captured', (data) => {
//   console.log('Pawn captured:', data);
//   alert(`${data.message}`);
//   const pawnElement = document.getElementById(`${data.capturedPlayer}${data.capturedPawnId + 1}`);
//   if (pawnElement) {
//     pawnElement.style.top = "83px";
//     pawnElement.style.left = "72.5px";
//   }
// });

// // Player finished
// socket.on('player-finished', (data) => {
//   console.log('Player finished:', data);
//   alert(`🎉 ${data.playerName} finished at Rank ${data.rank}!`);
// });

// // Game over - show leaderboard
// socket.on('game-over', (data) => {
//   console.log('Game over:', data);
//   let message = data.message + "\n\n";
//   data.rankings.forEach((r, i) => {
//     message += `${i + 1}. ${r.playerName} (${r.color})\n`;
//   });
//   alert(message);
//   // Redirect to leaderboard or home
//   window.location.href = '/';
// });

// // Errors
// socket.on('error', (data) => {
//   console.error('Error:', data);
//   alert('Error: ' + data.message);
// });

// // ==========================
// //   INITIALIZATION
// // ==========================
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOMContentLoaded triggered");
  
//   // Get game info from localStorage
//   const gameInfo = localStorage.getItem("currentGame") ? JSON.parse(localStorage.getItem("currentGame")) : null;
//   if (gameInfo) {
//     gameId = gameInfo.gameId;
//     playerName = gameInfo.playerName;
//   }

//   if (!gameId || !playerName) {
//     console.error("❌ Game ID or Player Name not found");
//     return;
//   }

//   console.log(`✅ Board loaded - GameId: ${gameId}, Player: ${playerName}`);

//   // Add dice click listeners FIRST
//   diceList.forEach((dice, idx) => {
//     dice.addEventListener("click", handleDiceClick);
//     console.log(`✅ Dice ${idx} listener added`);
//   });

//   // Request current game state
//   setTimeout(() => {
//     socket.emit('get-game-state', { gameId });
//     console.log("Emitted get-game-state");
//   }, 500);
// });




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

const startPosition = {
  red: 0,
  green: 39,
  yellow: 13,
  blue: 26
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

// Check if a pawn can move with given dice value
function canPawnMove(pawnData, diceValue) {
  // Can release pawn with 6
  if (pawnData.position === -1 && diceValue === 6) return true;
  
  // Can move pawn on board
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
  if (!gameData) {
    console.log("❌ No gameData");
    return;
  }

  console.log("Updating UI... gameData:", gameData);
  console.log(`🔍 DEBUGGING - My player name: "${playerName}"`);

  // Update player names
  gameData.players.forEach(p => {
    const elem = document.getElementById(`${p.color}-name`);
    if (elem) {
      elem.textContent = p.playerName;
    }
    console.log(`🔍 Player in game: "${p.playerName}" (${p.color})`);
  });

  // Update dice - enable only current player's dice
  const currentPlayer = gameData.players[gameData.currentTurn];
  const currentColor = currentPlayer.color;
  isMyTurn = currentPlayer.playerName === playerName;

  console.log(`🔍 Current turn player: "${currentPlayer.playerName}" (${currentColor})`);
  console.log(`🔍 Comparing: "${currentPlayer.playerName}" === "${playerName}" = ${isMyTurn}`);
  console.log(`✅ Is my turn: ${isMyTurn}`);

  // Show turn indicator
  let turnIndicator = document.getElementById('turn-indicator');
  if (!turnIndicator) {
    turnIndicator = document.createElement('div');
    turnIndicator.id = 'turn-indicator';
    turnIndicator.style.position = 'fixed';
    turnIndicator.style.top = '50px';
    turnIndicator.style.right = '10px';
    turnIndicator.style.padding = '10px 20px';
    turnIndicator.style.borderRadius = '5px';
    turnIndicator.style.zIndex = '9999';
    turnIndicator.style.fontWeight = 'bold';
    document.body.appendChild(turnIndicator);
  }
  
  if (isMyTurn) {
    turnIndicator.style.background = '#4CAF50';
    turnIndicator.style.color = 'white';
    turnIndicator.textContent = '🎲 YOUR TURN!';
  } else {
    turnIndicator.style.background = 'rgba(0,0,0,0.8)';
    turnIndicator.style.color = 'white';
    turnIndicator.textContent = `Waiting for ${currentPlayer.playerName}...`;
  }

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
      console.log(`✅ ENABLED ${diceColor} dice (my turn)`);
    } else {
      dice.style.pointerEvents = "none";
      dice.style.opacity = "0.5";
      dice.classList.remove("glow");
      console.log(`❌ DISABLED ${diceColor} dice (not my turn or different color)`);
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

  // If no pawns can move, auto-skip turn after 2 seconds
  if (!hasMovablePawn) {
    console.log("❌ No valid moves available");
    alert(`No valid moves! Turn will be skipped.`);
    setTimeout(() => {
      // Trigger next turn
      socket.emit('next-turn', { gameId });
    }, 2000);
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

  console.log(`📤 Emitting move-pawn: pawnId=${pawnId}`);
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

  if (!gameId || !playerName) {
    console.log("❌ Missing gameId or playerName");
    return;
  }

  const dice = event.target.closest(".dice");
  if (!dice) return;

  // CLIENT-SIDE: Roll dice and show animation immediately
  const diceValue = Math.floor(Math.random() * 6) + 1;
  currentDiceValue = diceValue;
  
  console.log(`✅ Rolled: ${diceValue}`);
  
  // Show animation
  rollDiceVisual(dice, diceValue);

  // Emit to server
  socket.emit('roll-dice', {
    gameId: gameId,
    playerName: playerName
  });

  // After animation, check which pawns can move
  setTimeout(() => {
    // Refresh game state first
    socket.emit('get-game-state', { gameId });
    
    setTimeout(() => {
      if (currentDiceValue) {
        highlightSelectablePawns(currentDiceValue);
      }
    }, 200);
  }, 1200);
}

// ==========================
//   SOCKET EVENTS
// ==========================

// Game state loaded
socket.on('game-state', (data) => {
  gameData = data;
  gameId = data.gameId;
  
  const me = gameData.players.find(p => p.playerName === playerName);
  if (me) myColor = me.color;

  console.log('📥 Game state received');
  updateGameUI();
});

// Game started
socket.on('game-started', (data) => {
  gameData = data;
  console.log('🎮 Game started!');
  updateGameUI();
});

// Dice rolled by ANY player
socket.on('dice-rolled', (data) => {
  console.log('🎲 Dice rolled:', data);

  // Find the dice element for the player who rolled
  const rollingPlayer = gameData.players.find(p => p.playerName === data.playerName);
  if (!rollingPlayer) return;

  const diceColor = rollingPlayer.color;
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

  // Store dice value
  currentDiceValue = data.diceValue;
});

// Pawn moved by ANY player
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
  
  // Refresh game state
  socket.emit('get-game-state', { gameId });
});

// Turn changed
socket.on('turn-changed', (data) => {
  console.log('🔄 Turn changed:', data);
  gameData.currentTurn = data.currentTurn;
  moveInProgress = false;
  currentDiceValue = null;
  removeAllHighlights();
  updateGameUI();
});

// Extra turn granted
socket.on('extra-turn-granted', (data) => {
  console.log('🎉 Extra turn!');
  alert(`🎉 ${data.currentPlayer} gets another turn!`);
  moveInProgress = false;
  currentDiceValue = null;
  updateGameUI();
});

// Pawn captured
socket.on('pawn-captured', (data) => {
  console.log('💥 Pawn captured:', data);
  alert(`${data.message}`);
  
  const pawnElement = document.getElementById(`${data.capturedPlayer}${data.capturedPawnId + 1}`);
  if (pawnElement) {
    // Return to home position
    pawnElement.style.top = "83px";
    pawnElement.style.left = "72.5px";
  }
});

// Player finished
socket.on('player-finished', (data) => {
  console.log('🏁 Player finished:', data);
  alert(`🎉 ${data.playerName} finished at Rank ${data.rank}!`);
});

// Game over
socket.on('game-over', (data) => {
  console.log('🏆 Game over:', data);
  let message = data.message + "\n\n";
  data.rankings.forEach((r, i) => {
    message += `${i + 1}. ${r.playerName} (${r.color})\n`;
  });
  alert(message);
  window.location.href = '/';
});

// Errors
socket.on('error', (data) => {
  console.error('❌ Error:', data);
  alert('Error: ' + data.message);
  moveInProgress = false;
  currentDiceValue = null;
});

// ==========================
//   INITIALIZATION
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");
  
  // CRITICAL FIX: Check sessionStorage first (unique per tab)
  let gameInfo = null;
  let storedPlayerName = sessionStorage.getItem("myPlayerName");
  
  // If this tab already has a player name stored, use it
  if (storedPlayerName) {
    console.log("📌 Found existing player name in this tab:", storedPlayerName);
    playerName = storedPlayerName;
    
    // Get game ID from localStorage
    const localGame = localStorage.getItem("currentGame") ? JSON.parse(localStorage.getItem("currentGame")) : null;
    if (localGame) {
      gameId = localGame.gameId;
    }
  } else {
    // First time opening this tab - get from localStorage
    gameInfo = localStorage.getItem("currentGame") ? JSON.parse(localStorage.getItem("currentGame")) : null;
    
    if (gameInfo) {
      gameId = gameInfo.gameId;
      playerName = gameInfo.playerName;
      
      // SAVE THIS PLAYER'S NAME TO SESSION STORAGE (unique per tab)
      sessionStorage.setItem("myPlayerName", playerName);
      console.log("💾 Saved player name to this tab:", playerName);
    }
  }

  if (!gameId || !playerName) {
    console.error("❌ Missing game info");
    alert("⚠️ No game info found! Please join/create a game first.");
    return;
  }

  console.log(`✅ Game: ${gameId}, Player: ${playerName}`);
  console.log(`🔍 This tab belongs to: "${playerName}"`);

  // Show player indicator on screen
  const indicator = document.createElement('div');
  indicator.style.position = 'fixed';
  indicator.style.top = '10px';
  indicator.style.right = '10px';
  indicator.style.background = 'rgba(0,0,0,0.8)';
  indicator.style.color = 'white';
  indicator.style.padding = '10px 20px';
  indicator.style.borderRadius = '5px';
  indicator.style.zIndex = '9999';
  indicator.style.fontWeight = 'bold';
  indicator.style.fontSize = '18px';
  indicator.textContent = `YOU ARE: ${playerName}`;
  document.body.appendChild(indicator);

  // Add dice listeners
  diceList.forEach((dice, idx) => {
    dice.addEventListener("click", handleDiceClick);
    console.log(`✅ Dice ${idx} listener added`);
  });

  // Get game state
  setTimeout(() => {
    socket.emit('get-game-state', { gameId });
  }, 500);
});