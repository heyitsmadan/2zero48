const seedrandom = require("seedrandom");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

server.listen(3001, () => {
    console.log("Server started");
});

const rooms = {};
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("createRoom", () => {
        let roomId = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            roomId += characters[randomIndex];
        }

        socket.join(roomId);
        const seedA = seedrandom().int32().toString();
        const seedB = seedrandom().int32().toString();
        rooms[roomId] = { seedA, seedB, players: [socket.id] };
        socket.emit("roomCreated", { roomId, seedA, seedB });
    });

    socket.on("joinRoom", (roomId) => {
        if (rooms[roomId]) {
            socket.join(roomId);
            rooms[roomId].players.push(socket.id);
            const { seedA, seedB } = rooms[roomId];
            socket.emit("joinedRoom", { roomId, seedA, seedB });
            io.to(roomId).emit("playerJoined", "A new player has joined the room");

            if (rooms[roomId].players.length === 2) {
                io.to(roomId).emit("roomReady");
            }
        } else {
            socket.emit("error", "Room does not exist");
        }
    });

    socket.on("sendMove", (data) => {
        const { roomId, direction } = data;
        socket.to(roomId).emit("receiveMessage", direction);
    });

    socket.on("gameLost", (data) => {
        const { roomId } = data;
        socket.to(roomId).emit("gameLost");
    });

    socket.on("gameWon", (data) => {
        const { roomId } = data;
        socket.to(roomId).emit("gameWon");
    });
});
