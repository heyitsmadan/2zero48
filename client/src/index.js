import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import BoardA from "./Components/BoardA";
import BoardB from "./Components/BoardB";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import RoomControls from "./Components/RoomControls";
import Header from "./Components/Header";

const socket = io.connect("http://localhost:3001");

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  const [seedA, setSeedA] = useState(null);
  const [seedB, setSeedB] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("");
  const [roomReady, setRoomReady] = useState(false);

  useEffect(() => {
    socket.on("seeds", (data) => {
      setSeedA(data.seedA);
      setSeedB(data.seedB);
    });

    socket.on("roomCreated", ({ roomId, seedA, seedB }) => {
      setCurrentRoom(roomId);
      setSeedA(seedB);
      setSeedB(seedA);
    });

    socket.on("joinedRoom", ({ roomId, seedA, seedB }) => {
      setCurrentRoom(roomId);
      setSeedA(seedA);
      setSeedB(seedB);
    });

    socket.on("roomReady", () => {
      setRoomReady(true);
    });
  }, []);

  return (
    <div className="app">
      <div className="landingPage">
        <Header />
        <RoomControls socket={socket} />
      </div>
      <div className="boards">
        {seedA && <BoardA socket={socket} seed={seedA} roomId={currentRoom} roomReady={roomReady} />}
        {seedB && <BoardB socket={socket} seed={seedB} roomId={currentRoom} roomReady={roomReady} />}
      </div>
      {currentRoom && <div className="current-room">room id: {currentRoom}</div>}
    </div>
  );
}

root.render(
  <React.StrictMode>
  <App />
  </React.StrictMode>
);
