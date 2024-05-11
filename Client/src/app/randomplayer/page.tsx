"use client";
import { useState, useEffect, use } from "react";
import { io } from "socket.io-client";
import { Grid } from "react-loader-spinner";

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
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleJoin = () => {
    if (name === "" || name.length > 20) {
      if (name.length > 20) {
        alert("Name should be less than 20 characters");
      }
      if (name === "") {
        alert("Name should not be empty");
      }
      return;
    }
    console.log("join", name);
    socket.emit("join", { name: name });
    setLoading(true);
  };

  socket.on("gameover", (data) => {
    console.log("gameover", data);
    setWinCondition(data.winner);
  });

  socket.on("play", (data) => {
    if (data.player1.name === name || data.player2.name === name) {
      console.log("play", data);
      setLoading(false);
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
      }
    }
  });

  const handleClick = (rowIndex: number, collIndex: number) => {
    if (winCondition !== "" || socketData.turn.name !== name || xOrY == "") {
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
    setWinCondition("");
    setXOrY("");
    setPlayer1("");
    setPlayer2("");
    setTurn(false);
    setCurrentTable([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    socket.emit("join", { name: name });
    setLoading(true);
  };

  const handleHeaderClick = () => {
    location.pathname = "/";
  };

  return (
    <div className="h-screen bg-black text-slate-300">
      <div className="flex flex-col gap-10 items-center justify-center">
        <h1 className="text-6xl mt-24" onClick={handleHeaderClick}>
          Tic Tac Toe
        </h1>
      </div>
      <div className=" min-h-full flex flex-col justify-center items-center -mt-40">
        {loading && (
          <Grid
            visible={loading}
            height="80"
            width="80"
            color="#4b5563"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass="grid-wrapper"
          />
        )}

        {!loading && xOrY == "" && winCondition == "" && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl mb-4">Enter your name</div>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="bg-gray-600 p-2 w-72 text-2xl mt-4 mb-4"
            />
            <button
              onClick={handleJoin}
              className="bg-gray-600 p-2 w-48 text-2xl mt-4 mb-4 cursor-pointer hover:bg-slate-500"
            >
              Join
            </button>
          </div>
        )}

        {!loading &&
          winCondition == "" &&
          socketData.winner == "" &&
          xOrY != "" && (
            <h2 className="text-2xl mb-12">
              {turn === true ? xOrY : xOrY == "X" ? "O" : "X"}&apos;s turn
            </h2>
          )}

        {!loading && winCondition != "" && (
          <div>
            <h1 className="text-4xl mb-10">
              {winCondition == "draw"
                ? "Draw!"
                : `${winCondition} wins the game`}{" "}
            </h1>
          </div>
        )}

        {!loading && (winCondition != "" || socketData.winner != "") && (
          <button onClick={handleNewGame} className="text-2xl p-4 mb-12">
            New game
          </button>
        )}

        {!loading && xOrY != "" && (
          <div className="grid grid-cols-3">
            <div className="mr-12 flex flex-col items-end text-2xl gap-4 max-w-48">
              <div>{player1 === name ? "You" : player1}</div>
              <div>{socketData.p1}</div>
            </div>
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-52">
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
            </div>
            <div className="ml-12 flex flex-col items-start text-2xl gap-4">
              <div>{player2 === name ? "You" : player2}</div>
              <div>{socketData.p2}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
