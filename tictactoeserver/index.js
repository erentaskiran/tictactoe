import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

var players = [];

io.on("connection", (socket) => {
  console.log(`A client connected with id: ${socket.id}`);

  socket.on("join", (data) => {
    console.log("join", data);
    players.push({ id: socket.id, name: data.name });
    socket.broadcast.emit("join", data);
    if (players.length >= 2) {
      console.log("start");
      console.log({
        player1: players[0],
        player2: players[1],
        turn: players[0],
        p1: "X",
        p2: "O",
        board: board,
        winner: "",
      });
      io.emit("play", {
        player1: players[0],
        player2: players[1],
        turn: players[0],
        p1: "X",
        p2: "O",
        board: board,
        winner: "",
      });
      players.splice(0, 2);
    }
  });

  socket.on("play", (data) => {
    console.log("play", data);
    if (checkWinner(data.board) != "") {
      data.winner = checkWinner(data.board);
      console.log("winner",data.winner)
      socket.emit("gameover", data.winner);
    }
    socket.broadcast.emit("play", data);
  });

  socket.on("gameover", (data) => {
    console.log("gameover", data);
    socket.broadcast.emit("gameover", data);
  });
});

httpServer.listen(8080);

function checkWinner(currentTable) {
  var countX = 0;
  var countY = 0;
  for (let i = 0; i < 3; i++) {
    if (
      currentTable[i][0] === currentTable[i][1] &&
      currentTable[i][1] === currentTable[i][2] &&
      currentTable[i][0] !== ""
    ) {
      return currentTable[i][0];
    }
    countX++;
  }
  for (let j = 0; j < 3; j++) {
    if (
      currentTable[0][j] === currentTable[1][j] &&
      currentTable[1][j] === currentTable[2][j] &&
      currentTable[0][j] !== ""
    ) {
      return currentTable[0][j];
    }
    countY++;
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
  if (countX * countY === 0) {
    return "draw";
  }
  return "";
}
