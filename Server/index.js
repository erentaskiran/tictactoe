import  express  from "express";
import http from 'http';
import { Server } from "socket.io";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);


const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"] 
  }
});
const database = getDatabase();

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

var playerCount = 0;
io.on("connection", (socket) => {
  console.log(`A client connected with id: ${socket.id}`);

  socket.on("join", (data) => {
    console.log("join", data);
    var tmp = { id: socket.id, name: data.name };
    console.log(tmp);
    set(ref(database, `users/${playerCount++}`), tmp)
      .then(() => {
        console.log("Saved successfully");
        if (playerCount >= 2) {
          var players = [];
          get(ref(database, `users/0`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                players.push(snapshot.val());
                playerCount--;
                remove(ref(database, `users/0`));
              }
            })
            .then(() => {
              get(ref(database, `users/1`)).then((snapshot) => {
                if (snapshot.exists()) {
                  players.push(snapshot.val());
                  if (players.length >= 2) {
                    const player1 = players[0];
                    const player2 = players[1];
                    io.emit("play", {
                      player1: player1,
                      player2: player2,
                      turn: player1,
                      p1: "X",
                      p2: "O",
                      board: board,
                    });
                  } else {
                    console.log("No data available");
                  }
                  remove(ref(database, `users/1`));
                }

                playerCount--;
              });
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  socket.on("play", (data) => {
    console.log("play", data);
    if (checkWinner(data.board) != "") {
      const tmp = checkWinner(data.board);
      let winner = tmp === "draw" ? "draw" : tmp === "X" ? data.player1.name : data.player2.name;
      console.log("winner", winner);
      io.emit("gameover", { winner: winner });
    }
    io.emit("play", data);
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});

function checkWinner(currentTable) {
  let countPlays = 0;
  let countEmptyCells = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentTable[i][j] !== "") {
        countPlays++;
      } else {
        countEmptyCells++;
      }
    }
  }
  if (countPlays === 9 && countEmptyCells === 0) {
    return "draw";
  }
  for (let i = 0; i < 3; i++) {
    if (
      currentTable[i][0] === currentTable[i][1] &&
      currentTable[i][1] === currentTable[i][2] &&
      currentTable[i][0] !== ""
    ) {
      return currentTable[i][0];
    }
  }
  for (let j = 0; j < 3; j++) {
    if (
      currentTable[0][j] === currentTable[1][j] &&
      currentTable[1][j] === currentTable[2][j] &&
      currentTable[0][j] !== ""
    ) {
      return currentTable[0][j];
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

  return "";
}
