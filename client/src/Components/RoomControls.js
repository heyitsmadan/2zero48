import React from "react";
import { useState } from "react";

export default function RoomControls({ socket }) {
    const [roomId, setRoomId] = useState("");
    const [roomCreated, setRoomCreated] = useState(false);

    const createRoom = () => {
        socket.emit("createRoom");
        setRoomCreated(true);
    };

    const joinRoom = () => {
        if (roomId) {
            socket.emit("joinRoom", roomId);
            setRoomCreated(true);
        }
    };

    return (
        <div>
            {!roomCreated && (
                <div className="room-controls">
                    <div onClick={createRoom} className="createRoomButton">create room</div>
                    <div className="join-room-controls">
                        <input
                            type="text"
                            value={roomId}
                            placeholder=""
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <div onClick={joinRoom} className="joinRoomButton">join room</div>
                    </div>
                </div>
            )}
        </div>
    );
}
