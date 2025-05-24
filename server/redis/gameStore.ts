import redis from './index.js';
import { v4 as uuid } from 'uuid';

const LOBBY_SET = 'lobby:list';

export type LobbyGame = {
  gameId: string;
  hostSocketId: string;
  isFull: string;
  isPrivate: string;
  matchType: string;
  createdAt: string;
  joinSocketId?: string;
};

interface CreateGameOptions {
  hostSocketId: string;
  isPrivate?: boolean;
  matchType?: string;
}

export async function createGame({
  hostSocketId,
  isPrivate = false,
  matchType = 'custom',
}: CreateGameOptions): Promise<string> {
  const gameId = uuid();
  const key = `lobby:${gameId}`;

  const gameData = {
    gameId,
    hostSocketId,
    isFull: 'false',
    isPrivate: String(isPrivate),
    matchType,
    createdAt: String(Date.now()),
  };

  // v4+ redis client uses camelCase methods
  await redis.hSet(key, gameData);
  await redis.sAdd(LOBBY_SET, gameId);

  return gameId;
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
    const game = parseLobbyGame(raw);
    if (game.isPrivate !== 'true') {
      games.push(game);
    }
  }

  return games;
}

// Helper to convert Redis string map into LobbyGame
function parseLobbyGame(raw: Record<string, string>): LobbyGame {
  return {
    gameId: raw.gameId,
    hostSocketId: raw.hostSocketId,
    isFull: raw.isFull,
    isPrivate: raw.isPrivate,
    matchType: raw.matchType,
    createdAt: raw.createdAt,
    joinSocketId: raw.joinSocketId,
  };
}
