// // // --------------------------
// // // CONFIG
// // // --------------------------
// // const BACKEND_URL = "http://localhost:5000";  // her backend running on port 5000

// // // --------------------------
// // // ELEMENTS
// // // --------------------------
// // const playBtn = document.getElementById("play_button");
// // const guestBtn = document.getElementById("guestBtn");
// // const googleBtn = document.getElementById("googleBtn");

// // const loginPopup = document.getElementById("loginPopup");

// // // --------------------------
// // // OPEN LOGIN POPUP
// // // --------------------------
// // playBtn.addEventListener("click", () => {
// //     loginPopup.style.display = "block";
// // });

// // // --------------------------
// // // GUEST LOGIN
// // // --------------------------
// // guestBtn.addEventListener("click", async () => {
// //     const username = prompt("Enter username");

// //     if (!username) {
// //         alert("Username required.");
// //         return;
// //     }

// //     try {
// //         const res = await fetch(`${BACKEND_URL}/auth/guest`, {
// //             method: "POST",
// //             headers: {"Content-Type": "application/json"},
// //             body: JSON.stringify({ username })
// //         });

// //         const result = await res.json();

// //         if (!res.ok) {
// //             alert(result.error || "Guest login failed");
// //             return;
// //         }

// //         // Save user in browser
// //         localStorage.setItem("user", JSON.stringify(result.data));

// //         // Redirect to Create / Join menu
// //         window.location.href = "create_join.html";

// //     } catch (err) {
// //         console.error(err);
// //         alert("Guest login error");
// //     }
// // });

// // // --------------------------
// // // GOOGLE LOGIN
// // // --------------------------
// // googleBtn.addEventListener("click", () => {
// //     // Redirect to backend's Google Auth
// //     window.location.href = `${BACKEND_URL}/auth/google`;
// // });

// // // --------------------------
// // // WHEN GOOGLE REDIRECTS BACK
// // // --------------------------
// // window.onload = function () {
// //     const params = new URLSearchParams(window.location.search);
// //     const userParam = params.get("user");

// //     if (userParam) {
// //         const user = JSON.parse(decodeURIComponent(userParam));
// //         localStorage.setItem("user", JSON.stringify(user));

// //         window.location.href = "create_join.html";
// //     }
// // };


// // // =========================
// // // PLAY AS GUEST
// // // =========================
// // guestBtn.addEventListener("click", () => {
// //     loginPopup.style.display = "none";          // hide login popup
// //     gameOptionsPopup.style.display = "block";   // show game options

// //     greetingText.innerText = "Play as Guest";   // title
// // });


// // // =========================
// // // LOGIN WITH GOOGLE
// // // =========================
// // googleBtn.addEventListener("click", () => {
// //     window.location.href = "/auth/google";   // backend Google route
// // });


// // // If redirected back from Google Login with user info
// // // (your backend sends req.user.name)
// // if (window.location.search.includes("user=")) {
// //     const username = new URLSearchParams(window.location.search).get("user");

// //     loginPopup.style.display = "none";
// //     gameOptionsPopup.style.display = "block";

// //     greetingText.innerText = "Hi, " + username;
// // }


// // // =========================
// // // BUTTON EVENTS
// // // =========================
// // createBtn.addEventListener("click", () => {
// //     window.location.href = "html_files/create_game.html";
// // });

// // joinBtn.addEventListener("click", () => {
// //     window.location.href = "html_files/join_game.html";
// // });
// // --------------------------
// // CONFIG
// // --------------------------
// // const BACKEND_URL = "http://localhost:5000";

// // // --------------------------
// // // ELEMENTS
// // --------------------------
// // const guestPopup = document.getElementById("guestPopup");
// // const playBtn = document.getElementById("play_button");
// // // const guestBtn = document.getElementById("guestBtn");
// // const googleBtn = document.getElementById("googleBtn");
// // const loginPopup = document.getElementById("loginPopup");

// // // Create/Join Popup Elements (we will create them dynamically)
// // let gameOptionsPopup;
// // let createPopup;
// // let joinPopup;

// // // --------------------------
// // // OPEN LOGIN POPUP
// // // --------------------------
// // playBtn.addEventListener("click", () => {
// //     loginPopup.style.display = "block";
// // });

// // // --------------------------
// // // GUEST LOGIN
// // // --------------------------
// // // CONFIG
// // // const BACKEND_URL = "http://localhost:5000";

// // // open guest popup (keep this if already present)
// // const guestBtn = document.getElementById("guestBtn");
// // const guestPopup = document.getElementById("guestPopup");
// // const guestSubmitBtn = document.getElementById("guestSubmitBtn");

// // guestBtn.addEventListener("click", () => {
// //   // show your neon guest box
// //   guestPopup.style.display = "block"; // or 'block' depending on CSS
// //   document.getElementById("loginPopup").style.display = "none";  // HIDE login popup
// //   // focus input
// //   const input = document.getElementById("guestNameInput");
// //   if (input) input.focus();
// // });

// // // submit guest form -> POST to backend route exactly '/auth/guest'
// // guestSubmitBtn.addEventListener("click", async () => {
// //   const username = document.getElementById("guestNameInput").value.trim();
// //   if (!username) { alert("Please enter your name"); return; }

// //   try {
// //     const res = await fetch(`${BACKEND_URL}/auth/guest`, {
// //  // <-- NOTE exact path
// //       method: "POST",
// //       headers: {"Content-Type": "application/json"},
// //       body: JSON.stringify({ username }),
// //     //   credentials: 'include' // optional (only if your backend sets cookies/session)
// //     });

// //     // if backend returned HTML (404 page) this will avoid crash
// //     const text = await res.text();
// //     // try to parse JSON, but fall back to text
// //     let data;
// //     try { data = JSON.parse(text); } catch(e) { data = null; }

// //     if (!res.ok) {
// //       // display backend error message if available
// //       const errMsg = data?.error || data?.message || text || "Guest login failed";
// //       alert(errMsg);
// //       return;
// //     }

// //     // backend previously responded with { message, data: { ... } }
// //     const user = data?.data || data?.user || data; // flexible
// //     if (!user) {
// //       alert("Guest login succeeded but server returned unexpected data.");
// //       return;
// //     }
// //     // show message
// //     alert(data.message);

// //     // Save and continue
// //     localStorage.setItem("user", JSON.stringify(user));
// //     // hide popups
// //     guestPopup.style.display = "none";
// //     document.getElementById("loginPopup").style.display = "none";

// //     // open create/join UI (you already have openGameOptions)
// //     openGameOptions( (user.username || username), true);

// //   } catch (err) {
// //     console.error("Guest login error:", err);
// //     alert("Error connecting to server");
// //   }
// // });

// // // --------------------------
// // // GOOGLE LOGIN
// // // --------------------------
// // googleBtn.addEventListener("click", () => {
// //     // redirect to backend Google auth
// //     window.location.href = `${BACKEND_URL}/auth/google`;
// // });

// // // --------------------------
// // // HANDLE GOOGLE REDIRECT
// // // --------------------------
// // window.onload = function () {
// //     const params = new URLSearchParams(window.location.search);
// //     const userParam = params.get("user");

// //     if (userParam) {
// //         const user = JSON.parse(decodeURIComponent(userParam));
// //         localStorage.setItem("user", JSON.stringify(user));
// //         loginPopup.style.display = "none";
// //         openGameOptions( user.username, false); // false = no name input for Google
// //     }
// // };
// // // --------------------------
// // // GAME OPTIONS POPUP
// // // --------------------------
// // function openGameOptions(titleText, isGuest) {
// //     // Use existing popup div
// //     const popup = document.getElementById("gameOptionsPopup");
// //     const greeting = popup.querySelector("#greetingText");

// //     greeting.innerText = `Hi, ${titleText}`; // Show "Hi, username"
// //     greeting.style.fontSize = "24px"; // smaller size
// //     popup.style.display = "block";           // Show the popup

// //     // Remove old event listeners to prevent duplicates
// //     const oldCreate = document.getElementById("createGameBtn");
// //     const oldJoin = document.getElementById("joinGameBtn");
// //     const newCreate = oldCreate.cloneNode(true);
// //     const newJoin = oldJoin.cloneNode(true);
// //     oldCreate.parentNode.replaceChild(newCreate, oldCreate);
// //     oldJoin.parentNode.replaceChild(newJoin, oldJoin);

// //     // Create game button
// //     newCreate.addEventListener("click", () => {
// //         openCreateGamePopup(isGuest);
// //     });

// //     // Join game button
// //     newJoin.addEventListener("click", () => {
// //         openJoinGamePopup(isGuest);
// //     });
// // }
// // const BACKEND_URL = "http://localhost:5000";

// // // --------------------------
// // // LOGIN POPUP OPEN
// // // --------------------------
// // const playBtn = document.getElementById("play_button");
// // const googleBtn = document.getElementById("googleBtn");
// // const loginPopup = document.getElementById("loginPopup");

// // playBtn.addEventListener("click", () => {
// //     loginPopup.style.display = "block";
// // });

// // // --------------------------
// // // GUEST LOGIN
// // // --------------------------
// // const guestBtn = document.getElementById("guestBtn");
// // const guestPopup = document.getElementById("guestPopup");
// // const guestSubmitBtn = document.getElementById("guestSubmitBtn");

// // guestBtn.addEventListener("click", () => {
// //     guestPopup.style.display = "block";
// //     loginPopup.style.display = "none";
// // });

// // guestSubmitBtn.addEventListener("click", async () => {
// //     const username = document.getElementById("guestNameInput").value.trim();

// //     if (!username) return alert("Please enter your name");

// //     try {
// //         const res = await fetch(`${BACKEND_URL}/auth/guest`, {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ username })
// //         });

// //         const text = await res.text();
// //         let data;
// //         try { data = JSON.parse(text); } catch { data = null; }

// //         if (!res.ok) {
// //             return alert(data?.error || "Error logging in");
// //         }

// //         const user = data.data;
// //         alert(data.message);

// //         localStorage.setItem("user", JSON.stringify(user));

// //         guestPopup.style.display = "none";
// //         loginPopup.style.display = "none";

// //         openGameOptions(user.username);

// //     } catch (err) {
// //         alert("Server error");
// //         console.error(err);
// //     }
// // });

// // // --------------------------
// // // GOOGLE LOGIN
// // // --------------------------
// // googleBtn.addEventListener("click", () => {
// //     window.location.href = `${BACKEND_URL}/auth/google`;
// // });

// // // --------------------------
// // // HANDLE GOOGLE REDIRECT
// // // --------------------------
// // window.onload = () => {
// //     const params = new URLSearchParams(window.location.search);
// //     const userParam = params.get("user");

// //     if (userParam) {
// //         const user = JSON.parse(decodeURIComponent(userParam));
// //         localStorage.setItem("user", JSON.stringify(user));

// //         loginPopup.style.display = "none";
// //         openGameOptions(user.username);
// //     }
// // };

// // // --------------------------
// // // OPEN GAME OPTIONS POPUP
// // // --------------------------
// // function openGameOptions(username) {
// //     const popup = document.getElementById("gameOptionsPopup");
// //     const greeting = popup.querySelector("#greetingText");

// //     greeting.innerText = `Hi, ${username}`;
// //     greeting.style.fontSize = "22px";

// //     popup.style.display = "block";

// //     const createBtn = popup.querySelector("#createGameBtn");
// //     const joinBtn = popup.querySelector("#joinGameBtn");

// //     // Remove old listeners
// //     const newCreate = createBtn.cloneNode(true);
// //     const newJoin = joinBtn.cloneNode(true);

// //     createBtn.parentNode.replaceChild(newCreate, createBtn);
// //     joinBtn.parentNode.replaceChild(newJoin, joinBtn);

// //     // NEW WORKING BUTTONS
// //     newCreate.onclick = () => {
// //         openModePopup(username);
// //     };

// //     newJoin.onclick = () => {
// //         const gameId = prompt("Enter Game ID to join:");
// //         if (gameId) joinGame(username, gameId);
// //     };
// // }

// // // --------------------------
// // // MODE POPUP
// // // --------------------------
// // function openModePopup(playerName) {
// //     const popup = document.createElement("div");
// //     popup.classList.add("popup-overlay");

// //     popup.innerHTML = `
// //         <div class="popup-box">
// //             <h2 class="popup-title">Select Game Mode</h2>

// //             <button id="modeOnline" class="neon-button">Online</button>
// //             <button id="modeOffline" class="neon-button">Offline</button>
// //         </div>
// //     `;

// //     document.body.appendChild(popup);

// //     document.getElementById("modeOnline").onclick = () => {
// //         popup.remove();
// //         createOnlineGame(playerName);
// //     };

// //     document.getElementById("modeOffline").onclick = () => {
// //         popup.remove();
// //         openOfflinePlayersPopup(playerName);
// //     };
// // }




// // ----------------------------
// // CONFIG
// // // ----------------------------
// // const BACKEND_URL = "http://localhost:5000";

// // // ----------------------------
// // // LOGIN POPUP ELEMENTS
// // // ----------------------------
// // const playBtn = document.getElementById("play_button");
// // const loginPopup = document.getElementById("loginPopup");
// // const googleBtn = document.getElementById("googleBtn");

// // // Guest elements
// // const guestBtn = document.getElementById("guestBtn");
// // const guestPopup = document.getElementById("guestPopup");
// // const guestSubmitBtn = document.getElementById("guestSubmitBtn");

// // // Game options popup
// // const gameOptionsPopup = document.getElementById("gameOptionsPopup");
// // const greetingText = document.getElementById("greetingText");

// // // ----------------------------
// // // OPEN LOGIN POPUP
// // // ----------------------------
// // playBtn.onclick = () => {
// //     loginPopup.style.display = "block";
// // };

// // // ----------------------------
// // // GOOGLE LOGIN
// // // ----------------------------
// // googleBtn.onclick = () => {
// //     window.location.href = `${BACKEND_URL}/auth/google`;
// // };

// // // ----------------------------
// // // HANDLE GOOGLE REDIRECT
// // // ----------------------------
// // window.onload = () => {
// //     const params = new URLSearchParams(window.location.search);
// //     const userParam = params.get("user");

// //     if (userParam) {
// //         const user = JSON.parse(decodeURIComponent(userParam));
// //         localStorage.setItem("user", JSON.stringify(user));
// //         loginPopup.style.display = "none";
// //         openGameOptions(user.username);
// //     }
// // };

// // // ----------------------------
// // // GUEST LOGIN
// // // ----------------------------
// // guestBtn.onclick = () => {
// //     loginPopup.style.display = "none";
// //     guestPopup.style.display = "block";
// // };

// // guestSubmitBtn.onclick = async () => {
// //     const username = document.getElementById("guestNameInput").value.trim();
// //     if (!username) return alert("Please enter name");

// //     try {
// //         const res = await fetch(`${BACKEND_URL}/auth/guest`, {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ username })
// //         });

// //         const data = await res.json();
// //         if (!res.ok) return alert(data.error || "Login failed");

// //         localStorage.setItem("user", JSON.stringify(data.data));
// //         guestPopup.style.display = "none";

// //         openGameOptions(data.data.username);

// //     } catch (err) {
// //         alert("Server error");
// //     }
// // };

// // // ----------------------------
// // // OPEN GAME OPTIONS POPUP
// // // ----------------------------
// // function openGameOptions(username) {
// //     greetingText.innerText = `Hi, ${username}`;
// //     greetingText.style.fontSize = "22px";

// //     gameOptionsPopup.style.display = "block";

// //     document.getElementById("createGameBtn").onclick = openCreateModePopup;
// //     document.getElementById("joinGameBtn").onclick = openJoinPopup;
// // }

// // // ----------------------------
// // // CREATE GAME MODE POPUP
// // // ----------------------------
// // function openCreateModePopup() {
// //     const popup = document.getElementById("modePopup");
// //     popup.style.display = "flex";

// //     document.getElementById("modeOnline").onclick = () => createGame("online");
// //     document.getElementById("modeOffline").onclick = () => createGame("offline");
// // }

// // async function createGame(mode) {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     if (!user) return alert("User not logged in");

// //     let bodyData = { mode };

// //     if (mode === "online") {
// //         bodyData.playerName = user.username;
// //     } else {
// //         // offline mode requires 2–4 players
// //         bodyData.offlinePlayers = [user.username, "Bot1"];
// //     }

// //     try {
// //         const res = await fetch(`${BACKEND_URL}/game/create`, {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify(bodyData)
// //         });

// //         const data = await res.json();

// //         if (!res.ok || data.error) return alert(data.error || "Game creation failed");

// //         // Save game data for loading page
// //         localStorage.setItem("currentGame", JSON.stringify(data.data));
// //         alert("Login successful")
// //         // Redirect after saving
// //         window.location.href = "html_files/loading.html";

// //     } catch (err) {
// //         console.error(err);
// //         alert("Server error");
// //     }
// // }


// // // ----------------------------
// // // JOIN GAME POPUP
// // // ----------------------------
// // function openJoinPopup() {
// //     const popup = document.getElementById("joinPopup");
// //     popup.style.display = "flex";

// //     document.getElementById("joinSubmitBtn").onclick = joinGame;
// // }

// // async function joinGame() {
// //     const gameId = document.getElementById("joinGameId").value.trim();
// //     const mode = document.querySelector('input[name="joinMode"]:checked')?.value;

// //     if (!gameId) return alert("Enter Game ID");
// //     if (!mode) return alert("Select mode");

// //     const user = JSON.parse(localStorage.getItem("user"));

// //     try {
// //         const res = await fetch(`${BACKEND_URL}/game/join`, {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //                 gameId,
// //                 playerName: user.username,
// //                 mode
// //             })
// //         });

// //         const data = await res.json();
// //         if (data.error) return alert(data.error);

// //         alert("Joined Game Successfully!");
// //         window.location.href = "loading.html";

// //     } catch (err) {
// //         alert("Server error");
// //     }
// // }



// // ----------------------------
// // CONFIG
// // ----------------------------
// const BACKEND_URL = "http://localhost:5000";

// // ----------------------------
// // LOGIN POPUP ELEMENTS
// // ----------------------------
// const playBtn = document.getElementById("play_button");
// const loginPopup = document.getElementById("loginPopup");
// const googleBtn = document.getElementById("googleBtn");

// // Guest elements
// const guestBtn = document.getElementById("guestBtn");
// const guestPopup = document.getElementById("guestPopup");
// const guestSubmitBtn = document.getElementById("guestSubmitBtn");

// // Game options popup
// const gameOptionsPopup = document.getElementById("gameOptionsPopup");
// const greetingText = document.getElementById("greetingText");

// // ----------------------------
// // OPEN LOGIN POPUP
// // ----------------------------
// playBtn.onclick = () => {
//     loginPopup.style.display = "block";
// };

// // ----------------------------
// // GOOGLE LOGIN
// // ----------------------------
// googleBtn.onclick = () => {
//     window.location.href = `${BACKEND_URL}/auth/google`;
// };

// // ----------------------------------------
// // HANDLE GOOGLE REDIRECT
// // ----------------------------------------
// window.onload = () => {
//     const params = new URLSearchParams(window.location.search);
//     const userParam = params.get("user");

//     if (userParam) {
//         const user = JSON.parse(decodeURIComponent(userParam));
//         localStorage.setItem("user", JSON.stringify(user));

//         loginPopup.style.display = "none";
//         openGameOptions(user.username);
//     }
// };

// // ----------------------------
// // GUEST LOGIN
// // ----------------------------
// guestBtn.onclick = () => {
//     loginPopup.style.display = "none";
//     guestPopup.style.display = "block";
// };

// guestSubmitBtn.onclick = async () => {
//     const username = document.getElementById("guestNameInput").value.trim();
//     if (!username) return alert("Please enter name");

//     try {
//         const res = await fetch(`${BACKEND_URL}/auth/guest`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username })
//         });

//         const data = await res.json();
//         if (!res.ok) return alert(data.error || "Login failed");

//         localStorage.setItem("user", JSON.stringify(data.data));
//         guestPopup.style.display = "none";

//         openGameOptions(data.data.username);
//     } catch (err) {
//         alert("Server error");
//     }
// };

// // ----------------------------
// // OPEN GAME OPTIONS POPUP
// // ----------------------------
// function openGameOptions(username) {
//     greetingText.innerText = `Hi, ${username}`;
//     greetingText.style.fontSize = "22px";

//     gameOptionsPopup.style.display = "block";

//     document.getElementById("createGameBtn").onclick = openCreateModePopup;
//     document.getElementById("joinGameBtn").onclick = openJoinPopup;
// }

// // ----------------------------
// // CREATE GAME MODE POPUP
// // ----------------------------
// function openCreateModePopup() {
//     const popup = document.getElementById("modePopup");
//     popup.style.display = "flex";

//     document.getElementById("modeOnline").onclick = () => createGame("online");
//     document.getElementById("modeOffline").onclick = () => createGame("offline");
// }

// async function createGame(mode) {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user) return alert("User not logged in");

//     let bodyData = { mode };

//     if (mode === "online") {
//         bodyData.playerName = user.username;
//     } else {
//         bodyData.offlinePlayers = [user.username, "Bot1"];
//     }

//     try {
//         const res = await fetch(`${BACKEND_URL}/game/create`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(bodyData)
//         });

//         const data = await res.json();

//         if (!res.ok || data.error) {
//             console.log("Game creation error:", data);
//             return alert(data.error || "Game creation failed");
//         }

//         localStorage.setItem("currentGame", JSON.stringify(data.data));

//         // Redirect to loading page
//         window.location.href = "html_files/loading.html";

//     } catch (err) {
//         console.error(err);
//         alert("Server error");
//     }
// }


// // ----------------------------
// // JOIN GAME POPUP
// // ----------------------------
// function openJoinPopup() {
//     const popup = document.getElementById("joinPopup");
//     popup.style.display = "flex";

//     document.getElementById("joinSubmitBtn").onclick = joinGame;
// }

// async function joinGame() {
//     const gameId = document.getElementById("joinGameId").value.trim();
//     const mode = document.querySelector('input[name="joinMode"]:checked')?.value;

//     if (!gameId) return alert("Enter Game ID");
//     if (!mode) return alert("Select mode");

//     const user = JSON.parse(localStorage.getItem("user"));

//     try {
//         const res = await fetch(`${BACKEND_URL}/game/join`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 gameId,
//                 playerName: user.username,
//                 mode
//             })
//         });

//         const data = await res.json();
//         if (data.error) return alert(data.error);

//         localStorage.setItem("currentGame", JSON.stringify(data.data));

//         window.location.href = "html_files/loading.html";

//     } catch (err) {
//         console.error(err);
//         alert("Server error");
//     }
// }













// ----------------------------
// CONFIG
// ----------------------------
const BACKEND_URL = "http://localhost:5000";

// ----------------------------
// LOGIN POPUP ELEMENTS
// ----------------------------
const playBtn = document.getElementById("play_button");
const loginPopup = document.getElementById("loginPopup");
const googleBtn = document.getElementById("googleBtn");

// Guest elements
const guestBtn = document.getElementById("guestBtn");
const guestPopup = document.getElementById("guestPopup");
const guestSubmitBtn = document.getElementById("guestSubmitBtn");

// Game options popup
const gameOptionsPopup = document.getElementById("gameOptionsPopup");
const greetingText = document.getElementById("greetingText");

// ----------------------------
// OPEN LOGIN POPUP
// ----------------------------
playBtn.onclick = () => {
    loginPopup.style.display = "block";
};

// ----------------------------
// GOOGLE LOGIN
// ----------------------------
googleBtn.onclick = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
};

// ----------------------------------------
// HANDLE GOOGLE REDIRECT
// ----------------------------------------
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("user", JSON.stringify(user));

        loginPopup.style.display = "none";
        openGameOptions(user.username);
    }
};

// ----------------------------
// GUEST LOGIN
// ----------------------------
guestBtn.onclick = () => {
    loginPopup.style.display = "none";
    guestPopup.style.display = "block";
};

guestSubmitBtn.onclick = async () => {
    const username = document.getElementById("guestNameInput").value.trim();
    if (!username) return alert("Please enter name");

    try {
        const res = await fetch(`${BACKEND_URL}/auth/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });

        const data = await res.json();
        if (!res.ok) return alert(data.error || "Login failed");

        localStorage.setItem("user", JSON.stringify(data.data));
        guestPopup.style.display = "none";

        openGameOptions(data.data.username);
    } catch (err) {
        alert("Server error");
    }
};

// ----------------------------
// OPEN GAME OPTIONS POPUP
// ----------------------------
function openGameOptions(username) {
    greetingText.innerText = `Hi, ${username}`;
    greetingText.style.fontSize = "22px";

    gameOptionsPopup.style.display = "block";

    document.getElementById("createGameBtn").onclick = openCreateModePopup;
    document.getElementById("joinGameBtn").onclick = openJoinPopup;
}

// ----------------------------
// CREATE GAME MODE POPUP
// ----------------------------
function openCreateModePopup() {
    const popup = document.getElementById("modePopup");
    popup.style.display = "flex";

    document.getElementById("modeOnline").onclick = () => createGame("online");
    document.getElementById("modeOffline").onclick = () => createGame("offline");
}

async function createGame(mode) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User not logged in");

    let bodyData = { mode };

    if (mode === "online") {
        bodyData.playerName = user.username;
    } else {
        bodyData.offlinePlayers = [user.username, "Bot1"];
    }

    try {
        const res = await fetch(`${BACKEND_URL}/game/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        });

        const data = await res.json();

        if (!res.ok || data.error) {
            console.log("Game creation error:", data);
            return alert(data.error || "Game creation failed");
        }

        // Store game data
        localStorage.setItem("currentGame", JSON.stringify(data.data));

        // Redirect to loading page
        window.location.href = "html_files/loading.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}


// ----------------------------
// JOIN GAME POPUP
// ----------------------------
function openJoinPopup() {
    const popup = document.getElementById("joinPopup");
    popup.style.display = "flex";

    document.getElementById("joinSubmitBtn").onclick = joinGame;
}

async function joinGame() {
    const gameId = document.getElementById("joinGameId").value.trim();
    const mode = document.querySelector('input[name="joinMode"]:checked')?.value;

    if (!gameId) return alert("Enter Game ID");
    if (!mode) return alert("Select mode");

    const user = JSON.parse(localStorage.getItem("user"));

    try {
        const res = await fetch(`${BACKEND_URL}/game/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gameId,
                playerName: user.username,
                mode
            })
        });

        const data = await res.json();
        if (data.error) return alert(data.error);

        localStorage.setItem("currentGame", JSON.stringify(data.data));

        window.location.href = "html_files/loading.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}