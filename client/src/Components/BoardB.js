import React, { useState, useEffect } from 'react';
import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";

const WaitingMessage = ({ roomReady }) => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        let interval = setInterval(() => {
            if (!roomReady) {
                setDots(prevDots => (prevDots === "..." ? "" : prevDots + "."));
            } else {
                setDots("");
            }
        }, 500);

        return () => clearInterval(interval);
    }, [roomReady]);

    if (roomReady) {
        return null;
    }

    return (
        <div id="waiting-text">
            waiting for opponent{dots}
        </div>
    );
};

const BoardB = ({ socket, seed, roomId, roomReady }) => {
    const [boardB, setBoardB] = useState(new Board(seed));
    const [gameLost, setGameLost] = useState(false);

    useEffect(() => {
        function handleReceiveMessage(direction) {
            setBoardB(prevBoardB => {
                let clonedBoard = Object.assign(Object.create(Object.getPrototypeOf(prevBoardB)), prevBoardB);
                let newBoardB = clonedBoard.move(direction);
                return newBoardB;
            });
        }

        socket.on("receiveMessage", (direction) => handleReceiveMessage(direction));

        socket.on("gameLost", () => {
            setGameLost(true);
        });

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket]);

    const cells = boardB.cells.map((row, rowIndex) => (
        <div key={rowIndex}>
            {row.map((col, colIndex) => (
                <Cell key={colIndex} />
            ))}
        </div>
    ));

    const tiles = boardB.tiles.filter((tile) => tile.value !== 0).map((tile, index) => (
        <Tile tile={tile} key={index} />
    ));

    return (
        <div className={`boardB ${roomReady ? 'boardB-ready' : 'boardB-waiting'}`}>
            <div className='details-box'>
                <WaitingMessage roomReady={roomReady} />
                <div className={`score-box-B ${!roomReady ? 'score-box-B-waiting' : ''}`}>
                    <div className="score-header">SCORE</div>
                    <div>{boardB.score}</div>
                </div>
            </div>
            <div className={`board ${gameLost ? 'lost' : ''}`}>
                {cells}
                {tiles}
            </div>
        </div>
    );
};

export default BoardB;
