import { GameBoard } from './board';
import { PrMove } from './io';
import { GenerateMoves, generatePowers } from './movegen';
import { MakeMove, TakeMove } from './makemove';
import { BOOL } from './defs';

let perft_leafNodes;

export function Perft(depth) {
  if (depth === 0) {
    perft_leafNodes++;
    return;
  }

  generatePowers();

  GenerateMoves(true, false, 'COMP', 'COMP');

  // should take care of herrings but what about stalemate?
  // todo assign generate moves with herrings to a variable and check here
  // if (validMoves().length === 0 && !InCheck() && herrings.length) {
  //   GenerateMoves(false);
  //   console.log(validGroundMoves());
  // }

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
  console.log('Starting Test To Depth:' + depth);
  perft_leafNodes = 0;

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
