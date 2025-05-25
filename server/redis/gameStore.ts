import redis from './index.js';
import { v4 as uuid } from 'uuid';

const LOBBY_SET = 'lobby:list';

export type LobbyGame = {
  gameId: string;
  hostSocketId: string;
  hostId: string;
  isFull: string;
  isPrivate: string;
  matchType: string;
  createdAt: string;
  joinSocketId?: string;
  startFen: string;
  whiteArcana: Record<string, number>;
  blackArcana: Record<string, number>;
  royalties: Record<string, Record<string, number>>;
  preset: string;
};

interface CreateGameOptions {
  hostSocketId: string;
  hostId: string;
  isPrivate?: boolean;
  matchType?: string;
}

export async function createGame({
  hostSocketId,
  hostId,
  isPrivate = false,
  matchType = 'custom',
}: CreateGameOptions): Promise<string> {
  const gameId = uuid();
  const key = `lobby:${gameId}`;

  const gameData = {
    gameId,
    hostSocketId,
    hostId,
    isFull: 'false',
    isPrivate: String(isPrivate),
    matchType,
    createdAt: String(Date.now()),
  };

  // store the full game object
  await redis.hSet(key, gameData);
  await redis.sAdd(LOBBY_SET, gameId);

  return gameId;
}

/**
 * Remove a lobby game completely (used on disconnect)
 */
export async function deleteGame(gameId: string): Promise<void> {
  const key = `lobby:${gameId}`;
  await redis.del(key);
  await redis.sRem(LOBBY_SET, gameId);
}

export async function findQuickMatchGame(): Promise<LobbyGame | null> {
  const allGameIds = await redis.sMembers(LOBBY_SET);
  for (const gameId of allGameIds) {
    const raw = await redis.hGetAll(`lobby:${gameId}`);
    if (raw.matchType === 'quickfind' && raw.isFull !== 'true') {
      return parseLobbyGame(raw);
    }
  }
  return null;
}

export async function joinGame(
  gameId: string,
  playerSocketId: string
): Promise<LobbyGame> {
  const key = `lobby:${gameId}`;
  await redis.hSet(key, {
    isFull: 'true',
    joinSocketId: playerSocketId,
  });
  await redis.sRem(LOBBY_SET, gameId);
  const updatedRaw = await redis.hGetAll(key);
  return parseLobbyGame(updatedRaw);
}

export async function listLobbyGames(): Promise<LobbyGame[]> {
  const allGameIds = await redis.sMembers(LOBBY_SET);
  const games: LobbyGame[] = [];

  for (const gameId of allGameIds) {
    const raw = await redis.hGetAll(`lobby:${gameId}`);
    if (raw.isPrivate !== 'true') {
      games.push(parseLobbyGame(raw));
    }
  }

  return games;
}

/**
 * Convert Redis hash → LobbyGame
 */
function parseLobbyGame(raw: Record<string, string>): LobbyGame {
  return {
    gameId: raw.gameId,
    hostSocketId: raw.hostSocketId,
    hostId: raw.hostId,
    isFull: raw.isFull,
    isPrivate: raw.isPrivate,
    matchType: raw.matchType,
    createdAt: raw.createdAt,
    joinSocketId: raw.joinSocketId,

    // if these keys ever come back missing or empty, fall back to sane defaults
    startFen: raw.startFen || '2QQqq2/8/t6T/t6T/T6t/T6t/8/2qqQQ2 w - - 0 1',
    whiteArcana: raw.whiteArcana ? JSON.parse(raw.whiteArcana) : {},
    blackArcana: raw.blackArcana ? JSON.parse(raw.blackArcana) : {},
    royalties: raw.royalties ? JSON.parse(raw.royalties) : {},
    preset: raw.preset || 'CLEAR',
  };
}
