const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');   
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('./config/passport');


const leaderboardRoutes = require('./routes/leaderboardRoutes.js');
const gameRoutes = require('./routes/gameRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const diceRoutes = require('./routes/diceRoutes.js');
const turnRoutes = require('./routes/turnRoutes.js');
const pawnRoutes = require('./routes/pawnRoutes.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}});

app.use(cors({
    origin: true,  
    credentials: true,
}));

// Middleware
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'rollconnect2025secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection   
connectDB();

// Routes
app.use('/api/leaderboard', leaderboardRoutes); 
app.use('/api/game', gameRoutes);
app.use('/auth', authRoutes);
app.use('/api/dice', diceRoutes);
app.use('/api/turn', turnRoutes);
app.use('/api/pawn', pawnRoutes);


app.get('/', (req, res) => {
    res.send('Roll Connect Backend is running');
});

const gameSocketHandler = require('./sockets/gameSocketHandler');
gameSocketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));