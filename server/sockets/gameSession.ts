// server/sockets/gameSession.ts
import type { Server, Socket } from 'socket.io';
// Use a **relative** path, not "src/…"
import arcaneChessFactory from '../../src/stacktadium/arcaneChess.mjs';

export default function gameSession(io: Server) {
  const sessions = new Map<string, ReturnType<typeof arcaneChessFactory>>();

  io.on('connection', (socket: Socket) => {
    // 1️⃣ start a fresh game
    socket.on('game:start', (payload) => {
      const { gameId, fen, whiteConfig, blackConfig, royalties, preset } =
        payload;
      const session = arcaneChessFactory();
      session.init();
      session.startGame(fen, whiteConfig, blackConfig, royalties, preset);
      sessions.set(gameId, session);
      io.in(`game:${gameId}`).emit('game:start', payload);
    });

    // 2️⃣ user move → update that one session → broadcast
    socket.on('game:move', ({ gameId, move }) => {
      const session = sessions.get(gameId);
      if (!session) return;
      const { parsed } = session.makeUserMove(
        move.orig,
        move.dest,
        move.promo,
        move.swapType,
        move.royaltyEpsilon
      );
      io.in(`game:${gameId}`).emit('game:move', { parsed });
      // … optional AI‐reply here …
    });

    // 3️⃣ clean up
    socket.on('game:end', ({ gameId }) => {
      sessions.delete(gameId);
      io.in(`game:${gameId}`).emit('game:end');
    });
  });
}
