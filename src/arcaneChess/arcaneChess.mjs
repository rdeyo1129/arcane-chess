// import _ from "lodash";

// summons
// edge case: must be at least 1 empty spot within board / restriction

// todo edge cases

// if check, no specific dyad or any dyad? Zugzwang?
// if no piece of dyad type, no using that dyad

// so:
// dyads can ONLY be used on quiet moves (shifts, castling and attacks ok, no captures, no promotions, no abilities) or to give checks
// does this take care of all the edge cases?
// not really, what about zugzwang or when a piece type (dyad type) like pawn runs out of moves, or when a piece is pinned or entangled?
// when a pawn runs out of moves and there's only that pawn left, what are some rules to prevent stalemate?

// SEE HERE
// MOST OF THESE EDGE CASES FOR DYAD AND HERRING ARE SOLVED BY EXISTING MOVE EXISTS AND MOVE FILTER FUNCTIONS
// can I get these edge cases out of the way when I push the button, make a first move,
// then it gathers secondary moves, if there are none, then cancel out the dyad and don't update

// EDGE CASE HOW TO HANDLE WHEN A BUTTON CLICK IS NEEDED TO GET OUT OF CHECK IF ITS THE ONLY WAY OUT?
// JUST INCLUDE THIS WHEN CHECKING FOR CHECKS, IF FUT SIGHT EXISTS TOO

// dyad and summon fut sight adj swap can be used to get out of check

// dyad and promotion edge cases?

// disable all but summons dyads when in check?

// when hitting a power button, disable all other buttons

// cancel button when no other click has been made?

// cancel on the second dyad move handler click? or on the first? Would need to undo locally before pushing to state / action

import {
  InitFilesRanksBrd,
  InitHashKeys,
  InitSq120To64,
  InitBoardVars,
} from './main';
import { PrintMoveList } from './io';
import { InitMvvLva, GenerateMoves, generatePowers } from './movegen';
import {
  GameBoard,
  randomize,
  ParseFen,
  CheckBoard,
  PrintBoard,
  PrintPieceLists,
  InCheck,
} from './board';
import { MakeMove, TakeMove } from './makemove';
import { PerftTest } from './perft';
import { validMoves, validGroundMoves } from './gui';
import { SearchPosition, gameSim } from './search.mjs';
import { PrintSqAttacked } from './board.mjs';
import { MakeUserMove, engineMove } from './gui.mjs';
import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import {
  setWhiteArcana,
  setBlackArcana,
  whiteArcaneConfig,
  blackArcaneConfig,
} from './arcaneDefs.mjs';
import { set } from 'lodash';

export default function arcaneChess(
  whiteConfig = {},
  blackConfig = {},
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  auth = {},
  varVars = {}
  // fen = 'n1n5/PPPk4/8/8/8/8/4Kppp/5N1N b - - 0 1'
  // 4k3/8/8/K2P3r/8/8/8/8 w - - 0 1
  // normal starting position
  // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // rnbqkbnr/pppppppp/8/B6h/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // rnbqkbnr/pppppppp/8/7h/5N2/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // rnbqkbnr/pppppppp/8/2nRn2h/3P4/ph6/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // fen = 'n1n5/PPPk4/8/8/8/7N/4Kppp/5N1N w - - 0 1'
  // fen = '3k4/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  // '8/8/8/r2R3K/3h5/8/8/8 w - - 0 1'
  // 8/8/8/r2R3K/3p5/8/8/8 w - - 0 1
  // generate random fen with white king in check
  // fen = '8/4r3/8/8/8/8/PPPP4/4K3 w - - 0 1'

  // handicaps parameter
) {
  InitFilesRanksBrd();
  InitHashKeys();
  InitSq120To64();
  InitBoardVars();
  InitMvvLva();

  // randomize();

  // ParseFen(fen);

  // generatePowers();

  // GenerateMoves();

  // should take care of herrings but what about stalemate?
  // todo assign generate moves with herrings to a variable and check here
  // if (validMoves().length === 0 && !InCheck()) {
  //   GenerateMoves(false);
  //   console.log(validGroundMoves());
  // }

  // PrintBoard();

  // PerftTest(3);

  // SearchPosition(fen);

  // console.log(validGroundMoves());

  // PrintPieceLists();
  // CheckBoard();

  // PrintMoveList();
  // MakeMove(GameBoard.moveList[0]);
  // PrintBoard();
  // CheckBoard();

  // TakeMove();
  // PrintBoard();
  // CheckBoard();

  const activateDyad = (type) => {
    console.log(type);
  };

  const startCreate = (fen) => {
    // ParseFen(fen);
  };

  // todo arcane for the three hint tiers
  const getScoreAndLine = (fen, arcane) => {
    ParseFen(fen);

    generatePowers();

    GenerateMoves();

    SearchPosition(fen);

    // how to update real time
    return Promise.resolve(GameBoard.cleanPV);
  };

  const startGame = (startFen, whiteConfig, blackConfig, varVar) => {
    // this needs to be assigned to something, the fen that gets passed in randomize();

    setWhiteArcana(whiteConfig);
    setBlackArcana(blackConfig);

    if (varVar === '960') {
      randomize(whiteConfig, blackConfig);
    }

    ParseFen(startFen);

    generatePowers();

    GenerateMoves(true, false, true);

    console.log(whiteConfig, blackConfig);

    console.log(GameBoard.whiteArcane);
    console.log(GameBoard.blackArcane);
    console.log(whiteArcaneConfig);
    console.log(blackArcaneConfig);

    // // should take care of herrings but what about stalemate?
    // // todo assign generate moves with herrings to a variable and check here
    // if (validMoves().length === 0 && !InCheck()) {
    //   GenerateMoves(false);
    //   console.log(validGroundMoves());
    // }

    // PrintBoard();

    // PrintSqAttacked();

    // PrintMoveList();

    // PerftTest(3, fen);
    // SearchPosition(fen);
  };

  return {
    // filesRanksBoard: () => InitFilesRanksBrd(),
    activateDyad: (type) => activateDyad(type),
    startGame: (fen, whiteConfig, blackConfig, varVar) =>
      startGame(fen, whiteConfig, blackConfig, varVar),
    startCreate: (fen) => startCreate(fen),
    getScoreAndLine: (fen) => {
      return getScoreAndLine(fen);
      // copilot
      // return {
      //   score: GameBoard.searchHistory[GameBoard.ply],
      //   line: GameBoard.searchKillers[GameBoard.ply],
      // };
    },
    getGroundMoves: () => {
      return validGroundMoves();
    },
    makeUserMove: (orig, dest) => {
      // engineMove;
      return MakeUserMove(orig, dest);
    },
    engineReply: (thinkingTime) => {
      return engineMove(thinkingTime);
      // return new Promise((resolve) => {
      //   setTimeout(function () {
      //     resolve(engineMove());
      //   }, 200);
      // });
    },
    gameSim: (thinkingTime) => {
      return gameSim(thinkingTime);
    },
    changeVarVars: (varVar) => {
      if (varVar === 'NORMAL') {
        console.log('');
      }
    },
  };
}
