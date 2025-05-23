import { Server, Socket } from 'socket.io';
import * as gameStore from '../redis/gameStore';

type LobbyJoinPayload = { gameId: string };

export default function lobby(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('lobby:create', async ({ isPrivate }) => {
      await gameStore.createGame({
        hostSocketId: socket.id,
        isPrivate,
        matchType: 'custom',
      });
      io.emit('lobby:update', await gameStore.listLobbyGames());
    });

    socket.on('lobby:list', async () => {
      const games = await gameStore.listLobbyGames();
      socket.emit('lobby:update', games);
    });

    socket.on('lobby:join', async ({ gameId }: LobbyJoinPayload) => {
      try {
        const game = await gameStore.joinGame(gameId, socket.id);
        if (!game) {
          return socket.emit('error', { message: 'Game not found or full' });
        }

        const room = `game:${game.gameId}`;
        socket.join(room);
        io.sockets.sockets.get(game.hostSocketId)?.join(room);
        io.to(room).emit('game:start', {
          room,
          players: [socket.id, game.hostSocketId],
        });
      } catch (err) {
        console.error('Join error:', err);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });
  });
}
