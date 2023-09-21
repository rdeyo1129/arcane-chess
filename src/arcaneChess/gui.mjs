import { GameBoard } from './board';
import { MakeMove, TakeMove } from './makemove';
import { NOMOVE, BOOL } from './defs';
import { PrMove } from './io';

export function validGroundMoves() {
  const moveMap = new Map();
  const validMovesReturn = validMoves();

  // moves
  // click button on UI = setCurrentArcane
  // is this for dyads?
  // if (GameBoard.currentArcane & POWERBITS[substr(sumn, 4)]) substring of box notation? {
  for (let move of validMovesReturn) {
    const from = PrMove(move).substring(0, 2);
    const to = PrMove(move).substring(2, 4);
    if (!moveMap.has(from)) {
      moveMap.set(from, []);
    }
    moveMap.get(from).push(to);
  }
  return moveMap;
}

export function validMoves() {
  const moves = [];
  let moveFound = NOMOVE;
  // GenerateMoves();
  for (
    let index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    moveFound = GameBoard.moveList[index];
    if (MakeMove(moveFound) === BOOL.FALSE) {
      continue;
    }
    TakeMove();
    moves.push(moveFound);
  }
  return moves;
}
