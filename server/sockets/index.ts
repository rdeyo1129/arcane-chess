import { Server } from 'socket.io';
import quickfind from './quickfind';
import lobby from './lobby';

export default function registerSockets(io: Server) {
  quickfind(io);
  lobby(io);
}
