
// index.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const session = require("express-session");
const passport = require("./config/passport.js");
const mongoose = require("mongoose");
const path = require("path");

// Sockets handler (your existing file)
const gameSocketHandler = require("./sockets/gameSocketHandler");

// Route imports
const authRoutes = require("./routes/authRoutes.js"); // Import auth routes
const gameRoutes = require("./routes/gameRoutes.js"); // Import game-related routes
const turnRoutes = require("./routes/turnRoutes.js"); // Import turn-related routes
const pawnRoutes = require("./routes/pawnRoutes.js"); // Import pawn-related routes
const leaderboardRoutes = require("./routes/leaderboardRoutes.js"); // Import leaderboard-related routes

const app = express();
const server = http.createServer(app);

// ---------------- enable socket.io ----------------
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  // path: "/socket.io"  // default
});
app.set('socketio',io);
// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------------- ROUTES ----------------
app.use("/auth", authRoutes); // Register auth routes
app.use("/game", gameRoutes); // Register game routes
app.use("/turn", turnRoutes); // Register turn routes
app.use("/pawn", pawnRoutes); // Register pawn routes
app.use("/leaderboard", leaderboardRoutes); // Register leaderboard routes

// ------------ STATIC FRONTEND SERVING ------------
const frontendPath = path.join(__dirname, "../frontend/public");
console.log("STATIC PATH =>", frontendPath);
app.use(express.static(frontendPath));

// Serve main page(s)
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "html_files", "ludo_main.html"));
});
app.get("/game", (req, res) => {
  res.sendFile(path.join(frontendPath, "html_files", "ludo_main.html"));
});
app.get("/login_failed.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "html_files", "login_failed.html"));
});

// ------------- MONGODB CONNECTION -------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------------- start socket handler ----------------
gameSocketHandler(io);

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
