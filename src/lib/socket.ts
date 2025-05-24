// src/socket.ts
import { io } from 'socket.io-client';
import { getOrCreateMultiplayerGuestId } from 'src/utils/guestId';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';
console.log('Connecting to:', socketUrl);

const guestId = getOrCreateMultiplayerGuestId();

export const socket = io(socketUrl, {
  autoConnect: true,
  // you can send it as part of the auth payload
  auth: { guestId },
  // or if your server reads `socket.handshake.query`:
  // query: { guestId },
});
