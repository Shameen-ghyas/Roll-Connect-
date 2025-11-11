const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');   
const cors = require('cors');
require('dotenv').config();
const leaderboardRoutes = require('./routes/leaderboardRoutes.js');
const gameRoutes = require('./routes/gameRoutes.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}});


// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection   
connectDB();

// Routes
app.use('/api/leaderboard', leaderboardRoutes); 
app.use('/api/game', gameRoutes);


app.get('/', (req, res) => {
    res.send('Roll Connect Backend is running');
});

const gameSocketHandler = require('./sockets/gameSocketHandler');
gameSocketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));