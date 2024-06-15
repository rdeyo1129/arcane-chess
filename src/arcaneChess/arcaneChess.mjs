import _ from 'lodash';

// summons
// edge case: must be at least 1 empty spot within board / restriction

// todo edge cases

// if check, no specific dyad or any dyad? Zugzwang?
// if no piece of dyad type, no using that dyad

// so:
// dyads can ONLY be used on quiet moves (shifts, castling and attacks ok, no captures, no promotions, no abilities) an no checks..?
// does this take care of all the edge cases?
// not really, what about zugzwang or when a piece type (dyad type) like pawn runs out of moves, or when a piece is pinned or entangled?
// when a pawn runs out of moves and there's only that pawn left, what are some rules to prevent stalemate?

// SEE HERE
// MOST OF THESE EDGE CASES FOR DYAD AND HERRING ARE SOLVED BY EXISTING MOVE EXISTS AND MOVE FILTER FUNCTIONS
// can I get these edge cases out of the way when I push the button, make a first move,
// then it gathers secondary moves, if there are none, then cancel out the dyad and don't update

// EDGE CASE HOW TO HANDLE WHEN A BUTTON CLICK IS NEEDED TO GET OUT OF CHECK IF ITS THE ONLY WAY OUT?
// JUST INCLUDE THIS WHEN CHECKING FOR CHECKS, IF FUT SIGHT EXISTS TOO

// dyad and summon (futsight, not checkmate) adj swap can be used to get out of check and checkmate

// dyad and promotion edge cases?

// disable all but summons, swaps dyads when in check?

// when hitting a power button, disable all other buttons

// cancel button when no other click has been made?

// cancel on the second dyad move handler click? or on the first? Would need to undo locally before pushing to state / action

import {
  InitFilesRanksBrd,
  InitHashKeys,
  InitSq120To64,
  InitBoardVars,
} from './main';
import { InitMvvLva, GenerateMoves, generatePowers } from './movegen';
import {
  GameBoard,
  randomize,
  ParseFen,
  outputFenOfCurrentPosition,
} from './board';
import {
  validGroundMoves,
  validSummonMoves,
  MakeUserMove,
  PreSearch,
  engineSuggestion,
} from './gui';
import { SearchPosition, gameSim } from './search.mjs';

import {
  whiteArcaneConfig,
  blackArcaneConfig,
  setWhiteArcana,
  setBlackArcana,
} from './arcaneDefs.mjs';
import { COLOURS, PIECES, prettyToSquare } from './defs.mjs';
import { TakeMove } from './makemove.mjs';

export default function arcaneChess() {
  // whiteConfig = {},
  // blackConfig = {},
  // fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  // auth = {},
  // preset = {}
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
  InitFilesRanksBrd();
  InitHashKeys();
  InitSq120To64();
  InitBoardVars();
  InitMvvLva();

  // todo arcane for the three hint tiers
  const getScoreAndLine = (fen) => {
    // arcane param needed?
    ParseFen(fen);

    generatePowers();

    GenerateMoves();

    SearchPosition(fen);

    // how to update real time
    return Promise.resolve(GameBoard.cleanPV);
  };

  const startGame = (
    startFen,
    whiteConfig,
    blackConfig,
    royalties,
    preset = 'CLEAR'
  ) => {
    setWhiteArcana(whiteConfig);
    setBlackArcana(blackConfig);

    _.forEach(royalties, (value, key) => {
      GameBoard[key] = {};
      _.forEach(value, (v, k) => {
        const square = prettyToSquare(k);
        GameBoard[key][square] = v;
      });
    });

    GameBoard.preset = preset;

    if (preset === 'XCHECK') GameBoard.xCheckLimit[COLOURS.WHITE] = 3;
    if (preset === 'XCHECK') GameBoard.xCheckLimit[COLOURS.BLACK] = 3;
    if (preset === 'CRAZYHOUSE') GameBoard.crazyHouse[COLOURS.WHITE] = true;
    if (preset === 'CRAZYHOUSE') GameBoard.crazyHouse[COLOURS.BLACK] = true;
    if (preset === 'THRONE') {
      GameBoard.kohSquares.push(54, 55, 64, 65);
    }
    if (preset === 'DELIVERANCE') {
      GameBoard.kohSquares.push(91, 92, 93, 94, 95, 96, 97, 98);
    }

    ParseFen(startFen);

    generatePowers();

    GenerateMoves(true, false, 'COMP', '');

    // // should take care of herrings but what about stalemate?
    // // todo assign generate moves with herrings to a variable and check here
    // if (validMoves().length === 0 && !InCheck()) {
    //   GenerateMoves(false);
    //   console.log(validGroundMoves());
    // }

    // SearchPosition(fen);
  };

  const generatePlayableOptions = () => {
    // todo herring, forced ep, and find all working instances and replace with this
    ParseFen(outputFenOfCurrentPosition());
    generatePowers();
    GenerateMoves(true, false, 'COMP', 'COMP');
  };

  return {
    // filesRanksBoard: () => InitFilesRanksBrd(),
    // activateDyad: (type) => activateDyad(type),
    startGame: (fen, whiteConfig, blackConfig, royalties, preset) =>
      startGame(fen, whiteConfig, blackConfig, royalties, preset),
    randomize: (whiteConfig, blackConfig) =>
      randomize(whiteConfig, blackConfig),
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
    getSummonMoves: (piece) => {
      return validSummonMoves(piece);
    },
    getSwapMoves: (swapType) => {
      return validGroundMoves('', swapType);
    },
    makeUserMove: (
      orig,
      dest,
      pieceEpsilon = PIECES.EMPTY,
      swapType = '',
      royaltyEpsilon = 0
    ) => {
      return MakeUserMove(orig, dest, pieceEpsilon, swapType, royaltyEpsilon);
    },
    engineReply: async (thinkingTime, depth = 4) => {
      return await PreSearch(thinkingTime, depth);
    },
    engineSuggestion: async (thinkingTime, playerColor, level) => {
      const playerArcana =
        playerColor === 'white' ? whiteArcaneConfig : blackArcaneConfig;
      if (level === 1) {
        playerArcana.modsIMP -= 1;
      }
      if (level === 2) {
        playerArcana.modsORA -= 1;
      }
      if (level === 3) {
        playerArcana.modsTEM -= 1;
      }
      return await engineSuggestion(thinkingTime);
    },
    takeBackMove: (halfPly, side) => {
      if (side === 'white') {
        whiteArcaneConfig.modsFUT -= 1;
      }
      if (side === 'black') {
        blackArcaneConfig.modsFUT -= 1;
      }
      _.times(halfPly, () => {
        TakeMove();
      });
    },
    generatePlayableOptions: () => {
      return generatePlayableOptions();
    },
    addRoyalty: (type, sq, turns) => {
      GameBoard[type] = { [prettyToSquare(sq)]: turns };
    },
    getRoyalties: () => {
      return {
        royaltyQ: GameBoard.royaltyQ,
        royaltyT: GameBoard.royaltyT,
        royaltyM: GameBoard.royaltyM,
        royaltyV: GameBoard.royaltyV,
        royaltyE: GameBoard.royaltyE,
      };
    },
    clearRoyalties: () => {
      GameBoard.royaltyQ = {};
      GameBoard.royaltyT = {};
      GameBoard.royaltyM = {};
      GameBoard.royaltyV = {};
      GameBoard.royaltyE = {};
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
