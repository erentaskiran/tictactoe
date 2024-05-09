"use client";
import { useState, useEffect, use } from "react";
import { io } from "socket.io-client";

type Data = {
  player1: { name: string; id: string };
  player2: { name: string; id: string };
  turn: { name: string; id: string };
  p1: string;
  p2: string;
  board: string[][];
  winner: string;
};
const socket = io("http://localhost:8080");
socket.on("connect", () => {
  console.log("connected");
});

export default function RandomPlayer() {
  const [currentTable, setCurrentTable] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [loadingCounter, setLoadingCounter] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [turn, setTurn] = useState<boolean>(false);
  const [xOrY, setXOrY] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");
  const [player1, setPlayer1] = useState<string>("");
  const [winCondition, setWinCondition] = useState<string>("");
  const [socketData, setSocketData] = useState<Data>({
    player1: { name: "", id: "" },
    player2: { name: "", id: "" },
    turn: { name: "", id: "" },
    p1: "",
    p2: "",
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    winner: "",
  });
  const loading = ["Loading", "Loading.", "Loading..", "Loading..."];

  setInterval(() => {
    setLoadingCounter((loadingCounter + 1) % 4);
  }, 500);

  const handleJoin = () => {
    console.log("join", name);
    socket.emit("join", { name: name });
  };

  socket.on("play", (data) => {
    if(data.player1.name === name || data.player2.name === name){
    setCurrentTable(data.board);
    setSocketData(data);
    setPlayer2(data.player2.name);
    setPlayer1(data.player1.name);
    if (data.turn.name === name) {
      setTurn(true);
    } else {
      setTurn(false);
    }
    if (data.player1.name === name) {
      setXOrY(data.p1);
    } else {
      setXOrY(data.p2);
    }}
  });

  socket.on("gameover", (data) => {
    setWinCondition(data.winner);
    console.log(winCondition);
  });

  const handleClick = (rowIndex: number, collIndex: number) => {
    if (
      socketData.winner !== "" ||
      socketData.turn.name !== name ||
      xOrY == ""
    ) {
      return;
    }
    if (currentTable[rowIndex][collIndex] === "") {
      const newTable = currentTable;
      newTable[rowIndex][collIndex] = xOrY;
      const data = {
        player1: socketData.player1,
        player2: socketData.player2,
        turn:
          socketData.turn.id === socketData.player1.id
            ? socketData.player2
            : socketData.player1,
        p1: socketData.p1,
        p2: socketData.p2,
        board: newTable,
        winner: "",
      };
      setSocketData(data);
      socket.emit("play", data);

      setTurn(false);
      setCurrentTable(newTable);
    }
  };

  const handleNewGame = () => {
    location.reload();
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-slate-300">
      <div className="flex flex-col gap-10 items-center justify-center mb-12">
        <h1 className="text-4xl">Tic Tac Toe</h1>
        {winCondition == "" && socketData.winner == "" && xOrY != "" && (
          <h2 className="text-2xl">
            {turn === true ? "Your" : "Opponent"}&apos;s turn
          </h2>
        )}
      </div>
      {xOrY == "" && winCondition == "" && (
        <div>
          <div>Enter your name</div>
          <input type="text" onChange={(e) => setName(e.target.value)} />
          <button onClick={handleJoin}>Join</button>
        </div>
      )}

      {(socketData.winner !== "" || winCondition != "") && (
        <div>
          <h1 className="text-4xl mb-10">
            {socketData.winner === "draw"
              ? "draw!"
              : socketData.winner === socketData.p1
              ? `${
                  winCondition != ""
                    ? socketData.player2.name
                    : socketData.player1.name
                } wins`
              : `${
                  winCondition != ""
                    ? socketData.player1.name
                    : socketData.player2.name
                } wins`}
          </h1>
        </div>
      )}

      {(winCondition != "" || socketData.winner != "") && (
        <button onClick={handleNewGame}>New game</button>
      )}

      {xOrY != "" && (
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
            <div className="mr-12 flex flex-col items-center text-2xl gap-4">
              <div>{player1}</div>
              <div>{socketData.p1}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {currentTable.map((row, rowIndex) => {
                return row.map((cell, collIndex) => (
                  <div
                    key={`${rowIndex}-${collIndex}`}
                    onClick={() => handleClick(rowIndex, collIndex)}
                    className="bg-gray-600 flex justify-center items-center w-16 h-16 text-2xl cursor-pointer hover:bg-slate-500"
                  >
                    {cell}
                  </div>
                ));
              })}
            </div>
            <div className="ml-12 flex flex-col items-center text-2xl gap-4">
              <div>{player2}</div>
              <div>{socketData.p2}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
