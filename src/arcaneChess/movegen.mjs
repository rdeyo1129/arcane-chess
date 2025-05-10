import _ from 'lodash';

// import all vars and functions from arcanechess folder that are not defined
import {
  GameBoard,
  SqAttacked,
  SQOFFBOARD,
  MFLAGCA,
  MFLAGPS,
  MFLAGEP,
  MFLAGSHFT,
  MFLAGSUMN,
  MFLAGCNSM,
  MFLAGSWAP,
  CAPTURED,
  FROMSQ,
  TOSQ,
  PROMOTED,
} from './board';
import { whiteArcaneConfig, blackArcaneConfig, POWERBIT } from './arcaneDefs';
import {
  COLOURS,
  BOOL,
  CASTLEBIT,
  PIECES,
  RANKS,
  RanksBrd,
  SQUARES,
  PieceCol,
  PieceKing,
  LoopNonSlideDyad,
  LoopNonSlidePce,
  LoopSlideDyad,
  LoopSlidePce,
  LoopNonSlideIndex,
  LoopSlideIndex,
  loopSummon,
  loopSummonFlag,
  loopSummonIndex,
  DirNum,
  PceDir,
  RkDir,
  BiDir,
  KiDir,
  KnDir,
  PCEINDEX,
  NOMOVE,
  MAXDEPTH,
  BRD_SQ_NUM,
  ARCANE_BIT_VALUES,
  royaltySliders,
  royaltyHoppers,
  royaltySliderMap,
  royaltyHopperMap,
  RtyChar,
  LoopPcePrime,
  LoopPcePrimeSymbols,
  LoopPcePrimeIndex,
} from './defs';
import { MakeMove, TakeMove } from './makemove';
import { validMoves } from './gui.mjs';

const MvvLvaValue = [
  0, 100, 500, 600, 700, 1200, 1400, 100, 500, 600, 700, 1200, 1400, 0, 900,
  200, 1100, 1000, 1300, 900, 200, 1100, 1000, 1300, 400, 300, 400, 300, 800,
  800,
];
const MvvLvaScores = new Array(30 * 30);
export function InitMvvLva() {
  let Attacker;
  let Victim;

  for (Attacker = PIECES.wP; Attacker <= PIECES.bW; Attacker++) {
    for (Victim = PIECES.wP; Victim <= PIECES.bW; Victim++) {
      MvvLvaScores[Victim * 30 + Attacker] =
        MvvLvaValue[Victim] + 14 - MvvLvaValue[Attacker] / 100;
    }
  }
}

export function MoveExists(move) {
  generatePlayableOptions(true, false, 'COMP', 'COMP');

  let index;
  let moveFound = NOMOVE;
  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    moveFound = GameBoard.moveList[index];
    if (MakeMove(moveFound) === BOOL.FALSE) {
      continue;
    }
    TakeMove();
    if (move === moveFound) {
      return BOOL.TRUE;
    }
  }
  return BOOL.FALSE;
}

export function MOVE(from, to, captured, promoted, flag) {
  return from | (to << 7) | (captured << 14) | (promoted << 21) | flag;
}

export function AddCaptureMove(move, consume = false, capturesOnly = false) {
  const targetSquare = TOSQ(move);
  const capturedPiece = GameBoard.pieces[targetSquare];
  if (capturedPiece === PIECES.wK || capturedPiece === PIECES.bK) {
    return;
  }

  // gluttony
  if (
    GameBoard.dyad > 0 &&
    ((GameBoard.side === COLOURS.WHITE && !(GameBoard.whiteArcane[4] & 64)) ||
      (GameBoard.side === COLOURS.BLACK && !(GameBoard.blackArcane[4] & 64)))
  )
    return;
  // sixfold silk
  if (
    GameBoard.royaltyE[TOSQ(move)] > 0 &&
    ((GameBoard.side === COLOURS.WHITE && !(GameBoard.whiteArcane[4] & 8)) ||
      (GameBoard.side === COLOURS.BLACK && !(GameBoard.blackArcane[4] & 8)))
  )
    return;

  if ((capturesOnly && !consume) || !capturesOnly) {
    if (move & MFLAGSWAP) {
      GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
      GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
    } else if (GameBoard.suspend <= 0) {
      GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
      if (consume) {
        GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] =
          MvvLvaScores[CAPTURED(move) * 30 + GameBoard.pieces[FROMSQ(move)]] +
          1000000;
      } else {
        GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] =
          MvvLvaScores[CAPTURED(move) * 30 + GameBoard.pieces[FROMSQ(move)]] +
          1000000;
      }
    }
  }
}

export function AddQuietMove(move, capturesOnly) {
  // if (move & MFLAGSWAP) return;
  if (!capturesOnly) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;
    if (move === GameBoard.searchKillers[GameBoard.ply]) {
      GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 900000;
    } else if (move === GameBoard.searchKillers[GameBoard.ply + MAXDEPTH]) {
      GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 800000;
    } else {
      GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] =
        GameBoard.searchHistory[
          GameBoard.pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move)
        ];
    }
    GameBoard.moveListStart[GameBoard.ply + 1]++;
  }
}

export function AddEnPassantMove(move) {
  // if (move & MFLAGSWAP) return;
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] =
    105 + 1000000;
  GameBoard.moveListStart[GameBoard.ply + 1]++;
}

export function addSummonMove(move) {
  // if (move & MFLAGSWAP) return;
  // whiteArcaneConfig[
  //   `sumn${pieceEpsilon > 27 || pieceEpsilon === ARCANE_BIT_VALUES.RV ? 'R' : ''}${PceChar.split('')[
  //     pieceEpsilon
  //   ].toUpperCase()}`
  // ]
  // if (
  //   // [GameBoard[
  //   //   `${GameBoard.side === COLOURS.WHITE ? 'white' : 'black'}Arcane`
  //   // ][3] === POWERBIT[`sumn${PceChar.split('')[PROMOTED(move)]}`]
  //   (` ${GameBoard.side === COLOURS.WHITE ? 'white' : 'black'}ArcaneConfig`)[] ===
  // ) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;

  // todo for chessground translation
  // GameBoard.summonList.push(move);

  if (move === GameBoard.searchKillers[GameBoard.ply]) {
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 900000;
  } else if (move === GameBoard.searchKillers[GameBoard.ply + MAXDEPTH]) {
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 800000;
  } else {
    // todo update to treat like pieces on that square
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;
    // MvvLvaValue[summonPce] + 1000000;
  }
  GameBoard.moveListStart[GameBoard.ply + 1]++;
  // }
}

export function addOfferingMove(move) {
  if (PROMOTED(move) === 0) return;
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;

  if (move === GameBoard.searchKillers[GameBoard.ply]) {
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 900000;
  } else if (move === GameBoard.searchKillers[GameBoard.ply + MAXDEPTH]) {
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 800000;
  } else {
    // todo update to treat like pieces on that square
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;
    // MvvLvaValue[summonPce] + 1000000;
  }
  GameBoard.moveListStart[GameBoard.ply + 1]++;
}

export function AddWhitePawnCaptureMove(from, to, cap, consume, capturesOnly) {
  if (GameBoard.whiteArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_7) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wQ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wT, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wM, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wR, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wB, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wN, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wZ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wU, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wS, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wW, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
  }
  if (RanksBrd[to] === RANKS.RANK_8) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wQ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wT, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wM, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wR, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wB, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wZ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wU, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wN, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wS, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wW, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
  } else {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.EMPTY, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
  }
}

export function AddBlackPawnCaptureMove(from, to, cap, consume, capturesOnly) {
  if (GameBoard.blackArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_2) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bQ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bT, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bM, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bR, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bB, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bN, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bZ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bU, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bS, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bW, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
  }
  if (RanksBrd[to] === RANKS.RANK_1) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bQ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bT, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bM, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bR, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bB, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bZ, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bU, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bN, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bS, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bW, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
  } else {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.EMPTY, consume ? MFLAGCNSM : 0),
      consume,
      capturesOnly
    );
  }
}

export function AddWhitePawnQuietMove(from, to, flag, capturesOnly) {
  if (GameBoard.whiteArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_7) {
    if (GameBoard.suspend > 0) return;
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wT, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wM, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wS, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wW, flag), capturesOnly);
  }
  if (RanksBrd[to] === RANKS.RANK_8) {
    if (GameBoard.suspend > 0) return;
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wT, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wM, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wS, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wW, flag), capturesOnly);
  } else {
    AddQuietMove(
      MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, flag),
      capturesOnly
    );
  }
}

export function AddBlackPawnQuietMove(from, to, flag, capturesOnly) {
  if (GameBoard.blackArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_2) {
    if (GameBoard.suspend > 0) return;
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bT, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bM, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bS, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bW, flag), capturesOnly);
  }
  if (RanksBrd[to] === RANKS.RANK_1) {
    if (GameBoard.suspend > 0) return;
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bT, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bM, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bS, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bW, flag), capturesOnly);
  } else {
    AddQuietMove(
      MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, flag),
      capturesOnly
    );
  }
}

export const generatePlayableOptions = (
  forcedMoves,
  capturesOnly = false,
  type = '',
  type2 = '',
  userSummonPceRty = 0
) => {
  validMoves(type, type2, userSummonPceRty, capturesOnly);
};

// get binary representation of powers that are non-zero for the current player
export const generatePowers = () => {
  if (GameBoard.side === COLOURS.WHITE) {
    let powerBits = [0, 0, 0, 0, 0, 0];
    const powerTypes = {
      dyad: 0,
      sumn: 0,
      shft: 0,
      swap: 0,
      mods: 0,
      offr: 0,
    };

    // todo: this function needs to be generated on click on at least swap so piece movements like captures or other edge cases don't overlap

    _.forEach(whiteArcaneConfig, (value, key) => {
      const powerName = key.substring(0, 4);
      if (whiteArcaneConfig[key] > 0 || whiteArcaneConfig[key] === 'true') {
        powerTypes[powerName] |= POWERBIT[key];
      }
    });

    powerBits[0] |= powerTypes.dyad;
    powerBits[1] |= powerTypes.shft;
    powerBits[2] |= powerTypes.swap;
    powerBits[3] |= powerTypes.sumn;
    powerBits[4] |= powerTypes.mods;
    powerBits[5] |= powerTypes.offr;

    GameBoard.whiteArcane = powerBits;

    return powerBits;
  } else {
    let powerBits = [0, 0, 0, 0, 0, 0];
    const powerTypes = {
      dyad: 0,
      sumn: 0,
      shft: 0,
      swap: 0,
      mods: 0,
      offr: 0,
    };

    _.forEach(blackArcaneConfig, (value, key) => {
      const powerName = key.substring(0, 4);
      if (blackArcaneConfig[key] > 0 || blackArcaneConfig[key] === 'true') {
        powerTypes[powerName] |= POWERBIT[key];
      }
    });

    powerBits[0] |= powerTypes.dyad;
    powerBits[1] |= powerTypes.shft;
    powerBits[2] |= powerTypes.swap;
    powerBits[3] |= powerTypes.sumn;
    powerBits[4] |= powerTypes.mods;
    powerBits[5] |= powerTypes.offr;

    GameBoard.blackArcane = powerBits;

    return powerBits;
  }
};

export let herrings = [];
export let forcedEpAvailable;

export const getHerrings = (color) => {
  const herringsArr = [];
  if (color === COLOURS.BLACK) {
    GameBoard.pieces.forEach((piece, index) => {
      if (piece === 15) {
        herringsArr.push(index);
      }
    });
  }
  if (color === COLOURS.WHITE) {
    GameBoard.pieces.forEach((piece, index) => {
      if (piece === 20) {
        herringsArr.push(index);
      }
    });
  }
  return herringsArr;
};

export const whiteTeleports = [
  21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48,
];

export const blackTeleports = [
  71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88, 91, 92, 93,
  94, 95, 96, 97, 98,
];

export function GenerateMoves(
  forcedMoves = true,
  capturesOnly = false,
  type = '',
  type2 = '',
  userSummonPceRty = 0
) {
  GameBoard.moveListStart[GameBoard.ply + 1] =
    GameBoard.moveListStart[GameBoard.ply];

  let index;
  let pceType;
  let pceNum;
  let sq;
  // let sqP;
  let pceIndex = 0;
  let pce;
  let t_sq;
  let dir;
  let dyad;

  const herringArray = getHerrings(GameBoard.side);

  if (forcedMoves) {
    const herringsAttacked = () => {
      const tempHerrings = [];
      _.forEach(herringArray, (herringSq) => {
        if (SqAttacked(herringSq, GameBoard.side)) {
          tempHerrings.push(herringSq);
        }
      });
      return tempHerrings;
    };

    herrings = herringsAttacked();
  } else {
    herrings = [];
  }

  const activeWhiteForcedEpCapture =
    forcedMoves &&
    GameBoard.side === COLOURS.WHITE &&
    GameBoard.blackArcane[4] & 32768 &&
    GameBoard.suspend <= 0 &&
    (GameBoard.pieces[GameBoard.enPas - 9] === PIECES.wP ||
      GameBoard.pieces[GameBoard.enPas - 11] === PIECES.wP);
  const activeBlackForcedEpCapture =
    forcedMoves &&
    GameBoard.side === COLOURS.BLACK &&
    GameBoard.whiteArcane[4] & 32768 &&
    GameBoard.suspend <= 0 &&
    (GameBoard.pieces[GameBoard.enPas + 9] === PIECES.bP ||
      GameBoard.pieces[GameBoard.enPas + 11] === PIECES.bP);

  forcedEpAvailable = activeWhiteForcedEpCapture || activeBlackForcedEpCapture;

  const NZUBRMTQSWSQS = [[], []];

  // todo note does swap override entangle and suspend? I think so maybe no entangle though

  if (!activeWhiteForcedEpCapture || !activeBlackForcedEpCapture) {
    // SWAP ADJACENT 4
    for (let sq = 21; sq <= 98; sq++) {
      if (GameBoard.pieces[sq] === PIECES.EMPTY) {
        continue;
      }
      if (SQOFFBOARD(sq) === BOOL.TRUE) {
        continue;
      }
      if (PieceKing[GameBoard.pieces[sq]] === BOOL.TRUE) {
        continue;
      }
      if (herrings.length) {
        break;
      }
      if (type2 === 'ADJ' || type2 === 'COMP') {
        for (let i = 0; i < 4; i++) {
          dir = RkDir[i];
          t_sq = sq + dir;
          pce = GameBoard.pieces[t_sq];

          if (PieceKing[GameBoard.pieces[t_sq]] === BOOL.TRUE) {
            continue;
          }

          // no swapping into promotion
          if (
            (GameBoard.pieces[sq] === PIECES.wP &&
              GameBoard.whiteArcane[4] & 16 &&
              RanksBrd[t_sq] === RANKS.RANK_7) ||
            (pce === PIECES.wP &&
              GameBoard.whiteArcane[4] & 16 &&
              RanksBrd[sq] === RANKS.RANK_7) ||
            (GameBoard.pieces[sq] === PIECES.wP &&
              RanksBrd[t_sq] === RANKS.RANK_8) ||
            (pce === PIECES.wP && RanksBrd[sq] === RANKS.RANK_8)
          ) {
            continue;
          }
          if (
            (GameBoard.pieces[sq] === PIECES.bP &&
              GameBoard.blackArcane[4] & 16 &&
              RanksBrd[t_sq] === RANKS.RANK_2) ||
            (pce === PIECES.bP &&
              GameBoard.blackArcane[4] & 16 &&
              RanksBrd[sq] === RANKS.RANK_2) ||
            (GameBoard.pieces[sq] === PIECES.bP &&
              RanksBrd[t_sq] === RANKS.RANK_1) ||
            (pce === PIECES.bP && RanksBrd[sq] === RANKS.RANK_1)
          ) {
            continue;
          }

          if (GameBoard.pieces[sq] === GameBoard.pieces[t_sq]) {
            continue;
          }

          if (
            SQOFFBOARD(t_sq) === BOOL.FALSE &&
            pce !== PIECES.EMPTY &&
            GameBoard.pieces[sq] !== PIECES.EMPTY &&
            GameBoard.side === COLOURS.WHITE &&
            GameBoard.whiteArcane[2] & 2
          ) {
            AddCaptureMove(
              MOVE(
                sq,
                t_sq,
                GameBoard.pieces[t_sq],
                ARCANE_BIT_VALUES.ADJ,
                MFLAGSWAP
              ),
              false,
              capturesOnly
            );
          }
          if (
            SQOFFBOARD(t_sq) === BOOL.FALSE &&
            pce !== PIECES.EMPTY &&
            GameBoard.pieces[sq] !== PIECES.EMPTY &&
            GameBoard.side === COLOURS.BLACK &&
            GameBoard.blackArcane[2] & 2
          ) {
            AddCaptureMove(
              MOVE(
                sq,
                t_sq,
                GameBoard.pieces[t_sq],
                ARCANE_BIT_VALUES.ADJ,
                MFLAGSWAP
              ),
              false,
              capturesOnly
            );
          }
        }
      }
      if (
        PieceCol[GameBoard.pieces[sq]] === COLOURS.WHITE &&
        (GameBoard.pieces[sq] === PIECES.wN ||
          GameBoard.pieces[sq] === PIECES.wZ ||
          GameBoard.pieces[sq] === PIECES.wU ||
          GameBoard.pieces[sq] === PIECES.wB ||
          GameBoard.pieces[sq] === PIECES.wR ||
          GameBoard.pieces[sq] === PIECES.wM ||
          GameBoard.pieces[sq] === PIECES.wT ||
          GameBoard.pieces[sq] === PIECES.wQ ||
          GameBoard.pieces[sq] === PIECES.wS ||
          GameBoard.pieces[sq] === PIECES.wW)
      ) {
        NZUBRMTQSWSQS[COLOURS.WHITE].push(sq);
      }
      if (
        PieceCol[GameBoard.pieces[sq]] === COLOURS.BLACK &&
        (GameBoard.pieces[sq] === PIECES.bN ||
          GameBoard.pieces[sq] === PIECES.bZ ||
          GameBoard.pieces[sq] === PIECES.bU ||
          GameBoard.pieces[sq] === PIECES.bB ||
          GameBoard.pieces[sq] === PIECES.bR ||
          GameBoard.pieces[sq] === PIECES.bM ||
          GameBoard.pieces[sq] === PIECES.bT ||
          GameBoard.pieces[sq] === PIECES.bQ ||
          GameBoard.pieces[sq] === PIECES.bS ||
          GameBoard.pieces[sq] === PIECES.bW)
      ) {
        NZUBRMTQSWSQS[COLOURS.BLACK].push(sq);
      }
    }

    // SWAP DEP 2
    if (!herrings.length && (type2 === 'DEP' || type2 === 'COMP')) {
      for (let i = 0; i < NZUBRMTQSWSQS[GameBoard.side].length; i++) {
        for (let j = 0; j < NZUBRMTQSWSQS[GameBoard.side].length; j++) {
          if (
            i === j ||
            GameBoard.pieces[NZUBRMTQSWSQS[GameBoard.side][i]] ===
              GameBoard.pieces[NZUBRMTQSWSQS[GameBoard.side][j]]
          ) {
            continue;
          }
          if (
            GameBoard.side === COLOURS.WHITE &&
            GameBoard.whiteArcane[2] & 1 &&
            !herrings.length
          ) {
            AddCaptureMove(
              MOVE(
                NZUBRMTQSWSQS[COLOURS.WHITE][i],
                NZUBRMTQSWSQS[COLOURS.WHITE][j],
                GameBoard.pieces[NZUBRMTQSWSQS[COLOURS.WHITE][j]],
                ARCANE_BIT_VALUES.DEP,
                MFLAGSWAP
              ),
              false,
              capturesOnly
            );
          }
          if (
            GameBoard.side === COLOURS.BLACK &&
            GameBoard.blackArcane[2] & 1 &&
            !herrings.length
          ) {
            AddCaptureMove(
              MOVE(
                NZUBRMTQSWSQS[COLOURS.BLACK][i],
                NZUBRMTQSWSQS[COLOURS.BLACK][j],
                GameBoard.pieces[NZUBRMTQSWSQS[COLOURS.BLACK][j]],
                ARCANE_BIT_VALUES.DEP,
                MFLAGSWAP
              ),
              false,
              capturesOnly
            );
          }
        }
      }
    }

    if (type2 === 'ADJ' || type2 === 'DEP') return;

    if (!herrings.length && (type2 === 'TELEPORT' || type2 === 'COMP')) {
      if (
        (GameBoard.side === COLOURS.WHITE && GameBoard.whiteArcane[1] & 16) ||
        (GameBoard.side === COLOURS.BLACK && GameBoard.blackArcane[1] & 16)
      ) {
        const teleportSquares =
          GameBoard.side === COLOURS.WHITE ? whiteTeleports : blackTeleports;

        for (let pce = PIECES.wP; pce <= PIECES.bK; pce++) {
          if (PieceCol[pce] !== GameBoard.side) continue;

          for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++) {
            const sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
            teleportSquares.forEach((toSq) => {
              if (GameBoard.pieces[toSq] === PIECES.EMPTY) {
                const promotionPiece =
                  GameBoard.side === COLOURS.WHITE ? PIECES.wT : PIECES.bT;
                AddQuietMove(
                  MOVE(sq, toSq, PIECES.EMPTY, promotionPiece, MFLAGSHFT),
                  capturesOnly
                );
              }
            });
          }
        }
        return;
      }
    }

    if (type2 === 'TELEPORT') return;

    // OFFERINGS
    let offeringIndex = LoopPcePrimeIndex[GameBoard.side];
    let offeringPce = LoopPcePrime[offeringIndex];
    let offeringSymbol = LoopPcePrimeSymbols[offeringIndex++];

    if (!herrings.length && (type === 'OFFERING' || type === 'COMP')) {
      while (offeringPce !== 0) {
        let offeringArcanaSide =
          GameBoard.side === COLOURS.WHITE
            ? GameBoard.whiteArcane[5]
            : GameBoard.blackArcane[5];

        let pceType = offeringPce;

        for (let pceNum = 0; pceNum < GameBoard.pceNum[offeringPce]; pceNum++) {
          let sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
          if (PieceCol[offeringPce] === GameBoard.side) {
            // pawn for herring
            if (
              offeringArcanaSide & 1 &&
              ('H' === userSummonPceRty || type !== 'OFFERING')
            ) {
              if (offeringSymbol === 'P') {
                addOfferingMove(MOVE(sq, 0, offeringPce, 1, 0));
              }
            }
            // mystic for sliders
            if (
              offeringArcanaSide & 2 &&
              (('S' === userSummonPceRty && type === 'OFFERING') ||
                type !== 'OFFERING')
            ) {
              if (offeringSymbol === 'M') {
                addOfferingMove(MOVE(sq, 0, offeringPce, 2, 0));
              }
            }
            // templar queen for equus family
            if (
              offeringArcanaSide & 4 &&
              (('M' === userSummonPceRty && type === 'OFFERING') ||
                type !== 'OFFERING')
            ) {
              if (offeringSymbol === 'Q' || offeringSymbol === 'T') {
                addOfferingMove(MOVE(sq, 0, offeringPce, 3, 0));
              }
            }
            // rook for bishop
            if (
              offeringArcanaSide & 8 &&
              (('E' === userSummonPceRty && type === 'OFFERING') ||
                type !== 'OFFERING')
            ) {
              if (offeringSymbol === 'R') {
                addOfferingMove(MOVE(sq, 0, offeringPce, 4, 0));
              }
            }
            // quuen templar for mystic
            if (
              offeringArcanaSide & 16 &&
              (('R' === userSummonPceRty && type === 'OFFERING') ||
                type !== 'OFFERING')
            ) {
              if (offeringSymbol === 'Q' || offeringSymbol === 'T') {
                addOfferingMove(MOVE(sq, 0, offeringPce, 8, 0));
              }
            }
            // chameleon
            if (
              offeringArcanaSide & 32 &&
              (('C' === userSummonPceRty && type === 'OFFERING') ||
                type !== 'OFFERING')
            ) {
              if (
                offeringSymbol === 'B' ||
                offeringSymbol === 'N' ||
                offeringSymbol === 'Z' ||
                offeringSymbol === 'U'
              ) {
                addOfferingMove(
                  MOVE(sq, 0, offeringPce, _.sample([4, 5, 6, 7]), 0)
                );
              }
            }
            // any
            if (
              offeringArcanaSide & 64 &&
              (('A' === userSummonPceRty && type === 'OFFERING') ||
                type !== 'OFFERING')
            ) {
              addOfferingMove(MOVE(sq, 0, offeringPce, 9, 0));
            }
          }
        }
        offeringPce = LoopPcePrime[offeringIndex];
        offeringSymbol = LoopPcePrimeSymbols[offeringIndex++];
      }
    }

    if (type === 'OFFERING') return;

    // SUMMONS
    let summonIndex = loopSummonIndex[GameBoard.side];
    let summonPce = loopSummon[summonIndex];
    let summonFlag = loopSummonFlag[summonIndex++];

    const whiteLimit =
      100 - 10 * (8 - (GameBoard.whiteArcane[4] & 4096 ? 8 : 5));
    const blackLimit =
      20 + 10 * (8 - (GameBoard.blackArcane[4] & 4096 ? 8 : 5));

    GameBoard.summonRankLimits[0] = whiteLimit;
    GameBoard.summonRankLimits[1] = blackLimit;

    // todo remove to allow blocking with pieces or royalty or not?
    if (!herrings.length) {
      // todo remove parent conditional with herring check because sumnE can block from a piece attacking herring
      const royaltyIndexes = {
        30: 1,
        31: 2,
        32: 3,
        33: 4,
        34: 5,
        35: 6,
        36: 7,
        37: 8,
      };
      if (
        userSummonPceRty > 0 ||
        userSummonPceRty !== '' ||
        type !== 'SUMMON'
      ) {
        while (summonPce !== 0) {
          for (let sq = 21; sq <= 98; sq++) {
            if (
              SQOFFBOARD(sq) === BOOL.TRUE ||
              herrings.length ||
              capturesOnly
            ) {
              continue;
            }
            if (summonPce === PIECES.wP && summonFlag < 16384) {
              if (
                GameBoard.whiteArcane[4] & 16 &&
                RanksBrd[sq] === RANKS.RANK_7
              ) {
                continue;
              }
              if (RanksBrd[sq] === RANKS.RANK_8) {
                continue;
              }
            }
            if (summonPce === PIECES.bP && summonFlag < 16384) {
              if (
                GameBoard.blackArcane[4] & 16 &&
                RanksBrd[sq] === RANKS.RANK_2
              ) {
                continue;
              }
              if (RanksBrd[sq] === RANKS.RANK_1) {
                continue;
              }
            }
            if (GameBoard.side === COLOURS.WHITE) {
              if (sq < whiteLimit) {
                if (
                  summonFlag < 16384 &&
                  ((summonPce === userSummonPceRty && type === 'SUMMON') ||
                    type !== 'SUMMON') &&
                  GameBoard.pieces[sq] === PIECES.EMPTY &&
                  GameBoard.whiteArcane[3] & summonFlag
                ) {
                  addSummonMove(
                    MOVE(0, sq, PIECES.EMPTY, summonPce, MFLAGSUMN)
                  );
                } else if (
                  ((summonPce === userSummonPceRty && type === 'SUMMON') ||
                    type !== 'SUMMON') &&
                  summonFlag >= 16384 &&
                  summonFlag ===
                    POWERBIT[`sumnR${RtyChar.split('')[summonPce]}`] &&
                  summonFlag & GameBoard.whiteArcane[3]
                ) {
                  if (
                    GameBoard.royaltyQ[sq] > 0 ||
                    GameBoard.royaltyT[sq] > 0 ||
                    GameBoard.royaltyM[sq] > 0 ||
                    GameBoard.royaltyV[sq] > 0 ||
                    GameBoard.royaltyE[sq] > 0
                  ) {
                    continue;
                  }
                  addSummonMove(
                    MOVE(
                      0,
                      sq,
                      royaltyIndexes[summonPce],
                      PIECES.EMPTY,
                      MFLAGSUMN
                    )
                  );
                } else {
                  continue;
                }
              }
            } else if (GameBoard.side === COLOURS.BLACK) {
              if (sq > blackLimit) {
                if (
                  summonFlag < 16384 &&
                  ((summonPce === userSummonPceRty && type === 'SUMMON') ||
                    type !== 'SUMMON') &&
                  GameBoard.pieces[sq] === PIECES.EMPTY &&
                  GameBoard.blackArcane[3] & summonFlag
                ) {
                  addSummonMove(
                    MOVE(0, sq, PIECES.EMPTY, summonPce, MFLAGSUMN)
                  );
                } else if (
                  ((summonPce === userSummonPceRty && type === 'SUMMON') ||
                    type !== 'SUMMON') &&
                  summonFlag >= 16384 &&
                  summonFlag ===
                    POWERBIT[`sumnR${RtyChar.split('')[summonPce]}`] &&
                  summonFlag & GameBoard.blackArcane[3]
                ) {
                  if (
                    GameBoard.royaltyQ[sq] > 0 ||
                    GameBoard.royaltyT[sq] > 0 ||
                    GameBoard.royaltyM[sq] > 0 ||
                    GameBoard.royaltyV[sq] > 0 ||
                    GameBoard.royaltyE[sq] > 0
                  ) {
                    continue;
                  }
                  addSummonMove(
                    MOVE(
                      0,
                      sq,
                      royaltyIndexes[summonPce],
                      PIECES.EMPTY,
                      MFLAGSUMN
                    )
                  );
                } else {
                  continue;
                }
              }
            }
          }
          summonPce = loopSummon[summonIndex];
          summonFlag = loopSummonFlag[summonIndex++];
        }
      }
    }

    if (type === 'SUMMON') return;

    // if force ep or force herring?
    if (!herrings.length) {
      if (
        GameBoard.side === COLOURS.WHITE &&
        GameBoard.whiteArcane[4] &&
        16384
      ) {
        AddQuietMove(MOVE(0, 0, PIECES.EMPTY, 31, 0), capturesOnly);
      }
      if (
        GameBoard.side === COLOURS.BLACK &&
        GameBoard.blackArcane[4] &&
        16384
      ) {
        AddQuietMove(MOVE(0, 0, PIECES.EMPTY, 31, 0), capturesOnly);
      }
    }
  }

  // NOTE WHITE PAWN AND SPECIAL MOVES
  if (GameBoard.side === COLOURS.WHITE) {
    pceType = PIECES.wP;

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

      if (
        GameBoard.royaltyQ[sq] > 0 ||
        GameBoard.royaltyT[sq] > 0 ||
        GameBoard.royaltyM[sq] > 0 ||
        GameBoard.royaltyV[sq] > 0 ||
        GameBoard.royaltyE[sq] > 0
      ) {
        continue;
      }

      // note WHITE PAWN QUIET MOVES
      if (
        !activeWhiteForcedEpCapture &&
        (GameBoard.dyad === 0 ||
          GameBoard.dyad === 1 ||
          GameBoard.dyad === 2) &&
        !herrings.length
      ) {
        // NORMAL PAWN MOVES
        if (GameBoard.pieces[sq + 10] === PIECES.EMPTY) {
          AddWhitePawnQuietMove(sq, sq + 10, 0, capturesOnly);
        }
        if (
          (GameBoard.pieces[sq + 10] === PIECES.EMPTY &&
            GameBoard.pieces[sq + 20] === PIECES.EMPTY) ||
          // aetherstep
          (GameBoard.pieces[sq + 20] === PIECES.EMPTY &&
            GameBoard.whiteArcane[4] & 2)
        ) {
          if (RanksBrd[sq] === RANKS.RANK_1 || RanksBrd[sq] === RANKS.RANK_2) {
            AddQuietMove(
              MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS),
              capturesOnly
            );
          }
        }

        // note WHITE PAWN SHIFTS
        if (GameBoard.whiteArcane[1] & 1) {
          if (GameBoard.pieces[sq - 1] === PIECES.EMPTY) {
            AddWhitePawnQuietMove(sq, sq - 1, MFLAGSHFT, capturesOnly);
          }
          if (GameBoard.pieces[sq + 1] === PIECES.EMPTY) {
            AddWhitePawnQuietMove(sq, sq + 1, MFLAGSHFT, capturesOnly);
          }
          if (GameBoard.pieces[sq - 10] === PIECES.EMPTY) {
            AddWhitePawnQuietMove(sq, sq - 10, MFLAGSHFT, capturesOnly);
          }
        }
      }

      // note WHITE PAWN CAPTURES AND CONSUME

      if (
        !activeWhiteForcedEpCapture &&
        ((SQOFFBOARD(sq + 9) === BOOL.FALSE && !herrings.length) ||
          (SQOFFBOARD(sq + 9) === BOOL.FALSE &&
            herrings.length &&
            _.includes(herrings, sq + 9)))
      ) {
        if (PieceCol[GameBoard.pieces[sq + 9]] === COLOURS.BLACK) {
          AddWhitePawnCaptureMove(
            sq,
            sq + 9,
            GameBoard.pieces[sq + 9],
            false,
            capturesOnly
          );
        }
        // note white pawn consume
        if (
          PieceCol[GameBoard.pieces[sq + 9]] === COLOURS.WHITE &&
          GameBoard.whiteArcane[4] & 1 &&
          !PieceKing[GameBoard.pieces[sq + 9]]
        ) {
          AddWhitePawnCaptureMove(
            sq,
            sq + 9,
            GameBoard.pieces[sq + 9],
            true,
            capturesOnly
          );
        }
      }

      if (
        (SQOFFBOARD(sq + 11) === BOOL.FALSE &&
          !herrings.length &&
          !activeWhiteForcedEpCapture) ||
        (SQOFFBOARD(sq + 11) === BOOL.FALSE &&
          herrings.length &&
          _.includes(herrings, sq + 11))
      ) {
        if (PieceCol[GameBoard.pieces[sq + 11]] === COLOURS.BLACK) {
          AddWhitePawnCaptureMove(
            sq,
            sq + 11,
            GameBoard.pieces[sq + 11],
            false,
            capturesOnly
          );
        }
        // note white pawn consume
        if (
          PieceCol[GameBoard.pieces[sq + 11]] === COLOURS.WHITE &&
          GameBoard.whiteArcane[4] & 1 &&
          !PieceKing[GameBoard.pieces[sq + 11]]
        ) {
          AddWhitePawnCaptureMove(
            sq,
            sq + 11,
            GameBoard.pieces[sq + 11],
            true,
            capturesOnly
          );
        }
      }

      if (GameBoard.dyad === 0) {
        // NOTE WHITE EP
        if (
          (GameBoard.enPas !== SQUARES.NO_SQ && !herrings.length) ||
          activeWhiteForcedEpCapture
        ) {
          if (sq + 9 === GameBoard.enPas) {
            if (
              GameBoard.whiteArcane[4] & 16 &&
              RanksBrd[sq + 9] === RANKS.RANK_7
            ) {
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wQ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wT, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wM, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wR, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wB, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wN, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wZ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wU, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wS, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 9, GameBoard.pieces[sq + 9], PIECES.wW, MFLAGEP)
              );
            } else {
              AddEnPassantMove(
                MOVE(
                  sq,
                  sq + 9,
                  GameBoard.pieces[sq + 9],
                  PIECES.EMPTY,
                  MFLAGEP
                )
              );
            }
          }
          if (sq + 11 === GameBoard.enPas) {
            if (
              GameBoard.whiteArcane[4] & 16 &&
              RanksBrd[sq + 11] === RANKS.RANK_7
            ) {
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wQ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wT, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wM, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wR, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wB, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wN, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wZ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wU, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wS, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq + 11, GameBoard.pieces[sq + 11], PIECES.wW, MFLAGEP)
              );
            } else {
              AddEnPassantMove(
                MOVE(
                  sq,
                  sq + 11,
                  GameBoard.pieces[sq + 11],
                  PIECES.EMPTY,
                  MFLAGEP
                )
              );
            }
          }
        }
      }
    }

    // WARNING, this will only work in a vanilla setup, no extra rooks
    if (!activeWhiteForcedEpCapture) {
      if (GameBoard.castlePerm & CASTLEBIT.WKCA && !herrings.length) {
        if (GameBoard.blackArcane[4] & 8) {
          // todo remove
        } else {
          if (
            GameBoard.pieces[SQUARES.F1] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.G1] === PIECES.EMPTY
          ) {
            if (
              (SqAttacked(SQUARES.F1, COLOURS.BLACK) === BOOL.FALSE &&
                SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE) ||
              GameBoard.whiteArcane[4] & 4
            ) {
              AddQuietMove(
                MOVE(
                  SQUARES.E1,
                  SQUARES.G1,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        }
      }

      if (GameBoard.castlePerm & CASTLEBIT.WQCA && !herrings.length) {
        if (GameBoard.blackArcane[4] & 8) {
          // randomize plus castle remove
        } else {
          if (
            GameBoard.pieces[SQUARES.D1] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.C1] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.B1] === PIECES.EMPTY
          ) {
            if (
              (SqAttacked(SQUARES.D1, COLOURS.BLACK) === BOOL.FALSE &&
                SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE) ||
              GameBoard.whiteArcane[4] & 4
            ) {
              AddQuietMove(
                MOVE(
                  SQUARES.E1,
                  SQUARES.C1,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        }
      }
    }
  } else {
    // note BLACK PAWN AND SPECIAL MOVES
    pceType = PIECES.bP;

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

      if (
        GameBoard.royaltyQ[sq] > 0 ||
        GameBoard.royaltyT[sq] > 0 ||
        GameBoard.royaltyM[sq] > 0 ||
        GameBoard.royaltyV[sq] > 0 ||
        GameBoard.royaltyE[sq] > 0
      ) {
        continue;
      }

      // note BLACK PAWN QUIET MOVES
      if (
        !activeBlackForcedEpCapture &&
        (GameBoard.dyad === 0 ||
          GameBoard.dyad === 1 ||
          GameBoard.dyad === 2) &&
        !herrings.length
      ) {
        // NORMAL PAWN MOVES
        if (GameBoard.pieces[sq - 10] === PIECES.EMPTY) {
          AddBlackPawnQuietMove(sq, sq - 10, 0, capturesOnly);
        }
        if (
          (GameBoard.pieces[sq - 10] === PIECES.EMPTY &&
            GameBoard.pieces[sq - 20] === PIECES.EMPTY) ||
          // aetherstep
          (GameBoard.pieces[sq - 20] === PIECES.EMPTY &&
            GameBoard.blackArcane[4] & 2)
        ) {
          if (RanksBrd[sq] === RANKS.RANK_8 || RanksBrd[sq] === RANKS.RANK_7) {
            AddQuietMove(
              MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS),
              capturesOnly
            );
          }
        }

        // note BLACK PAWN SHIFTS
        if (GameBoard.blackArcane[1] & 1) {
          if (GameBoard.pieces[sq - 1] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(sq, sq - 1, MFLAGSHFT, capturesOnly);
          }
          if (GameBoard.pieces[sq + 1] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(sq, sq + 1, MFLAGSHFT, capturesOnly);
          }
          if (GameBoard.pieces[sq + 10] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(sq, sq + 10, MFLAGSHFT, capturesOnly);
          }
        }
      }

      // note BLACK PAWN CAPTURES AND CONSUME
      if (
        (SQOFFBOARD(sq - 9) === BOOL.FALSE &&
          !herrings.length &&
          !activeBlackForcedEpCapture) ||
        (SQOFFBOARD(sq - 9) === BOOL.FALSE &&
          herrings.length &&
          _.includes(herrings, sq - 9))
      ) {
        if (PieceCol[GameBoard.pieces[sq - 9]] === COLOURS.WHITE) {
          AddBlackPawnCaptureMove(
            sq,
            sq - 9,
            GameBoard.pieces[sq - 9],
            false,
            capturesOnly
          );
        }
        // note black pawn consume
        if (
          PieceCol[GameBoard.pieces[sq - 9]] === COLOURS.BLACK &&
          GameBoard.blackArcane[4] & 1 &&
          !PieceKing[GameBoard.pieces[sq - 9]]
        ) {
          AddBlackPawnCaptureMove(
            sq,
            sq - 9,
            GameBoard.pieces[sq - 9],
            true,
            capturesOnly
          );
        }
      }

      if (
        !activeBlackForcedEpCapture &&
        ((SQOFFBOARD(sq - 11) === BOOL.FALSE && !herrings.length) ||
          (SQOFFBOARD(sq - 11) === BOOL.FALSE &&
            herrings.length &&
            _.includes(herrings, sq - 11)))
      ) {
        if (PieceCol[GameBoard.pieces[sq - 11]] === COLOURS.WHITE) {
          AddBlackPawnCaptureMove(
            sq,
            sq - 11,
            GameBoard.pieces[sq - 11],
            false,
            capturesOnly
          );
        }
        // note black pawn consume
        if (
          PieceCol[GameBoard.pieces[sq - 11]] === COLOURS.BLACK &&
          GameBoard.blackArcane[4] & 1 &&
          !PieceKing[GameBoard.pieces[sq - 11]]
        ) {
          AddBlackPawnCaptureMove(
            sq,
            sq - 11,
            GameBoard.pieces[sq - 11],
            true,
            capturesOnly
          );
        }
      }

      // note BLACK EP
      if (GameBoard.dyad === 0) {
        if (
          (GameBoard.enPas !== SQUARES.NO_SQ && !herrings.length) ||
          activeBlackForcedEpCapture
        ) {
          if (sq - 9 === GameBoard.enPas) {
            if (
              GameBoard.blackArcane[4] & 16 &&
              RanksBrd[sq - 9] === RANKS.RANK_2
            ) {
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bQ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bT, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bM, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bR, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bB, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bN, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bZ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bU, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bS, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 9, GameBoard.pieces[sq - 9], PIECES.bW, MFLAGEP)
              );
            } else {
              AddEnPassantMove(
                MOVE(
                  sq,
                  sq - 9,
                  GameBoard.pieces[sq - 9],
                  PIECES.EMPTY,
                  MFLAGEP
                )
              );
            }
          }

          if (sq - 11 === GameBoard.enPas) {
            if (
              GameBoard.blackArcane[4] & 16 &&
              RanksBrd[sq - 11] === RANKS.RANK_2
            ) {
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bQ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bT, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bM, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bR, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bB, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bN, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bZ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bU, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bZ, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bU, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bS, MFLAGEP)
              );
              AddEnPassantMove(
                MOVE(sq, sq - 11, GameBoard.pieces[sq - 11], PIECES.bW, MFLAGEP)
              );
            } else {
              AddEnPassantMove(
                MOVE(
                  sq,
                  sq - 11,
                  GameBoard.pieces[sq - 11],
                  PIECES.EMPTY,
                  MFLAGEP
                )
              );
            }
          }
        }
      }
    }

    // WARNING, this will only work in a vanilla setup, no extra rooks
    if (!forcedEpAvailable) {
      if (GameBoard.castlePerm & CASTLEBIT.BKCA && !herrings.length) {
        if (GameBoard.whiteArcane[4] & 8) {
          // removed randomize arcane
        } else {
          if (
            GameBoard.pieces[SQUARES.F8] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.G8] === PIECES.EMPTY
          ) {
            if (
              (SqAttacked(SQUARES.F8, COLOURS.WHITE) === BOOL.FALSE &&
                SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE) ||
              GameBoard.blackArcane[4] & 4
            ) {
              AddQuietMove(
                MOVE(
                  SQUARES.E8,
                  SQUARES.G8,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        }
      }

      if (GameBoard.castlePerm & CASTLEBIT.BQCA && !herrings.length) {
        if (GameBoard.whiteArcane[4] & 8) {
          // removed randomize arcane
        } else {
          if (
            GameBoard.pieces[SQUARES.D8] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.C8] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.B8] === PIECES.EMPTY
          ) {
            if (
              (SqAttacked(SQUARES.D8, COLOURS.WHITE) === BOOL.FALSE &&
                SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE) ||
              GameBoard.blackArcane[4] & 4
            ) {
              AddQuietMove(
                MOVE(
                  SQUARES.E8,
                  SQUARES.C8,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        }
      }
    }
  }

  if (forcedEpAvailable && !herrings.length) return;

  // HOPPERS ROYALTY
  for (let i = 0; i < royaltyHoppers.length; i++) {
    const currentRoyalty = GameBoard[royaltyHopperMap[i]];
    _.forEach(currentRoyalty, (value, sqA) => {
      const sq = Number(sqA);
      const piece = GameBoard.pieces[sq];

      if (value <= 0) return;
      if (piece === PIECES.EMPTY) return;
      if (GameBoard.royaltyE[sq] > 0) return;
      if (PieceCol[piece] !== GameBoard.side) return;

      // KING WITH CASTLING RIGHTS NO ROYALTY
      if (
        GameBoard.side === COLOURS.WHITE &&
        GameBoard.castlePerm & CASTLEBIT.WKCA &&
        GameBoard.castlePerm & CASTLEBIT.WQCA &&
        piece === PIECES.wK
      ) {
        return;
      }
      if (
        GameBoard.side === COLOURS.BLACK &&
        GameBoard.castlePerm & CASTLEBIT.BKCA &&
        GameBoard.castlePerm & CASTLEBIT.BQCA &&
        piece === PIECES.bK
      ) {
        return;
      }

      for (let index = 0; index < DirNum[royaltyHoppers[i]]; index++) {
        dir = PceDir[royaltyHoppers[i]][index];
        t_sq = sq + dir;

        if (
          SQOFFBOARD(t_sq) === BOOL.TRUE ||
          GameBoard.pieces[t_sq] === undefined
        ) {
          continue;
        }
        if (GameBoard.pieces[t_sq] !== PIECES.EMPTY) {
          // note ROYALTY HOPPERS CAPTURES
          if (
            !herrings.length ||
            (herrings.length && _.includes(herrings, t_sq))
          ) {
            if (
              PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
              PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
            ) {
              if (GameBoard.pieces[sq] === PIECES.wP) {
                AddWhitePawnCaptureMove(
                  sq,
                  t_sq,
                  GameBoard.pieces[t_sq],
                  false,
                  capturesOnly
                );
              } else if (GameBoard.pieces[sq] === PIECES.bP) {
                AddBlackPawnCaptureMove(
                  sq,
                  t_sq,
                  GameBoard.pieces[t_sq],
                  false,
                  capturesOnly
                );
              } else {
                AddCaptureMove(
                  MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                  false,
                  capturesOnly
                );
              }
            }
          }

          // note ROYALTY HOPPERS CONSUME
          if (!herrings.length) {
            if (
              PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
              !PieceKing[GameBoard.pieces[t_sq]]
            ) {
              if (
                GameBoard.side === COLOURS.WHITE &&
                GameBoard.whiteArcane[4] & 1
              ) {
                if (GameBoard.pieces[sq] === PIECES.wP) {
                  AddWhitePawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    true,
                    capturesOnly
                  );
                } else {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      MFLAGCNSM
                    ),
                    true,
                    capturesOnly
                  );
                }
              }
              if (
                GameBoard.side === COLOURS.BLACK &&
                GameBoard.blackArcane[4] & 1
              ) {
                if (GameBoard.pieces[sq] === PIECES.bP) {
                  AddBlackPawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    true,
                    capturesOnly
                  );
                } else {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      MFLAGCNSM
                    ),
                    true,
                    capturesOnly
                  );
                }
              }
            }
          }
        }

        // note ROYALTY HOPPERS QUIET MOVES
        if (
          (GameBoard.dyad === 0 ||
            GameBoard.dyad === 1 ||
            GameBoard.dyad === dyad) &&
          !herrings.length &&
          GameBoard.pieces[t_sq] === PIECES.EMPTY
        ) {
          if (GameBoard.pieces[sq] === PIECES.wP) {
            AddWhitePawnQuietMove(sq, t_sq, 0, capturesOnly);
          } else if (GameBoard.pieces[sq] === PIECES.bP) {
            AddBlackPawnQuietMove(sq, t_sq, 0, capturesOnly);
          } else {
            AddQuietMove(
              MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0),
              capturesOnly
            );
          }
        }
      }
    });
  }

  // SLIDERS ROYALTY
  for (let i = 0; i < royaltySliders.length; i++) {
    if (type2 === 'TELEPORT') break;
    const currentRoyalty = GameBoard[royaltySliderMap[i]];
    _.forEach(currentRoyalty, (value, sqA) => {
      const sq = Number(sqA);
      const piece = GameBoard.pieces[sq];

      if (value <= 0) return;
      if (piece === PIECES.EMPTY) return;
      if (GameBoard.royaltyE[sq] > 0) return;
      if (PieceCol[piece] !== GameBoard.side) return;

      // KING WITH CASTLING RIGHTS NO ROYALTY
      if (
        GameBoard.side === COLOURS.WHITE &&
        GameBoard.castlePerm & CASTLEBIT.WKCA &&
        GameBoard.castlePerm & CASTLEBIT.WQCA &&
        piece === PIECES.wK
      ) {
        return;
      }
      if (
        GameBoard.side === COLOURS.BLACK &&
        GameBoard.castlePerm & CASTLEBIT.BKCA &&
        GameBoard.castlePerm & CASTLEBIT.BQCA &&
        piece === PIECES.bK
      ) {
        return;
      }

      for (let index = 0; index < DirNum[royaltySliders[i]]; index++) {
        dir = PceDir[royaltySliders[i]][index];
        t_sq = sq + dir;

        while (
          SQOFFBOARD(t_sq) === BOOL.FALSE &&
          GameBoard.pieces[t_sq] !== undefined
        ) {
          // Check if we encountered a piece
          if (GameBoard.pieces[t_sq] !== PIECES.EMPTY) {
            // note ROYALTY SLIDERS CAPTURES
            if (
              PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
              PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
            ) {
              if (
                !herrings.length ||
                (herrings.length && _.includes(herrings, t_sq))
              ) {
                if (GameBoard.pieces[sq] === PIECES.wP) {
                  AddWhitePawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    false,
                    capturesOnly
                  );
                } else if (GameBoard.pieces[sq] === PIECES.bP) {
                  AddBlackPawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    false,
                    capturesOnly
                  );
                } else {
                  AddCaptureMove(
                    MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                    false,
                    capturesOnly
                  );
                }
              }
            }

            // note ROYALTY SLIDERS CONSUME
            else if (
              PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
              !PieceKing[GameBoard.pieces[t_sq]] &&
              !herrings.length
            ) {
              if (
                (GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane[4] & 1) ||
                (GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane[4] & 1)
              ) {
                if (GameBoard.pieces[sq] === PIECES.wP) {
                  AddWhitePawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    true,
                    capturesOnly
                  );
                } else if (GameBoard.pieces[sq] === PIECES.bP) {
                  AddBlackPawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    true,
                    capturesOnly
                  );
                } else {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      MFLAGCNSM
                    ),
                    true,
                    capturesOnly
                  );
                }
              }
            }
            break;
          }

          // note ROYALTY SLIDERS QUIET MOVES
          if (
            (GameBoard.dyad === 0 ||
              GameBoard.dyad === 1 ||
              GameBoard.dyad === dyad) &&
            GameBoard.pieces[t_sq] === PIECES.EMPTY
          ) {
            if (
              !herrings.length ||
              (herrings.length && _.includes(herrings, t_sq))
            ) {
              if (GameBoard.pieces[sq] === PIECES.wP) {
                AddWhitePawnQuietMove(sq, t_sq, 0, capturesOnly);
              } else if (GameBoard.pieces[sq] === PIECES.bP) {
                AddBlackPawnQuietMove(sq, t_sq, 0, capturesOnly);
              } else {
                AddQuietMove(
                  MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0),
                  capturesOnly
                );
              }
            }
          }
          t_sq += dir;
        }
      }
    });
  }

  pceIndex = LoopNonSlideIndex[GameBoard.side];
  pce = LoopNonSlidePce[pceIndex];
  dyad = LoopNonSlideDyad[pceIndex++];

  // HOPPERS
  while (pce !== 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++) {
      sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

      const isOverrided =
        GameBoard.royaltyQ[sq] > 0 ||
        GameBoard.royaltyT[sq] > 0 ||
        GameBoard.royaltyM[sq] > 0 ||
        GameBoard.royaltyV[sq] > 0 ||
        GameBoard.royaltyE[sq] > 0;

      if (!isOverrided) {
        let dirVariants = DirNum[pce];
        let dirArray = PceDir[pce];

        if (
          pce === PIECES.wT ||
          pce === PIECES.bT ||
          pce === PIECES.wM ||
          pce === PIECES.bM
        ) {
          dirVariants = 8;
          dirArray = KnDir;
        }

        let canShift = false;
        if (pce === PIECES.wN) {
          canShift = GameBoard.whiteArcane[1] & 2;
        } else if (pce === PIECES.bN) {
          canShift = GameBoard.blackArcane[1] & 2;
        }

        for (let index = 0; index < dirVariants; index++) {
          let dir = dirArray[index];
          t_sq = sq + dir;

          if (SQOFFBOARD(t_sq) === BOOL.TRUE) {
            continue;
          }

          if (t_sq < 0 || t_sq > 119) continue;

          if (
            !herrings.length ||
            (herrings.length && _.includes(herrings, t_sq))
          ) {
            if (GameBoard.pieces[t_sq] !== PIECES.EMPTY) {
              const targetPieceColor = PieceCol[GameBoard.pieces[t_sq]];

              if (
                targetPieceColor !== GameBoard.side &&
                targetPieceColor !== COLOURS.BOTH
              ) {
                AddCaptureMove(
                  MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                  false,
                  capturesOnly
                );
              }
            }
          }

          if (SQOFFBOARD(t_sq) === BOOL.FALSE && !herrings.length) {
            if (
              PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
              !PieceKing[GameBoard.pieces[t_sq]]
            ) {
              const canConsume =
                (GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane[4] & 1 &&
                  !(
                    pce === PIECES.wK &&
                    GameBoard.castlePerm & CASTLEBIT.WKCA &&
                    GameBoard.castlePerm & CASTLEBIT.WQCA
                  )) ||
                (GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane[4] & 1 &&
                  !(
                    pce === PIECES.bK &&
                    GameBoard.castlePerm & CASTLEBIT.BKCA &&
                    GameBoard.castlePerm & CASTLEBIT.BQCA
                  ));

              if (canConsume) {
                AddCaptureMove(
                  MOVE(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    PIECES.EMPTY,
                    MFLAGCNSM
                  ),
                  true,
                  capturesOnly
                );
              }
            }
          }

          if (
            (GameBoard.dyad === 0 ||
              GameBoard.dyad === 1 ||
              GameBoard.dyad === dyad) &&
            !herrings.length &&
            SQOFFBOARD(t_sq) === BOOL.FALSE &&
            GameBoard.pieces[t_sq] === PIECES.EMPTY
          ) {
            AddQuietMove(
              MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0),
              capturesOnly
            );
          }
        }

        if (canShift && (pce === PIECES.wN || pce === PIECES.bN)) {
          for (let kIndex = 0; kIndex < 8; kIndex++) {
            let kDir = KiDir[kIndex];
            let shft_t_N_sq = sq + kDir;

            if (SQOFFBOARD(shft_t_N_sq) === BOOL.TRUE) {
              continue;
            }

            if (shft_t_N_sq < 0 || shft_t_N_sq > 119) continue;

            if (GameBoard.pieces[shft_t_N_sq] === PIECES.EMPTY) {
              if (
                (GameBoard.dyad === 0 ||
                  GameBoard.dyad === 1 ||
                  GameBoard.dyad === dyad) &&
                !herrings.length
              ) {
                AddQuietMove(
                  MOVE(sq, shft_t_N_sq, PIECES.EMPTY, PIECES.EMPTY, MFLAGSHFT),
                  capturesOnly
                );
              }
            }
          }
        }
      }
    }
    pce = LoopNonSlidePce[pceIndex];
    dyad = LoopNonSlideDyad[pceIndex++];
  }

  pceIndex = LoopSlideIndex[GameBoard.side];
  pce = LoopSlidePce[pceIndex];
  dyad = LoopSlideDyad[pceIndex++];

  // SLIDERS
  while (pce !== 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++) {
      const sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
      const isOverrided =
        GameBoard.royaltyQ[sq] > 0 ||
        GameBoard.royaltyT[sq] > 0 ||
        GameBoard.royaltyM[sq] > 0 ||
        GameBoard.royaltyV[sq] > 0 ||
        GameBoard.royaltyE[sq] > 0;

      if (!isOverrided) {
        const origPce = pce;
        let slidePce = origPce;
        const arc4 =
          GameBoard.side === COLOURS.WHITE
            ? GameBoard.whiteArcane[4]
            : GameBoard.blackArcane[4];

        if (origPce === PIECES.wV) {
          if (arc4 & 2048) {
            slidePce = PIECES.wQ;
          } else {
            continue;
          }
        }
        if (origPce === PIECES.bV) {
          if (arc4 & 2048) {
            slidePce = PIECES.bQ;
          } else {
            continue;
          }
        }
        if (origPce === PIECES.wW) {
          if (arc4 & 2048) {
            slidePce = PIECES.wB;
          } else {
            continue;
          }
        }
        if (origPce === PIECES.bW) {
          if (arc4 & 2048) {
            slidePce = PIECES.bB;
          } else {
            continue;
          }
        }

        for (let idx = 0; idx < DirNum[slidePce]; idx++) {
          const dir = PceDir[slidePce][idx];
          let t_sq = sq + dir;
          let rDir, bDir, shft_t_R_sq, shft_t_B_sq;

          if (
            slidePce === PIECES.wB ||
            slidePce === PIECES.wR ||
            slidePce === PIECES.bB ||
            slidePce === PIECES.bR
          ) {
            rDir = RkDir[index];
            bDir = BiDir[index];

            shft_t_B_sq = sq + rDir;
            shft_t_R_sq = sq + bDir;
          }

          while (
            SQOFFBOARD(t_sq) === BOOL.FALSE &&
            GameBoard.pieces[t_sq] !== undefined
          ) {
            // note SLIDERS CAPTURES
            if (GameBoard.pieces[t_sq] !== PIECES.EMPTY) {
              if (
                PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
                PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
              ) {
                if (
                  !herrings.length ||
                  (herrings.length && _.includes(herrings, t_sq))
                ) {
                  AddCaptureMove(
                    MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                    false,
                    capturesOnly
                  );
                }
              }

              // note SLIDERS CONSUME
              else if (
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
                !PieceKing[GameBoard.pieces[t_sq]] &&
                !herrings.length
              ) {
                if (
                  (GameBoard.side === COLOURS.WHITE &&
                    GameBoard.whiteArcane[4] & 1) ||
                  (GameBoard.side === COLOURS.BLACK &&
                    GameBoard.blackArcane[4] & 1)
                ) {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      MFLAGCNSM
                    ),
                    true,
                    capturesOnly
                  );
                }
              }
              break;
            }

            // note SLIDERS QUIET MOVES
            if (
              (GameBoard.dyad === 0 ||
                GameBoard.dyad === 1 ||
                GameBoard.dyad === dyad) &&
              GameBoard.pieces[t_sq] === PIECES.EMPTY
            ) {
              if (
                !herrings.length ||
                (herrings.length && _.includes(herrings, t_sq))
              ) {
                AddQuietMove(
                  MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0),
                  capturesOnly
                );
              }
            }
            t_sq += dir;
          }

          // note ROOK SHIFT
          if (SQOFFBOARD(shft_t_R_sq) === BOOL.FALSE) {
            if (
              (GameBoard.dyad === 0 ||
                GameBoard.dyad === 1 ||
                GameBoard.dyad === dyad) &&
              !herrings.length
            ) {
              if (GameBoard.pieces[shft_t_R_sq] === PIECES.EMPTY) {
                if (
                  GameBoard.pieces[sq] === PIECES.wR &&
                  GameBoard.whiteArcane[1] & 8
                ) {
                  AddQuietMove(
                    MOVE(
                      sq,
                      shft_t_R_sq,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGSHFT
                    ),
                    capturesOnly
                  );
                }
                if (
                  GameBoard.pieces[sq] === PIECES.bR &&
                  GameBoard.blackArcane[1] & 8
                ) {
                  AddQuietMove(
                    MOVE(
                      sq,
                      shft_t_R_sq,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGSHFT
                    ),
                    capturesOnly
                  );
                }
              }
            }
          }

          // note BISHOP SHIFT
          if (SQOFFBOARD(shft_t_B_sq) === BOOL.FALSE) {
            if (
              (GameBoard.dyad === 0 ||
                GameBoard.dyad === 1 ||
                GameBoard.dyad === dyad) &&
              !herrings.length
            ) {
              if (GameBoard.pieces[shft_t_B_sq] === PIECES.EMPTY) {
                if (
                  GameBoard.pieces[sq] === PIECES.wB &&
                  GameBoard.whiteArcane[1] & 4
                ) {
                  AddQuietMove(
                    MOVE(
                      sq,
                      shft_t_B_sq,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGSHFT
                    ),
                    capturesOnly
                  );
                }
                if (
                  GameBoard.pieces[sq] === PIECES.bB &&
                  GameBoard.blackArcane[1] & 4
                ) {
                  AddQuietMove(
                    MOVE(
                      sq,
                      shft_t_B_sq,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGSHFT
                    ),
                    capturesOnly
                  );
                }
              }
            }
          }
        }
      }
    }
    pce = LoopSlidePce[pceIndex];
    dyad = LoopSlideDyad[pceIndex++];
  }
}
