import { Server } from 'socket.io';
import quickfind from './quickfind.js';
import lobby from './lobby.js';
import gameSession from './gameSession.js';

export default function registerSockets(io: Server) {
  quickfind(io);
  lobby(io);
  gameSession(io);
}
