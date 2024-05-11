"use client";
import { useEffect, useState } from "react";

export default function Localgame() {
  const [currentTable, setCurrentTable] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [turn, setTurn] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [winCondition, setWinCondition] = useState("");

  function checkWinner() {
    let count = 0;
    for (let i = 0; i < 3; i++) {
      if (
        currentTable[i][0] === currentTable[i][1] &&
        currentTable[i][1] === currentTable[i][2] &&
        currentTable[i][0] !== ""
      ) {
        return currentTable[i][0];
      }
      for (let j = 0; j < 3; j++) {
        if (currentTable[i][j] === "") {
          count++;
          continue;
        }
        if (
          currentTable[0][j] === currentTable[1][j] &&
          currentTable[1][j] === currentTable[2][j] &&
          currentTable[0][j] !== ""
        ) {
          return currentTable[0][j];
        }
      }
    }

    if (
      currentTable[0][0] === currentTable[1][1] &&
      currentTable[1][1] === currentTable[2][2] &&
      currentTable[0][0] !== ""
    ) {
      return currentTable[0][0];
    }
    if (
      currentTable[0][2] === currentTable[1][1] &&
      currentTable[1][1] === currentTable[2][0] &&
      currentTable[0][2] !== ""
    ) {
      return currentTable[0][2];
    }
    if (count === 0) {
      return "draw";
    }
    return "";
  }

  function handleClick(rowIndex: number, collIndex: number) {
    if (currentTable[rowIndex][collIndex] !== "" || turn !== currentPlayer) {
      return;
    }
    const newTable = [...currentTable];
    newTable[rowIndex][collIndex] = currentPlayer;
    setCurrentTable(newTable);
    if (checkWinner()) {
      setWinCondition(checkWinner());
      return;
    }
    setTurn(turn === player1 ? player2 : player1);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }

  const handleHeaderClick = () => {
    location.pathname = "/";
  };

  const handleNewGame = () => {
    const rand = Math.floor(Math.random() * 2);
    if (rand === 0) {
      setPlayer1("X");
      setPlayer2("O");
    } else {
      setPlayer1("O");
      setPlayer2("X");
    }
    setTurn("X");
    setCurrentPlayer("X");
    setWinCondition("");
    setCurrentTable([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  };

  useEffect(() => {
    handleNewGame();
  }, []);

  return (
    <div className="h-screen bg-black text-slate-300">
      <div className="flex flex-col gap-10 items-center justify-center">
        <h1 className="text-6xl mt-24" onClick={handleHeaderClick}>
          Tic Tac Toe
        </h1>
      </div>
      <div
      className="flex flex-col items-center justify-center gap-10 mt-12"
      >
        {winCondition == "" && (
          <h2 className="text-2xl mb-12">{turn}&apos;s turn</h2>
        )}

        {winCondition != "" && (
          <div>
            <h1 className="text-4xl mb-10">
              {winCondition == "draw"
                ? "Draw!"
                : `${winCondition} wins the game`}{" "}
            </h1>
          </div>
        )}

        {winCondition != "" && (
          <button onClick={handleNewGame} className="text-2xl p-4 mb-12">
            New game
          </button>
        )}

        {winCondition == "" && (
          <div className="grid grid-cols-3">
            <div className="mr-12 flex flex-col items-end text-2xl gap-4 max-w-48">
              <div>Player1</div>
              <div>{player1}</div>
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
              <div>Player 2</div>
              <div>{player2}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
