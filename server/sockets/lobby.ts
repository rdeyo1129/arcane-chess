// server/sockets/lobby.ts
import { Server, Socket } from 'socket.io';
import * as gameStore from '../redis/gameStore.js';

type LobbyJoinPayload = { gameId: string };

export default function lobby(io: Server) {
  io.on('connection', (socket: Socket) => {
    const hostId = socket.handshake.auth.guestId as string;

    // Clean up on disconnect (removes any games you hosted)
    socket.on('disconnect', async () => {
      try {
        const allGames = await gameStore.listLobbyGames();
        for (const g of allGames.filter((g) => g.hostSocketId === socket.id)) {
          await gameStore.deleteGame(g.gameId);
        }
        io.emit('lobby:update', await gameStore.listLobbyGames());
      } catch (err) {
        console.error('Error cleaning up on disconnect:', err);
      }
    });

    // Create a new custom or quickfind game
    socket.on('lobby:create', async ({ isPrivate }) => {
      try {
        const allGames = await gameStore.listLobbyGames();
        const alreadyHas = allGames.some(
          (g) =>
            g.hostSocketId === socket.id &&
            g.matchType === 'custom' &&
            g.isFull !== 'true'
        );
        if (alreadyHas) {
          return socket.emit('error', {
            message: 'You already have an open game.',
          });
        }

        const gameId = await gameStore.createGame({
          hostSocketId: socket.id,
          hostId,
          isPrivate,
          matchType: 'custom',
        });

        io.emit('lobby:update', await gameStore.listLobbyGames());
        socket.emit('lobby:created', { gameId });
      } catch (err) {
        console.error('Create game error:', err);
        socket.emit('error', { message: 'Failed to create game.' });
      }
    });

    // Send current lobby to client
    socket.on('lobby:list', async () => {
      const games = await gameStore.listLobbyGames();
      socket.emit('lobby:update', games);
    });

    // Join an existing game
    socket.on('lobby:join', async ({ gameId }: LobbyJoinPayload) => {
      try {
        // 1️⃣ Remove any custom games *you* created but never filled
        const allGames = await gameStore.listLobbyGames();
        const myPending = allGames.filter(
          (g) =>
            g.hostSocketId === socket.id &&
            g.matchType === 'custom' &&
            g.isFull !== 'true'
        );
        for (const g of myPending) {
          await gameStore.deleteGame(g.gameId);
        }

        // 2️⃣ Now join the requested game
        const game = await gameStore.joinGame(gameId, socket.id);
        if (!game) {
          return socket.emit('error', {
            message: 'Game not found or already full.',
          });
        }

        // 3️⃣ Broadcast the updated lobby (removes both your old and this game)
        io.emit('lobby:update', await gameStore.listLobbyGames());

        // 4️⃣ Put both players in the room, then send them individualized starts
        const room = `game:${game.gameId}`;
        socket.join(room);
        io.sockets.sockets.get(game.hostSocketId)?.join(room);

        socket.emit('lobby:joined', { gameId: game.gameId });

        // ▪️ coin-flip for who gets white
        const hostIsWhite = Math.random() < 0.5;
        const hostSide = hostIsWhite ? 'white' : 'black';
        const joinerSide = hostIsWhite ? 'black' : 'white';

        // ▪️ your engine payload
        const initialFen = game.startFen;
        const whiteConfig = game.whiteArcana;
        const blackConfig = game.blackArcana;
        const royalties = game.royalties || {};
        const preset = game.preset || 'CLEAR';

        // → to the joiner
        socket.emit('game:start', {
          gameId,
          yourSocketId: socket.id,
          opponentSocketId: game.hostSocketId,
          yourSide: joinerSide,
          opponentSide: hostSide,
          fen: initialFen,
          whiteConfig,
          blackConfig,
          royalties,
          preset,
        });

        // → to the host
        io.to(game.hostSocketId).emit('game:start', {
          gameId,
          yourSocketId: game.hostSocketId,
          opponentSocketId: socket.id,
          yourSide: hostSide,
          opponentSide: joinerSide,
          fen: initialFen,
          whiteConfig,
          blackConfig,
          royalties,
          preset,
        });

        // 5️⃣ Final broadcast in case game:start changed anything
        io.emit('lobby:update', await gameStore.listLobbyGames());
      } catch (err) {
        console.error('Join error:', err);
        socket.emit('error', { message: 'Failed to join game.' });
      }
    });
  });
}
