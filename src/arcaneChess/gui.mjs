import { GameBoard } from './board';
import { GenerateMoves, MoveExists } from './movegen';
import { SearchController, SearchPosition } from './search';
import { MakeMove, TakeMove } from './makemove';
import { NOMOVE, BOOL, prettyToSquare, GameController } from './defs';
import { PrMove, PrSq, ParseMove } from './io';
import { PrintBoard } from './board.mjs';

export function validGroundMoves() {
  const moveMap = new Map();
  const validMovesReturn = validMoves();

  // moves
  // click button on UI = setCurrentArcane
  // is this for dyads?
  // if (GameBoard.currentArcane & POWERBITS[substr(sumn, 4)]) substring of box notation? {
  for (let move of validMovesReturn) {
    // todo, need to split to and from sqaures from things like x and &
    const from = PrMove(move).substring(1, 3);
    const to = PrMove(move).substring(3, 5);
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
  GenerateMoves();
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
  // console.log(moves);
  return moves;
}

export function MakeUserMove(orig, dest) {
  // if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
  console.log(
    'User Move:' + PrSq(prettyToSquare(orig)) + PrSq(prettyToSquare(dest))
  );

  var parsed = ParseMove(orig, dest);
  MakeMove(parsed);

  if (parsed !== NOMOVE) {
    // PrintBoard();
    // MoveGUIPiece(parfsed);
    // CheckAndSet();
    // setTimeout(function () {
    //   return engineMove();
    // }, 200);
  }

  // DeSelectSq(UserMove.from);
  // DeSelectSq(UserMove.to);

  // UserMove.from = SQUARES.NO_SQ;
  // UserMove.to = SQUARES.NO_SQ;
  // }
}

// function PreSearch() {
//   if (GameController.GameOver == BOOL.FALSE) {
//     SearchController.thinking = BOOL.TRUE;
//   }
// }

export function engineMove() {
  // SearchController.depth = MAXDEPTH;
  // var t = $.now();
  // var tt = $('#ThinkTimeChoice').val();

  // SearchController.time = parseInt(tt) * 1000;
  const { bestMove, bestScore, line } = SearchPosition();
  MakeMove(bestMove);
  return bestMove;
  // MoveGUIPiece(SearchController.best);
  // CheckAndSet();
}
