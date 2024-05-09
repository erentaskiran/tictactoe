'use client'
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
      alert("Draw!");
      setCurrentTable([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
    }
  }

  function handleClick(rowIndex:number, collIndex:number) {
    if (currentTable[rowIndex][collIndex] !== "" || turn !== currentPlayer) {
      return;
    }
    const newTable = [...currentTable];
    newTable[rowIndex][collIndex] = currentPlayer;
    setCurrentTable(newTable);
    if (checkWinner()) {
      alert(`Player ${currentPlayer === player1 ? "1" : "2"} wins!`);
      setCurrentTable([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      return;
    }
    setTurn(turn === player1 ? player2 : player1);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }

  useEffect(() => {
    const rand = Math.floor(Math.random() * 2);
    if (rand === 0) {
      setPlayer1("X");
      setPlayer2("O");
      setTurn("X");
      setCurrentPlayer("X");
    } else {
      setPlayer1("O");
      setPlayer2("X");
      setTurn("O");
      setCurrentPlayer("O");
    }
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-black text-slate-300">
      <div className="-mt-24">
        <div className="flex flex-col gap-10 items-center justify-center mb-12">
          <h1 className="text-4xl">Tic Tac Toe</h1>
          <h2 className="text-2xl">
            Player {currentPlayer === player1 ? "1" : "2"}&apos;s turn
          </h2>
        </div>
        <div className="flex justify-center items-center">
          <div className="mr-12 flex flex-col items-center text-2xl gap-4">
            <div>Player 1</div>
            <div>{player1}</div>
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
          <div className="ml-12 flex flex-col items-center text-2xl gap-4" >
            <div >Player 2</div>
            <div>{player2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

