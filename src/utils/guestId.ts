// src/utils/guestId.ts
import { v4 as uuidv4 } from 'uuid';

export function getOrCreateMultiplayerGuestId(): string {
  let id = sessionStorage.getItem('multiplayerGuestId');
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem('multiplayerGuestId', id);
  }
  return id;
}
