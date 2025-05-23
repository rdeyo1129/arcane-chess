import redis from './index';
import { v4 as uuid } from 'uuid';

const LOBBY_SET = 'lobby:list';

type LobbyGame = {
  gameId: string;
  hostSocketId: string;
  isFull: string;
  isPrivate: string;
  matchType: string;
  createdAt: string;
  joinSocketId?: string;
};

export async function createGame({
  hostSocketId,
  isPrivate = false,
  matchType = 'custom',
}) {
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

  await redis.hset(key, ...Object.entries(gameData).flat());

  await redis.sadd(LOBBY_SET, gameId);
  return gameId;
}

export async function findQuickMatchGame() {
  const allGameIds = await redis.smembers(LOBBY_SET);
  for (const gameId of allGameIds) {
    const game = await redis.hgetall(`lobby:${gameId}`);
    if (game.matchType === 'quickfind' && game.isFull !== 'true') {
      return game;
    }
  }
  return null;
}

export async function joinGame(gameId: string, playerSocketId: string) {
  const key = `lobby:${gameId}`;
  await redis.hset(key, 'isFull', 'true', 'joinSocketId', playerSocketId);
  await redis.srem(LOBBY_SET, gameId);
  return await redis.hgetall(key);
}

export async function listLobbyGames() {
  const allGameIds = await redis.smembers(LOBBY_SET);
  const games: LobbyGame[] = [];

  for (const gameId of allGameIds) {
    const game = (await redis.hgetall(`lobby:${gameId}`)) as LobbyGame;
    if (game.isPrivate !== 'true') games.push(game);
  }

  return games;
}
