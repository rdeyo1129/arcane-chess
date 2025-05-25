// src/services/GameService.ts
import { socket } from 'src/lib/socket';

export interface GameMove {
  parsed: number;
  orig?: string;
  dest?: string;
  promo?: number;
  swapType?: string;
  royaltyEpsilon?: number;
  text?: string[];
}

const GameService = {
  // Lobby only cares about lobby:update & lobby:join
  // Everything game-related goes here:

  onStart: (cb: (payload: any) => void) => socket.on('game:start', cb),
  onMove: (cb: (move: GameMove) => void) => socket.on('game:move', cb),
  onEnd: (cb: (data: { winner: string }) => void) => socket.on('game:end', cb),

  sendMove: (gameId: string, move: GameMove) =>
    socket.emit('game:move', { gameId, move }),
  sendResign: (gameId: string, winner: string) =>
    socket.emit('game:resign', { gameId, winner }),
};

export default GameService;
