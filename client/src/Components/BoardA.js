import React from 'react';
import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";
import { useEffect, useState } from 'react';

const BoardA = ({ socket, seed, roomId, roomReady }) => {
    const [board, setBoard] = useState(new Board(seed));
    const [gameLost, setGameLost] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const handleKeyDown = (event) => {
        if (!roomReady || board.hasWon()) {
            return;
        }

        else if (event.keyCode >= 37 && event.keyCode <= 40) {
            let direction = event.keyCode - 37;
            socket.emit("sendMove", { roomId, direction });
            let clonedBoard = Object.assign(Object.create(Object.getPrototypeOf(board)), board);
            let newBoard = clonedBoard.move(direction, seed);
            setBoard(newBoard);

            if (newBoard.hasLost()){
                setGameLost(true);
                socket.emit("gameLost", {roomId});
            }
            
            if (newBoard.hasWon()){
                setGameWon(true);
                socket.emit("gameWon", {roomId});
            }
        }
    };

    useEffect(() => {
        socket.on("roomReady", () => {
            roomReady = true;
        });
        
        socket.on("gameLost", () => {
            setGameWon(true);
            window.removeEventListener('keydown', handleKeyDown);
        });
        
        socket.on("gameWon", () => {
            setGameLost(true);
            window.removeEventListener('keydown', handleKeyDown);
        });

        window.addEventListener('keydown', handleKeyDown);

        return function cleanUp() {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [board, roomReady]);

    const cells = board.cells.map((row, rowIndex) => (
        <div key={rowIndex}>
            {row.map((col, colIndex) => (
                <Cell key={colIndex} />
            ))}
        </div>
    ));

    const tiles = board.tiles.filter((tile) => tile.value !== 0).map((tile, index) => (
        <Tile tile={tile} key={index} />
    ));

    return (
        <div>
            <div className='details-box'>
                <div className="score-box">
                    <div className="score-header">SCORE</div>
                    <div>{board.score}</div>
                </div>
                {gameLost && (
                    <div className='youLost'>
                        you lost!
                    </div>
                )}
                {gameWon && (
                    <div className='youLost'>
                        you won!
                    </div>
                )}
            </div>
            <div className={`board ${gameLost ? 'lost' : ''}`}>
                {cells}
                {tiles}
            </div>
        </div>
    );
};

export default BoardA;
