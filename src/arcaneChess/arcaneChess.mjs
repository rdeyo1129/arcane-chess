// import _ from "lodash";

// todo

// summons but can wait til after videos?
// summons side effects
// royalty (after summon has taken place)
// entangle (after summon)

// disallow / allow arcana after certain num of moves

// summons swaps

// summons
// from 1 through 8 starting with your first rank
// this needs to be decided before, no customize on this?
// edge case: must be at least 1 empty spot within board / restriction

// herring (overriden by entangle and pinned unit) when dealing with "only move left" edge cases
// if only king is attacking herring then any move is fine

// note maybe remove ability to promote on dyad

// todo arcane controller component
// connect to global state?

// todo edge cases

// if check, no specific dyad or any dyad? Zugzwang?
// if no piece of dyad type, no using that dyad

// so:
// dyads can ONLY be used on quiet moves (shifts, castling and attacks ok, no captures, no promotions, no abilities) or to give checks
// does this take care of all the edge cases?
// not really, what about zugzwang or when a piece type (dyad type) like pawn runs out of moves, or when a piece is pinned or entangled?
// when a pawn runs out of moves and there's only that pawn left, what are some rules to prevent stalemate?

// can I get these edge cases out of the way when I push the button, make a first move,
// then it gathers secondary moves, if there are none, then cancel out the dyad and don't update
// "notification" or breadcrumb here? 2 second timeout?
// this might take care of all theses edge cases, allows for dyads on checks? because we always need an updated legal move for the secondary move
// state and move info / arcana num

// dyad and summon fut sight adj swap can be used to get out of check

// dyad and promotion edge cases?

// disable all but summons dyads when in check?
// when hitting a power button, disable all other buttons
// cancel button when no other click has been made?
// cancel on the second dyad move handler? or on the first? Would need to undo locally before pushing to state / action

// todo suspend arcane
// understanding plys, half plys, history and messages in between them

// import { START_FEN } from "./defs.mjs";
import {
  InitFilesRanksBrd,
  InitHashKeys,
  InitSq120To64,
  InitBoardVars,
} from './main';
import { PrintMoveList } from './io';
import { GenerateMoves, generatePowers } from './movegen';
import {
  GameBoard,
  randomize,
  ParseFen,
  CheckBoard,
  PrintBoard,
  PrintPieceLists,
} from './board';
import { MakeMove, TakeMove } from './makemove';
import { PerftTest } from './perft';

export default function arcaneChess(
  // todo react input
  whiteConfig = {},
  blackConfig = {},
  // fen = 'rnbqkbnr/pppppppp/8/8/8/4h3/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  // 4k3/8/8/K2P3r/8/8/8/8 w - - 0 1
  fen
  // normal starting position
  // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // rnbqkbnr/pppppppp/8/2nRn3/3P4/pp6/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // handicaps
) {
  InitFilesRanksBrd();
  InitHashKeys();
  InitSq120To64();
  InitBoardVars();

  ParseFen(fen);

  // randomize before parse fen
  randomize();

  generatePowers();

  GenerateMoves();

  // PrintMoveList();
  // PrintPieceLists();
  // CheckBoard();

  PrintMoveList();
  // MakeMove(GameBoard.moveList[0]);
  // PrintBoard();
  // CheckBoard();

  // TakeMove();
  // PrintBoard();
  // CheckBoard();

  const activateDyad = (type) => {
    console.log(type);
  };

  return {
    // filesRanksBoard: () => InitFilesRanksBrd(),
    activateDyad: (type) => activateDyad(type),
  };
}
