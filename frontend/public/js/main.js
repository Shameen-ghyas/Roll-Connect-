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

// ✅ UPDATED CREATE GAME FUNCTION
async function createGame(mode) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User not logged in");

    let bodyData = { mode };

    if (mode === "online") {
        bodyData.playerName = user.username;
    } else {
        // ✅ OFFLINE MODE - Ask for player names
        const numPlayers = prompt("How many players? (2-4)", "2");
        const num = parseInt(numPlayers);
        
        if (num < 2 || num > 4 || isNaN(num)) {
            return alert("Please enter 2-4 players");
        }
        
        const players = [user.username];
        
        // Get names for other players
        for (let i = 1; i < num; i++) {
            const name = prompt(`Enter name for Player ${i + 1}:`, `Player ${i + 1}`);
            players.push(name || `Player ${i + 1}`);
        }
        
        console.log("Offline players:", players);
        bodyData.offlinePlayers = players;
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

        // Store game data with THIS user's name
        localStorage.setItem("currentGame", JSON.stringify({
            gameId: data.data.gameId,
            playerName: user.username,  // ← Important: Current user's name
            mode: mode,
            players: data.data.players
        }));
        
        // Store player name in sessionStorage (unique per tab)
        sessionStorage.setItem("myPlayerName", user.username);

        console.log("✅ Game created:", data.data);

        // Redirect based on mode
        if (mode === "online") {
            window.location.href = "html_files/loading.html";
        } else {
            // Offline mode - go directly to board
            window.location.href = "html_files/ludo_Classic.html";
        }

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

        // Store game data with THIS user's name
        localStorage.setItem("currentGame", JSON.stringify({
            gameId: data.data.gameId,
            playerName: user.username,  // ← Important: Current user's name
            mode: mode,
            players: data.data.players
        }));
        
        // Store player name in sessionStorage (unique per tab)
        sessionStorage.setItem("myPlayerName", user.username);

        console.log("✅ Joined game:", data.data);

        window.location.href = "html_files/loading.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}