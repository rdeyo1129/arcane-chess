// test 27488a30-1ff3-4f9a-b127-b63f68aabf76

import _ from "lodash";
import bodyParser from "body-parser";

// import passport from "passport";
// import passportConfig from "./config/passport.mjs";

import { v4 } from "uuid";

// Load Game and User model
// import { Game } from "./src/models/Game.mjs";
// import User from "./src/models/User.mjs";
import config from "./config/keys.js";
import mongoose, { ConnectOptions } from "mongoose";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// db config
const db = config.mongoURI;

const dbOptions: ConnectOptions = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

mongoose.set("strictQuery", false);

// Connect to MongoDB
mongoose
  .connect(db, dbOptions)
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

import users from "./api/users";
import games from "./api/games";
import campaign from "./api/campaign";
import templates from "./api/templates";

import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import favicon from "serve-favicon";

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 8080;

// todo
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
}
// if (process.env.NODE_ENV === 'development') { include separate DB/cluster here? }

// use body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Passport middleware
// app.use(passport.initialize());

// Passport config
// passportConfig(passport);

// Routes
app.use("/api/users", users);
app.use("/api/games", games);
app.use("/api/campaign", campaign);
app.use("/api/templates", templates);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

// const { use } = require('passport');

// initialize new Chess object
// import tactoriusValidation from "./src/tactoriusValidation.mjs";

const rooms = {};

const activeGames = {};

// forget about the multiple rounds thing
// make options for multiple rounds for 2 and 4 player events
const tourneyTool = (roomId, seats, round, matches) => {
  // 0 = w, 1 = b
  const rr2 = [[[0, 1, v4()]]];
  const rr4 = [
    [
      [0, 1, v4()],
      [2, 3, v4()],
    ],
    [
      [1, 2, v4()],
      [3, 0, v4()],
    ],
    [
      [0, 2, v4()],
      [1, 3, v4()],
    ],
  ];
  const rr8 = Array(7);
  const players = rooms[roomId].players;

  rooms[roomId].arenaStatus = "started";

  if (seats === 2) {
    if (round > 1) {
      return;
    }

    _.forEach(rr2[round], (pairing) => {
      activeGames[pairing[2]] = {
        // gameData: tactoriusValidation(
        //   players[pairing[0]].faction.powers,
        //   players[pairing[1]].faction.powers
        // ),
        metaData: {
          gameId: pairing[2],
          white: { ...players[pairing[0]], color: "white" },
          black: { ...players[pairing[1]], color: "black" },
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          history: [],
          fenHistory: [
            // "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          ],
          gameStatus: "",
          gameOver: false,
          users: 2,
          wRoyalty: null,
          bRoyalty: null,
          wVisCount: 0,
          bVisCount: 0,
          castlingSquares: {},
        },
      };
      const castlingSquares = activeGames[pairing[2]].gameData.setRandomize(
        activeGames[pairing[2]].metaData.fen
      );
      activeGames[pairing[2]].gameData.setCastlingSquares();
      activeGames[pairing[2]].gameData.setPromotion();
      activeGames[pairing[2]].metaData.fenHistory.push(
        activeGames[pairing[2]].gameData.setFenFromPosition()
      );
    });

    io.to(roomId).emit("startRound", {
      activeGames,
      arenaStatus: "started",
    });
  }
  if (seats === 4) {
    if (round > 3) {
      return;
    }

    _.forEach(rr4[round], (pairing) => {
      activeGames[pairing[2]] = {
        // gameData: tactoriusValidation(
        //   players[pairing[0]].faction.powers,
        //   players[pairing[1]].faction.powers
        // ),
        metaData: {
          gameId: pairing[2],
          white: { ...players[pairing[0]], color: "white" },
          black: { ...players[pairing[1]], color: "black" },
          fen: "",
          history: [],
          fenHistory: [],
          gameStatus: "",
          gameOver: false,
          wVisCount: 0,
          bVisCount: 0,
        },
      };
    });

    io.to(roomId).emit("startRound", {
      activeGames,
    });
  }
  if (seats === 8) {
    if (round > 7) {
      return;
    }
  }
};

// todo
// randomize seating

io.sockets.on("connection", (socket) => {
  socket.on("requestRooms", () => {
    io.sockets.emit("getRooms", {
      // move lobby full to tournament started let spectators in before tournament start
      filteredRooms: _.omitBy(rooms, (room) => {
        return room.lobbyFull;
      }),
    });
  });

  socket.on("requestGameData", (data) => {
    socket.join(data.gameId);
    socket.emit("sendGameData", {
      // todo hook into tournament
      metaData: activeGames[data.gameId].metaData,
      engineOn: data.engineOn,
    });
  });

  socket.on("createVersusLobby", (data) => {
    rooms[data.roomId] = {
      roomId: data.roomId,
      players: [
        {
          playerId: data.playerId,
          username: data.player,
          color: null,
          faction: null,
          isHost: true,
          seat: 0, // todo randomize from seats
          // handicaps:
          // rating:
          // rank:
        },
      ],
      seats: data.playerNum,
      openSeats: data.playerNum - 1,
      nextSeat: 1,
      round: 0,
      lobbyFull: false,
      selectedTemplate: { ...data.selectedTemplate },
      arenaStatus: "open",
      type: data.type,
      spectators: [],
      time: [],
      statusText: "Game start. White to move.",
    };
    io.sockets.emit("updateVersusLobbies", {
      rooms: rooms,
      roomId: data.roomId,
    });
    io.to(data.roomId).emit("updateRoom", {
      rooms: rooms,
      roomId: data.roomId,
      playerId: data.playerId,
      selectedTemplate: data.selectedTemplate,
      arenaStatus: "open",
    });
  });

  socket.on("addPlayer", (data) => {
    socket.join(data.roomId);
    if (rooms[data.roomId]) {
      io.to(data.roomId).emit("updateRoom", {
        rooms: rooms,
        roomId: data.roomId,
        playerId: data.playerId,
        selectedTemplate: rooms[data.roomId].selectedTemplate,
        arenaStatus: rooms[data.roomId].arenaStatus,
      });
    }
  });

  socket.on("getTournament", (data) => {
    if (rooms[data.roomId]) {
      io.to(data.roomId).emit("updateRoom", {
        rooms: rooms,
        roomId: data.roomId,
        playerId: data.playerId,
        arenaStatus: rooms[data.roomId].arenaStatus,
      });
    }
  });

  socket.on("joinVersusLobby", (data) => {
    // socket.join(data.roomId);
    rooms[data.roomId].players = [
      ...rooms[data.roomId].players,
      {
        playerId: data.playerId,
        username: data.player,
        color: null,
        faction: null,
        isHost: false,
        seat: rooms[data.roomId].nextSeat,
        // handicaps:
        // rating:
        // rank:
      },
    ];

    rooms[data.roomId].nextSeat += 1;
    rooms[data.roomId].openSeats -= 1;

    if (rooms[data.roomId].openSeats === 0) {
      rooms[data.roomId].lobbyFull = true;
    }
  });

  socket.on("selectFaction", (data) => {
    let factionCounter = 0;

    _.find(rooms[data.roomId].players, (player) => {
      return player.playerId === data.playerId;
    }).faction = { ...data.faction, letter: data.letter };

    _.forEach(rooms[data.roomId].players, (player) => {
      if (player.faction) {
        factionCounter++;
      }
      if (rooms[data.roomId].players.length === factionCounter) {
        io.to(data.roomId).emit("conveyFactionPick", {
          room: rooms[data.roomId],
          playerId: data.playerId,
          roomId: data.roomId,
          faction: data.faction,
          factionsArePicked: true,
        });
      } else {
        io.to(data.roomId).emit("conveyFactionPick", {
          room: rooms[data.roomId],
          playerId: data.playerId,
          roomId: data.roomId,
          faction: data.faction,
          factionsArePicked: false,
        });
      }
    });
  });

  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("conveyMessage", data);
  });

  socket.on("initializeTournament", (data) => {
    tourneyTool(data.roomId, data.playerNum, 0, 1);
    // create advanceTourney socket on
  });

  socket.on("move", (data) => {
    const gameData = activeGames[data.gameId].gameData;
    const metaData = activeGames[data.gameId].metaData;

    if (metaData.wVisCount > 0) {
      metaData.wVisCount = data.wVisCount;
    }
    if (metaData.bVisCount > 0) {
      metaData.bVisCount = data.bVisCount;
    }

    if (data.abilityClass === "normal") {
      if (
        data.ability === "binaryMove" ||
        data.ability === "rookDeploy" ||
        data.ability === "bishopDeploy" ||
        data.ability === "knightDeploy"
      ) {
        gameData.normalMove(
          data.moveString[1],
          data.moveString[2],
          "binaryMove"
        );
        gameData.normalMove(data.moveString[4], data.moveString[5]);

        gameData.addToHistory(
          `${data.moveString.join("")}${
            gameData.inCheck().isAttacked ? "+" : ""
          }`
        );
        gameData.shiftTurn();
      } else if (
        data.ability === "swapAdjacent" ||
        data.ability === "swapAttack" ||
        data.ability === "swapDeploy"
      ) {
        gameData.swapMove(data.from, data.to);
        gameData.addToHistory(`${data.from}&${data.to}`);
      } else {
        const move = gameData.normalMove(data.from, data.to, data.ability);
        if (move === "castleK" || move === "castleQ") {
          gameData.addToHistory(data.moveString);
          gameData.shiftTurn();
        } else {
          gameData.addToHistory(
            `${move.piece.toUpperCase()}${data.from}${
              data.capturedPiece ? "x" : ""
            }${data.to}${gameData.inCheck().isAttacked ? "+" : ""}`
          );
          gameData.shiftTurn();
        }
      }
    }
    if (data.abilityClass === "summon") {
      // todo sac summon conditionals
      if (data.ability === "promotion") {
        gameData.normalMove(data.from, data.to, null);
        gameData.summonMove(data.to, data.ability, data.piece);
        gameData.addToHistory(data.summonString);
      }
      if (data.ability === "sacSummonMin") {
        gameData.removeQueen();
        gameData.summonMove(
          data.summonString[1],
          data.ability,
          data.summonString[0]
        );
        gameData.summonMove(
          data.summonString[3],
          data.ability,
          data.summonString[2]
        );
        gameData.summonMove(
          data.summonString[5],
          data.ability,
          data.summonString[4]
        );
        gameData.addToHistory(data.summonString);
      } else if (data.ability === "sacSummonMaj") {
        gameData.removeQueen();
        gameData.summonMove(data.summonString[1], data.ability, "R");
        gameData.summonMove(data.summonString[3], data.ability, "R");
        gameData.addToHistory(data.summonString);
      } else {
        gameData.summonMove(data.to, data.ability, data.piece);
        gameData.addToHistory(data.moveString);
      }
    }
    if (data.abilityClass === "other") {
      if (data.ability === "invisibility") {
        metaData.wVisCount = data.wVisCount;
        metaData.bVisCount = data.bVisCount;
      }
    }

    socket.broadcast.to(data.gameId).emit("conveyMove", {
      from: data.from,
      to: data.to,
      capturedPiece: data.capturedPiece,
      ability: data.ability,
      abilityClass: data.abilityClass,
      isConveyed: true,
      moveString: data.moveString,
      summonString: data.summonString,
      wRoyalty: data.wRoyalty,
      bRoyalty: data.bRoyalty,
      wVisCount: data.wVisCount,
      bVisCount: data.bVisCount,
      piece: data.piece,
    });
  });

  socket.on("requestGameOver", (data) => {
    const players = {
      white: { ...data.white },
      black: { ...data.black },
    };

    const leaver = _.find(players, (player) => {
      return player.playerId === data.playerId;
    });

    // todo or if a victory condition
    // todo delete game property from active games

    if (activeGames[data.gameId]) {
      if (data.type === "ABORT") {
        activeGames[data.gameId].metaData.gameOver = true;
        activeGames[
          data.gameId
        ].metaData.gameStatus = `${leaver.username} aborted the game.`;
        io.emit("sendGameOverData", {
          gameOver: true,
          type: data.type,
          gameStatus: activeGames[data.gameId].metaData.gameStatus,
        });
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            // ignore the default room
            socket.leave(room);
          }
        });
        activeGames[data.gameId].metaData.users -= 1;
        if (activeGames[data.gameId].metaData.users === 0) {
          delete activeGames[data.gameId];
        }
      }
      if (data.type === "RESIGN") {
        activeGames[data.gameId].metaData.matchEnded = true;
        activeGames[
          data.gameId
        ].metaData.gameStatus = `${leaver.username} resigns.`;
        io.emit("sendGameOverData", {
          gameOver: true,
          type: data.type,
          gameStatus: activeGames[data.gameId].metaData.gameStatus,
        });
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            // ignore the default room
            socket.leave(room);
          }
        });
        activeGames[data.gameId].metaData.users -= 1;
        if (activeGames[data.gameId].metaData.users === 0) {
          delete activeGames[data.gameId];
        }
      }
      if (data.type === "DRAW OFFERED") {
        activeGames[data.gameId].gameStatus = `${data.player} offers a draw.`;
        io.emit("sendGameOverData", {
          matchOver: false,
          type: data.type,
          statusText: activeGames[data.gameId].gameStatus,
        });
      }
      if (data.type === "DRAW ACCEPTED") {
        activeGames[data.gameId].gameOver = true;
        activeGames[data.gameId].statusText = "Draw agreed.";
        io.emit("sendGameOverData", {
          matchOver: true,
          type: data.type,
          statusText: activeGames[data.gameId].statusText,
        });
      }
      if (data.type === "DRAW CANCELLED") {
        activeGames[data.gameId].gameOver = false;
        activeGames[data.gameId].statusText = "Draw cancelled/rejected.";
        io.emit("sendGameOverData", {
          matchOver: false,
          type: data.type,
          statusText: activeGames[data.gameId].statusText,
        });
      }
    }

    // todo save game to DB

    // if (rooms[data.roomId].matchEnded) {
    //   // Create and save game
    //   const newGame = new Game({
    //     gameId: rooms[data.roomId].roomId,
    //     // gameData: rooms[data.roomId].gameData,
    //     history: rooms[data.roomId].gameData.history(),
    //     players: rooms[data.roomId].players,
    //     // pgn: rooms[data.roomId].gameData.pgn(),
    //     fenHistory: rooms[data.roomId].fenHistory,
    //   });
    //   newGame.save().catch((err) => console.log(err));

    //   // Save game to user's profile
    //   _.forEach(rooms[data.roomId].players, (value, key) => {
    //     User.findOneAndUpdate(
    //       { username: key },
    //       { $push: { games: newGame } },
    //       (error) => {
    //         if (error) {
    //           console.log("error: ", error);
    //         }
    //       }
    //     );
    //   });
    // }
  });

  socket.on("leaveTournament", (data) => {
    // check if tournament is empty and delete rooms property if so
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        // ignore the default room
        socket.leave(room);
      }
    });
  });

  socket.on("disconnect", (reason) => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        // ignore the default room
        socket.leave(room);
      }
    });
    console.log("disconnected", reason);
    // also remove from current lobby / game?
    // remove room property from rooms array
  });
});
