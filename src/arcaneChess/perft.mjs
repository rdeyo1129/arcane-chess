import { GameBoard, PrintBoard } from './board';
import { PrMove } from './io';
import { GenerateMoves, generatePowers } from './movegen';
import { MakeMove, TakeMove } from './makemove';
import { BOOL } from './defs';
import { InCheck } from './board';

let perft_leafNodes;

export function Perft(depth) {
  if (depth === 0) {
    perft_leafNodes++;
    return;
  }

  generatePowers();

  GenerateMoves();

  // should take care of herrings but what about stalemate?
  if (GameBoard.moveList.length === 0 && !InCheck()) {
    // false here meaning don't count the existing herrings being attacked because the capture would be illegal
    // GenerateMoves(false);
  }

  let index;
  let move;

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) === BOOL.FALSE) {
      continue;
    }
    Perft(depth - 1);
    TakeMove();
  }

  return;
}

export function PerftTest(depth) {
  PrintBoard();
  console.log('Starting Test To Depth:' + depth);
  perft_leafNodes = 0;

  // console.log(GameBoard.moveList, GameBoard.moveListStart);

  // debugger; // eslint-disable-line

  let index;
  let move;
  let moveNum = 0;
  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) === BOOL.FALSE) {
      continue;
    }
    moveNum++;
    let cumnodes = perft_leafNodes;
    Perft(depth - 1);
    TakeMove();
    let oldnodes = perft_leafNodes - cumnodes;
    console.log('move:' + moveNum + ' ' + PrMove(move) + ' ' + oldnodes);
  }

  console.log('Test Complete : ' + perft_leafNodes + ' leaf nodes visited');

  return;
}
