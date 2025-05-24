import { Server, Socket } from 'socket.io';
import * as gameStore from '../redis/gameStore.js';

export default function quickfind(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('quickfind', async () => {
      const match = await gameStore.findQuickMatchGame();
      if (match) {
        const game = await gameStore.joinGame(match.gameId, socket.id);
        const room = `game:${game.gameId}`;
        socket.join(room);
        io.sockets.sockets.get(game.hostSocketId)?.join(room);
        io.to(room).emit('game:start', {
          room,
          players: [socket.id, game.hostSocketId],
        });
      } else {
        const gameId = await gameStore.createGame({
          hostSocketId: socket.id,
          hostId: socket.handshake.auth.guestId as string,
          matchType: 'quickfind',
        });
        socket.emit('waitingForMatch', { gameId });
      }
    });
  });
}
