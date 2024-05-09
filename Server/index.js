import { createServer } from "http";
import { Server } from "socket.io";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { initializeApp } from "firebase/app";
import dotenv from 'dotenv';
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

const app = initializeApp(firebaseConfig);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const database = getDatabase();

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

var playerCount = 0;
const usersRef = ref(database, `users/${playerCount}`);
var isSaving = false;
io.on("connection", (socket) => {
  console.log(`A client connected with id: ${socket.id}`);

  socket.on("join", (data) => {
    console.log("join", data);
    var tmp = { id: socket.id, name: data.name };
    console.log(tmp);
    isSaving = true;
    set(ref(database,`users/${playerCount++}`), tmp)
      .then(() => {
        console.log("Saved successfully");
        if (playerCount >= 2) {
          var players = [];
          get(ref(database, `users/0`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                players.push(snapshot.val());
                console.log("players", snapshot.val());
                console.log("pushtan sonra", players);
                playerCount--;
                remove(ref(database, `users/0`));
              }

            })
            .then(() => {
              get(ref(database, `users/1`)).then((snapshot) => {
                if (snapshot.exists()) {
                  players.push(snapshot.val());
                  console.log("players", snapshot.val());
                  console.log("pushtan sonra", players);
                  if (players.length >= 2) {
                    console.log("girdi");
                    const player1 = players[0];
                    const player2 = players[1];
                    io.emit("play", {
                      player1: player1,
                      player2: player2,
                      turn: player1,
                      p1: "X",
                      p2: "O",
                      board: board,
                      winner: "",
                    });
                  } else {
                    console.log("No data available");
                  }
                  remove(ref(database, `users/1`));
                }

                playerCount--;
              });
            })
          console.log(players);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  socket.on("play", (data) => {
    console.log("play", data);
    if (checkWinner(data.board) != "") {
      data.winner = checkWinner(data.board);
      console.log("winner", data.winner);
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
