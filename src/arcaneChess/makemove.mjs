import _ from 'lodash';

// import all vars and functions from arcanechess folder that are not defined
import {
  GameBoard,
  FROMSQ,
  TOSQ,
  CAPTURED,
  PROMOTED,
  ARCANEFLAG,
  MFLAGEP,
  MFLAGCA,
  MFLAGPS,
  MFLAGSHFT,
  MFLAGCNSM,
  MFLAGSWAP,
  MFLAGSUMN,
  HASH_PCE,
  HASH_CA,
  HASH_EP,
  HASH_SIDE,
  SqAttacked,
} from './board';
import { whiteArcaneConfig, blackArcaneConfig } from './arcaneDefs';
import {
  COLOURS,
  PIECES,
  BOOL,
  Kings,
  PCEINDEX,
  CastlePerm,
  PiecePawn,
  PieceVal,
  PieceCol,
  SQUARES,
  PceChar,
  RANKS,
  RanksBrd,
} from './defs';
import { ARCANE_BIT_VALUES, RtyChar } from './defs.mjs';

const royaltyIndexMapRestructure = [0, 31, 32, 33, 34, 35, 36, 37, 38];

// cap 30 = cappable exile
// cap 31 = teleport
const TELEPORT_CONST = 31;
// eps 30 = myriad
const EPSILON_MYRIAD_CONST = 30;
// eps 31 = eclipse

const HISTORY_CAP_PLY = 128;

function trimHistory(commit) {
  if (!commit) return;
  if (GameBoard.hisPly <= HISTORY_CAP_PLY) return;
  const drop = GameBoard.hisPly - HISTORY_CAP_PLY;
  GameBoard.history.splice(0, drop);
  GameBoard.hisPly -= drop;
}

export function ClearPiece(sq, summon = false) {
  let pce = GameBoard.pieces[sq];
  let col = PieceCol[pce];
  let index;
  let t_pceNum = -1;

  HASH_PCE(pce, sq);

  GameBoard.pieces[sq] = PIECES.EMPTY;
  if (!summon) {
    GameBoard.material[col] -= PieceVal[pce];
  }

  for (index = 0; index < GameBoard.pceNum[pce]; index++) {
    if (GameBoard.pList[PCEINDEX(pce, index)] === sq) {
      t_pceNum = index;
      break;
    }
  }

  GameBoard.pceNum[pce]--;
  GameBoard.pList[PCEINDEX(pce, t_pceNum)] =
    GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])];
}

export function AddPiece(sq, pce, summon = false) {
  let col = PieceCol[pce];

  HASH_PCE(pce, sq);

  GameBoard.pieces[sq] = pce;
  if (!summon) {
    // I believe this is to prevent computer from just exhausting all summons right away
    GameBoard.material[col] += PieceVal[pce];
  }
  GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq;
  GameBoard.pceNum[pce]++;
}

export function MovePiece(from, to) {
  let index = 0;
  let pce = GameBoard.pieces[from];

  HASH_PCE(pce, from);
  GameBoard.pieces[from] = PIECES.EMPTY;

  HASH_PCE(pce, to);
  GameBoard.pieces[to] = pce;

  for (index = 0; index < GameBoard.pceNum[pce]; index++) {
    if (GameBoard.pList[PCEINDEX(pce, index)] === from) {
      GameBoard.pList[PCEINDEX(pce, index)] = to;
      break;
    }
  }
}

const getPocketCaptureEpsilon = (move, side, captured) => {
  if ((move & (MFLAGSWAP | MFLAGSUMN)) !== 0) return PIECES.EMPTY;
  if ((move & MFLAGEP) !== 0) {
    return side === COLOURS.WHITE ? PIECES.bP : PIECES.wP;
  }
  if ((move & MFLAGSHFT) !== 0 && captured === TELEPORT_CONST) {
    return TELEPORT_CONST;
  }

  return captured;
};

const getSumnCaptureForRoyalty = (move, captured) => {
  return (move & MFLAGSUMN) !== 0 ? captured : PIECES.EMPTY;
};

function sumnKeyFromMove(move) {
  if ((move & MFLAGSUMN) === 0) return null;
  const cap = CAPTURED(move);
  const eps = PROMOTED(move);
  if (cap > 0) {
    const idx = royaltyIndexMapRestructure[cap];
    const sym = RtyChar.split('')[idx];
    return `sumnR${sym}`;
  }
  if (eps > 0) {
    return `sumn${PceChar.charAt(eps).toUpperCase()}`;
  }
  return null;
}

function shiftKeyFromMove(move, moverPiece) {
  if ((move & MFLAGSHFT) === 0) return null;

  if (CAPTURED(move) === TELEPORT_CONST) return 'shftT';

  const p = PROMOTED(move);
  const piece = p || moverPiece || PIECES.EMPTY;

  switch (piece) {
    case PIECES.wP:
    case PIECES.bP:
      return 'shftP';

    case PIECES.wB:
    case PIECES.bB:
      return 'shftB';

    case PIECES.wR:
    case PIECES.bR:
      return 'shftR';

    // Knight-like (N/Z/U) grouped as "shftN"
    case PIECES.wN:
    case PIECES.wZ:
    case PIECES.wU:
    case PIECES.bN:
    case PIECES.bZ:
    case PIECES.bU:
      return 'shftN';

    // Guard-like (S/W) grouped as "shftG"
    case PIECES.wS:
    case PIECES.wW:
    case PIECES.bS:
    case PIECES.bW:
      return 'shftG';

    case PIECES.wH:
    case PIECES.bH:
      return 'shftH';

    // Myriad epsilon magic
    case EPSILON_MYRIAD_CONST:
      return 'shftA';

    default:
      return null;
  }
}

export function MakeMove(move, moveType = '') {
  let from = FROMSQ(move);
  let to = TOSQ(move);
  let side = GameBoard.side;

  let captured = CAPTURED(move);
  let pieceEpsilon = PROMOTED(move);

  const commit = moveType === 'userMove';

  const isShift = (m) => (m & MFLAGSHFT) !== 0;
  const isSwap = (m) => (m & MFLAGSWAP) !== 0;
  const isSummon = (m) => (m & MFLAGSUMN) !== 0;
  const isEp = (m) => (m & MFLAGEP) !== 0;
  const isConsume = (move & MFLAGCNSM) !== 0;

  let promoEpsilon = !isShift(move) ? pieceEpsilon : PIECES.EMPTY;

  const sumnCap = getSumnCaptureForRoyalty(move, captured);

  const moverPiece = GameBoard.pieces[from];
  const targetPieceAtTo = GameBoard.pieces[to];

  // if (promoEpsilon === 31 && (from !== 0 || to !== 0)) {
  //   promoEpsilon = PIECES.EMPTY;
  // }

  if (
    promoEpsilon !== PIECES.EMPTY &&
    !isSummon(move) &&
    PiecePawn[moverPiece] !== BOOL.TRUE
  ) {
    promoEpsilon = PIECES.EMPTY;
  }

  GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;
  GameBoard.history[GameBoard.hisPly].dyad = GameBoard.dyad;
  GameBoard.history[GameBoard.hisPly].dyadClock = GameBoard.dyadClock;

  // const getWhiteKingPos = _.indexOf(GameBoard.pieces, 6, 22);
  const getWhiteKingRookPos = _.lastIndexOf(GameBoard.pieces, 4);
  const getWhiteQueenRookPos = _.indexOf(GameBoard.pieces, 4, 22);

  // const getBlackKingPos = _.indexOf(GameBoard.pieces, 12, 92);
  const getBlackKingRookPos = _.lastIndexOf(GameBoard.pieces, 10);
  const getBlackQueenRookPos = _.indexOf(GameBoard.pieces, 10, 92);

  if (move & MFLAGEP) {
    const epSq = side === COLOURS.WHITE ? to - 10 : to + 10;
    const victim = side === COLOURS.WHITE ? PIECES.bP : PIECES.wP;

    // Only clear if it really looks like EP
    if (
      GameBoard.pieces[to] === PIECES.EMPTY &&
      GameBoard.pieces[epSq] === victim
    ) {
      ClearPiece(epSq);
      GameBoard.fiftyMove = 0;

      // pocket credit (+1) — unchanged
      const epPocket = getPocketCaptureEpsilon(move, side, captured);
      if (
        GameBoard.crazyHouse[side] &&
        epPocket !== PIECES.EMPTY &&
        epPocket !== TELEPORT_CONST &&
        PieceCol[epPocket] !== side
      ) {
        const key = `sumn${PceChar.charAt(epPocket).toUpperCase()}`;
        const cfg =
          side === COLOURS.WHITE ? whiteArcaneConfig : blackArcaneConfig;
        cfg[key] = (cfg[key] ?? 0) + 1;
      }
    }
  } else if ((move & MFLAGCA) !== 0) {
    // if black casts randomize on white
    if (GameBoard.blackArcane[4] & 8) {
      switch (to) {
        case getWhiteQueenRookPos:
          MovePiece(getWhiteQueenRookPos, SQUARES.D1);
          break;
        case getWhiteKingRookPos:
          MovePiece(getWhiteKingRookPos, SQUARES.F1);
          break;
      }
    } else {
      switch (to) {
        case SQUARES.C1:
          MovePiece(SQUARES.A1, SQUARES.D1);
          break;
        case SQUARES.G1:
          MovePiece(SQUARES.H1, SQUARES.F1);
          break;
        default:
          break;
      }
    }
    if (GameBoard.whiteArcane[4] & 8) {
      switch (to) {
        case getBlackQueenRookPos:
          MovePiece(getBlackQueenRookPos, SQUARES.D8);
          break;
        case getBlackKingRookPos:
          MovePiece(getBlackKingRookPos, SQUARES.F8);
          break;
        default:
          break;
      }
    } else {
      switch (to) {
        case SQUARES.C8:
          MovePiece(SQUARES.A8, SQUARES.D8);
          break;
        case SQUARES.G8:
          MovePiece(SQUARES.H8, SQUARES.F8);
          break;
        default:
          break;
      }
    }
  }

  if (GameBoard.enPas !== SQUARES.NO_SQ) HASH_EP();
  HASH_CA();

  GameBoard.invisibility[0] -= 1;
  GameBoard.invisibility[1] -= 1;
  GameBoard.suspend -= 1;

  GameBoard.history[GameBoard.hisPly].royaltyQ = { ...GameBoard.royaltyQ };
  GameBoard.history[GameBoard.hisPly].royaltyT = { ...GameBoard.royaltyT };
  GameBoard.history[GameBoard.hisPly].royaltyM = { ...GameBoard.royaltyM };
  GameBoard.history[GameBoard.hisPly].royaltyV = { ...GameBoard.royaltyV };
  GameBoard.history[GameBoard.hisPly].royaltyE = { ...GameBoard.royaltyE };

  _.forEach(GameBoard.royaltyQ, (value, key) => {
    value === undefined
      ? (GameBoard.royaltyQ[key] = 0)
      : (GameBoard.royaltyQ[key] -= 1);
  });
  _.forEach(GameBoard.royaltyT, (value, key) => {
    value === undefined
      ? (GameBoard.royaltyT[key] = 0)
      : (GameBoard.royaltyT[key] -= 1);
  });
  _.forEach(GameBoard.royaltyM, (value, key) => {
    value === undefined
      ? (GameBoard.royaltyM[key] = 0)
      : (GameBoard.royaltyM[key] -= 1);
  });
  _.forEach(GameBoard.royaltyV, (value, key) => {
    value === undefined
      ? (GameBoard.royaltyV[key] = 0)
      : (GameBoard.royaltyV[key] -= 1);
  });
  _.forEach(GameBoard.royaltyE, (value, key) => {
    value === undefined
      ? (GameBoard.royaltyE[key] = 0)
      : (GameBoard.royaltyE[key] -= 1);
  });

  GameBoard.history[GameBoard.hisPly].move = move;
  GameBoard.history[GameBoard.hisPly].prettyHistory = [];
  GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
  GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
  GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;

  GameBoard.castlePerm &= CastlePerm[from];
  GameBoard.castlePerm &= CastlePerm[to];
  GameBoard.enPas = SQUARES.NO_SQ;

  HASH_CA();

  if (PiecePawn[GameBoard.pieces[from]] === BOOL.TRUE) {
    GameBoard.fiftyMove = 0;

    if ((move & MFLAGPS) !== 0) {
      const isTwoStep =
        ((side === COLOURS.WHITE && to - from === 20) ||
          (side === COLOURS.BLACK && from - to === 20)) &&
        (move & (MFLAGSHFT | MFLAGSUMN | MFLAGSWAP | MFLAGEP)) === 0;

      // Only from the actual pawn start rank:
      const fromOnStart =
        (side === COLOURS.WHITE &&
          (RanksBrd[from] === RANKS.RANK_1 ||
            RanksBrd[from] === RANKS.RANK_2)) ||
        (side === COLOURS.BLACK &&
          (RanksBrd[from] === RANKS.RANK_8 || RanksBrd[from] === RANKS.RANK_7));

      if (isTwoStep && fromOnStart) {
        const jumpedSq = side === COLOURS.WHITE ? from + 10 : from - 10;
        if (GameBoard.pieces[jumpedSq] === PIECES.EMPTY) {
          GameBoard.enPas = jumpedSq;
          HASH_EP();
        }
      }
    }
  }

  const isNormalCapture =
    to > 0 &&
    (move & (MFLAGSWAP | MFLAGSUMN | MFLAGEP)) === 0 &&
    targetPieceAtTo !== PIECES.EMPTY &&
    targetPieceAtTo !== TELEPORT_CONST &&
    (PieceCol[targetPieceAtTo] !== side || isConsume);

  if (isNormalCapture) {
    const cfg = side === COLOURS.WHITE ? whiteArcaneConfig : blackArcaneConfig;

    ClearPiece(to);
    GameBoard.fiftyMove = 0;

    if (move & MFLAGPS) cfg['modsSUR'] -= 1;

    const pocketCapNow = getPocketCaptureEpsilon(move, side, captured);
    if (
      GameBoard.crazyHouse[side] &&
      pocketCapNow !== PIECES.EMPTY &&
      pocketCapNow !== TELEPORT_CONST &&
      PieceCol[pocketCapNow] !== side
    ) {
      const key = `sumn${PceChar.charAt(pocketCapNow).toUpperCase()}`;

      cfg[key] = (cfg[key] ?? 0) + 1;
    }
  }

  if (
    (move & MFLAGSUMN) === 0 &&
    (TOSQ(move) > 0 || CAPTURED(move) === TELEPORT_CONST) &&
    (ARCANEFLAG(move) === 0 ||
      isShift(move) ||
      isEp(move) ||
      (move & MFLAGPS) !== 0 ||
      (isConsume && !isShift(move)))
  ) {
    MovePiece(from, to);
  }

  if (
    TOSQ(move) > 0 &&
    promoEpsilon !== PIECES.EMPTY &&
    !isShift(move) &&
    !isSummon(move) &&
    !isSwap(move)
  ) {
    ClearPiece(to);
    AddPiece(to, promoEpsilon);
  }

  if (TOSQ(move) > 0 && move & MFLAGCNSM && !isShift(move)) {
    (side === COLOURS.WHITE
      ? whiteArcaneConfig
      : blackArcaneConfig
    ).modsCON -= 1;
  }

  if (TOSQ(move) > 0 && move & MFLAGSUMN) {
    // SUMN path only
    if (captured === 6) {
      // file bind
      const onesDigit = to % 10;
      _.times(8, (i) => {
        const rank = (i + 2) * 10;
        const square = rank + onesDigit;
        if (GameBoard.royaltyQ[square] > 0) GameBoard.royaltyQ[square] = 0;
        if (GameBoard.royaltyT[square] > 0) GameBoard.royaltyT[square] = 0;
        if (GameBoard.royaltyM[square] > 0) GameBoard.royaltyM[square] = 0;
        if (GameBoard.royaltyV[square] > 0) GameBoard.royaltyV[square] = 0;
        GameBoard.royaltyE[square] = 7;
      });
    } else if (captured === 7) {
      // rank bind
      const tensDigit = Math.floor(to / 10) * 10;
      _.times(8, (i) => {
        const onesDigit = i + 1;
        const square = tensDigit + onesDigit;
        if (GameBoard.royaltyQ[square] > 0) GameBoard.royaltyQ[square] = 0;
        if (GameBoard.royaltyT[square] > 0) GameBoard.royaltyT[square] = 0;
        if (GameBoard.royaltyM[square] > 0) GameBoard.royaltyM[square] = 0;
        if (GameBoard.royaltyV[square] > 0) GameBoard.royaltyV[square] = 0;
        GameBoard.royaltyE[square] = 7;
      });
    } else if (captured === 8) {
      const tombSquare = [-11, -10, -9, -1, 0, 1, 9, 10, 11];
      _.forEach(tombSquare, (offset) => {
        const sq = to + offset;
        if (GameBoard.royaltyQ[sq] > 0) GameBoard.royaltyQ[sq] = 0;
        if (GameBoard.royaltyT[sq] > 0) GameBoard.royaltyT[sq] = 0;
        if (GameBoard.royaltyM[sq] > 0) GameBoard.royaltyM[sq] = 0;
        if (GameBoard.royaltyV[sq] > 0) GameBoard.royaltyV[sq] = 0;
        if (GameBoard.pieces[sq] === PIECES.wEXILE) return;
        if (GameBoard.pieces[sq] === PIECES.bEXILE) return;
        GameBoard.royaltyE[sq] = 7;
      });
    } else if (sumnCap > 0) {
      const idx = royaltyIndexMapRestructure[sumnCap];
      const sym = RtyChar.split('')[idx];
      const map = GameBoard[`royalty${sym}`];
      if (map && (map[to] === undefined || map[to] <= 0)) map[to] = 7;
    } else if (promoEpsilon > 0) {
      AddPiece(to, promoEpsilon, true);
    }
  }
  if (TOSQ(move) > 0 && move & MFLAGSWAP) {
    const fromPiece = GameBoard.pieces[from];
    // const toPiece = GameBoard.pieces[to];
    ClearPiece(from);
    MovePiece(to, from);
    AddPiece(to, fromPiece);
    const swapType = isSwap(move) ? pieceEpsilon : PIECES.EMPTY;
    if (GameBoard.side === COLOURS.WHITE) {
      if (swapType === ARCANE_BIT_VALUES.DEP) whiteArcaneConfig.swapDEP -= 1;
      if (swapType === ARCANE_BIT_VALUES.ADJ) whiteArcaneConfig.swapADJ -= 1;
    } else {
      if (swapType === ARCANE_BIT_VALUES.DEP) blackArcaneConfig.swapDEP -= 1;
      if (swapType === ARCANE_BIT_VALUES.ADJ) blackArcaneConfig.swapADJ -= 1;
    }
  }

  const cfg = side === COLOURS.WHITE ? whiteArcaneConfig : blackArcaneConfig;

  const sKey = sumnKeyFromMove(move);
  if (sKey) cfg[sKey] = (cfg[sKey] ?? 0) - 1;

  const shKey = shiftKeyFromMove(move, moverPiece);
  if (shKey) cfg[shKey] = (cfg[shKey] ?? 0) - 1;

  if (TOSQ(move) === 0 && FROMSQ(move) > 0 && CAPTURED(move) > 0) {
    const promoted = PROMOTED(move);
    const whitePieceToOfferings = {
      1: [PIECES.wH],
      2: [PIECES.wR, PIECES.wR],
      3: [PIECES.wN, PIECES.wZ, PIECES.wU],
      4: [PIECES.wR],
      5: [PIECES.wT],
      6: [PIECES.wQ],
      7: [PIECES.wS],
      8: [PIECES.wW],
      9: [PIECES.wT],
      10: [PIECES.wQ],
      11: [PIECES.wS],
      12: [PIECES.wW],
      13: [captured],
      14: ['dyadA'],
      // K
      15: ['sumnRQ', 'sumnRQ', 'sumnRQ'],
      16: ['sumnRT', 'sumnRT', 'sumnRT'],
      17: ['sumnRM', 'sumnRM', 'sumnRM'],
      18: ['sumnRV', 'sumnRV', 'sumnRV'],
      // L
      19: ['shftT'],
      // M
      20: ['sumnRV', 'modsEXT', 'modsINH'],
      // N
      21: ['dyadA', 'modsGLU', 'modsINH'],
      // O
      22: ['sumnH', 'shftH', 'areaQ', 'modsHER'],
      23: ['sumnH', 'shftH', 'areaT', 'modsHER'],
      24: ['sumnH', 'shftH', 'areaM', 'modsHER'],
      // Z (P is reserved)
      25: ['dyadD', 'sumnS', 'modsBAN'],
      // Q
      26: ['dyadC', 'sumnR', 'modsEXT', 'modsGLU'],
      // R
      27: ['sumnRE', 'sumnRE', 'sumnRE', 'modsSIL'],
    };
    const blackPieceToOfferings = {
      1: [PIECES.bH],
      2: [PIECES.bR, PIECES.bR],
      3: [PIECES.bN, PIECES.bZ, PIECES.bU],
      4: [PIECES.bR],
      5: [PIECES.bT, 'dyadD'],
      6: [PIECES.bQ, 'dyadD'],
      7: [PIECES.bS, 'dyadE'],
      8: [PIECES.bW, 'dyadE'],
      9: [PIECES.bT],
      10: [PIECES.bQ],
      11: [PIECES.bS],
      12: [PIECES.bW],
      13: [captured],
      14: ['dyadA'],
      // K
      15: ['sumnRQ', 'sumnRQ', 'sumnRQ'],
      16: ['sumnRT', 'sumnRT', 'sumnRT'],
      17: ['sumnRM', 'sumnRM', 'sumnRM'],
      18: ['sumnRV', 'sumnRV', 'sumnRV'],
      // L
      19: ['shftT'],
      // M
      20: ['sumnRV', 'modsEXT', 'modsINH'],
      // N
      21: ['dyadA', 'modsGLU', 'modsINH'],
      // O
      22: ['sumnH', 'shftH', 'areaQ', 'modsHER'],
      23: ['sumnH', 'shftH', 'areaT', 'modsHER'],
      24: ['sumnH', 'shftH', 'areaM', 'modsHER'],
      // Z (P is reserved)
      25: ['dyadD', 'sumnS', 'modsBAN'],
      // Q
      26: ['dyadC', 'sumnR', 'modsEXT', 'modsGLU'],
      // R
      27: ['sumnRE', 'sumnRE', 'sumnRE', 'modsSIL'],
    };

    const offerString = '.ABCDEEFFGGHHIJKKKKLMNOOOZQR';
    const side = GameBoard.side === COLOURS.WHITE ? 'white' : 'black';
    const arcaneConfig =
      side === 'white' ? whiteArcaneConfig : blackArcaneConfig;
    const pieceToOfferings =
      side === 'white' ? whitePieceToOfferings : blackPieceToOfferings;

    const offeringNumbers = pieceToOfferings[promoted];

    ClearPiece(from);

    if (Array.isArray(offeringNumbers) && offeringNumbers.length > 0) {
      const offerSymbol = offerString.charAt(promoted);
      const offrKey = `offr${offerSymbol}`;
      const have = arcaneConfig[offrKey] ?? 0;

      if (have <= 0) {
        // illegal: no token to redeem
        AddPiece(from, captured);
        return BOOL.FALSE;
      }

      // Only mutate configs on *committed* user moves
      if (commit) {
        arcaneConfig[offrKey] = have - 1; // spend first

        for (const gift of offeringNumbers) {
          if (typeof gift === 'string') {
            arcaneConfig[gift] = (arcaneConfig[gift] ?? 0) + 1;
          } else {
            const sumnKey = `sumn${PceChar.charAt(gift).toUpperCase()}`;
            arcaneConfig[sumnKey] = (arcaneConfig[sumnKey] ?? 0) + 1;
          }
        }

        // mark that we actually redeemed, so TakeMove knows to undo
        GameBoard.history[GameBoard.hisPly].offering = {
          offrKey,
          gifts: offeringNumbers.slice(),
        };
      }

      // If not commit: we don’t touch arcaneConfig at all (search stays side-effect free)
    }
  }

  if (
    SqAttacked(
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side ^ 1], 0)],
      GameBoard.side
    )
  ) {
    GameBoard.checksGiven[GameBoard.side]++;
  }

  GameBoard.hisPly++;
  GameBoard.ply++;

  trimHistory(moveType === 'userMove');

  if (moveType === 'userMove' && GameBoard.dyad > 0) {
    GameBoard.dyadClock++;
    if (GameBoard.dyadClock >= 2) {
      whiteArcaneConfig[GameBoard.dyadName] -= 1;
      GameBoard.dyad = 0;
      GameBoard.dyadClock = 0;
      GameBoard.dyadName = '';

      GameBoard.side ^= 1;
      HASH_SIDE();
    }
  } else {
    GameBoard.side ^= 1;
    HASH_SIDE();
  }

  if (!move) {
    console.log('make move error', move);
  }

  if (SqAttacked(GameBoard.pList[PCEINDEX(Kings[side], 0)], side ^ 1)) {
    TakeMove();
    return BOOL.FALSE;
  }
  if (
    SqAttacked(
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
      GameBoard.side ^ 1
    ) &&
    (GameBoard.preset === 'DELIVERANCE' || GameBoard.suspend > 0)
  ) {
    TakeMove();
    return BOOL.FALSE;
  }

  return BOOL.TRUE;
}

// take move
export function TakeMove(wasDyadMove = false) {
  if (GameBoard.hisPly > 0) GameBoard.hisPly--;
  if (GameBoard.ply > 0) GameBoard.ply--;

  GameBoard.dyad = GameBoard.history[GameBoard.hisPly].dyad;
  GameBoard.dyadClock = GameBoard.history[GameBoard.hisPly].dyadClock;

  if (wasDyadMove) {
    if (GameBoard.dyadClock > 0) {
      if (GameBoard.dyadClock === 1) {
        GameBoard.dyad = 0;
        GameBoard.dyadClock = 0;
        GameBoard.dyadName = '';
      } else {
        GameBoard.dyadClock++;
        if (GameBoard.dyadClock === 2) {
          whiteArcaneConfig[GameBoard.dyadName] += 1;
          GameBoard.dyad = 0;
          GameBoard.dyadClock = 0;
          GameBoard.dyadName = '';
        }
      }
    }
  } else {
    GameBoard.side ^= 1;
    HASH_SIDE();
  }

  if (
    SqAttacked(
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side ^ 1], 0)],
      GameBoard.side
    )
  ) {
    GameBoard.checksGiven[GameBoard.side]--;
  }

  let move = GameBoard.history[GameBoard.hisPly].move;
  let from = FROMSQ(move);
  let to = TOSQ(move);
  let captured = CAPTURED(move);
  let pieceEpsilon = PROMOTED(move);

  const isShift = (m) => (m & MFLAGSHFT) !== 0;
  const isSummon = (m) => (m & MFLAGSUMN) !== 0;
  const isSwap = (m) => (m & MFLAGSWAP) !== 0;
  const isEp = (m) => (m & MFLAGEP) !== 0;
  const isConsume = (move & MFLAGCNSM) !== 0;

  const promoEpsilon = !isShift(move) ? pieceEpsilon : PIECES.EMPTY;

  const moverAtTo = GameBoard.pieces[to];

  const cfg =
    GameBoard.side === COLOURS.WHITE ? whiteArcaneConfig : blackArcaneConfig;
  const sKey = sumnKeyFromMove(move);
  if (sKey) cfg[sKey] = (cfg[sKey] ?? 0) + 1;
  const shKey = shiftKeyFromMove(move, moverAtTo);
  if (shKey) cfg[shKey] = (cfg[shKey] ?? 0) + 1;

  if (GameBoard.enPas !== SQUARES.NO_SQ) HASH_EP();
  HASH_CA();

  GameBoard.castlePerm = GameBoard.history[GameBoard.hisPly].castlePerm;
  GameBoard.fiftyMove = GameBoard.history[GameBoard.hisPly].fiftyMove;
  GameBoard.enPas = GameBoard.history[GameBoard.hisPly].enPas;

  if (GameBoard.enPas !== SQUARES.NO_SQ) HASH_EP();
  HASH_CA();

  GameBoard.invisibility[0] += 1;
  GameBoard.invisibility[1] += 1;
  GameBoard.suspend += 1;

  if (GameBoard.suspend > 6) GameBoard.suspend = 0;
  if (GameBoard.invisibility[0] > 6) GameBoard.invisibility[0] = 0;
  if (GameBoard.invisibility[1] > 6) GameBoard.invisibility[1] = 0;

  GameBoard.royaltyQ = { ...GameBoard.history[GameBoard.hisPly].royaltyQ };
  GameBoard.royaltyT = { ...GameBoard.history[GameBoard.hisPly].royaltyT };
  GameBoard.royaltyM = { ...GameBoard.history[GameBoard.hisPly].royaltyM };
  GameBoard.royaltyV = { ...GameBoard.history[GameBoard.hisPly].royaltyV };
  GameBoard.royaltyE = { ...GameBoard.history[GameBoard.hisPly].royaltyE };

  if (TOSQ(move) > 0 && move & MFLAGCNSM && !isShift(move)) {
    (GameBoard.side === COLOURS.WHITE
      ? whiteArcaneConfig
      : blackArcaneConfig
    ).modsCON += 1;
  }

  if (move & MFLAGEP) {
    // side is already toggled back to the mover here
    const moverPawn = GameBoard.side === COLOURS.WHITE ? PIECES.wP : PIECES.bP;
    const epSq = GameBoard.side === COLOURS.WHITE ? to - 10 : to + 10;
    const epPawn = GameBoard.side === COLOURS.WHITE ? PIECES.bP : PIECES.wP;

    // Only restore if the shape matches a real EP position
    const looksLikeEP =
      GameBoard.pieces[to] === moverPawn &&
      GameBoard.pieces[epSq] === PIECES.EMPTY;

    if (looksLikeEP) {
      AddPiece(epSq, epPawn);
    }

    // existing pocket rollback (unchanged)
    const epPocket = getPocketCaptureEpsilon(move, GameBoard.side, captured);
    if (
      GameBoard.crazyHouse[GameBoard.side] &&
      epPocket !== PIECES.EMPTY &&
      epPocket !== TELEPORT_CONST &&
      PieceCol[epPocket] !== GameBoard.side
    ) {
      const key = `sumn${PceChar.charAt(epPocket).toUpperCase()}`;
      const cfg =
        GameBoard.side === COLOURS.WHITE
          ? whiteArcaneConfig
          : blackArcaneConfig;
      cfg[key] = (cfg[key] ?? 0) - 1;
    }
  } else if ((MFLAGCA & move) !== 0) {
    // get original rook positions? todo randomize
    // this might be easy because the to square should always be the rook which gives you the original square in the move int
    switch (to) {
      case SQUARES.C1:
        MovePiece(SQUARES.D1, SQUARES.A1);
        break;
      case SQUARES.C8:
        MovePiece(SQUARES.D8, SQUARES.A8);
        break;
      case SQUARES.G1:
        MovePiece(SQUARES.F1, SQUARES.H1);
        break;
      case SQUARES.G8:
        MovePiece(SQUARES.F8, SQUARES.H8);
        break;
      default:
        break;
    }
  }

  if (
    (move & MFLAGSUMN) === 0 &&
    (TOSQ(move) > 0 || CAPTURED(move) === TELEPORT_CONST) &&
    (ARCANEFLAG(move) === 0 ||
      isShift(move) ||
      isEp(move) ||
      (move & MFLAGPS) !== 0 ||
      (isConsume && !isShift(move)))
  ) {
    MovePiece(to, from);
  }

  if (
    to > 0 &&
    captured !== PIECES.EMPTY &&
    captured !== TELEPORT_CONST &&
    (move & (MFLAGSWAP | MFLAGSUMN | MFLAGEP)) === 0
  ) {
    AddPiece(to, captured);
    const pocketCap = getPocketCaptureEpsilon(move, GameBoard.side, captured);

    if (move & MFLAGPS) cfg['modsSUR'] += 1;

    if (
      GameBoard.crazyHouse[GameBoard.side] &&
      pocketCap !== PIECES.EMPTY &&
      pocketCap !== TELEPORT_CONST &&
      PieceCol[pocketCap] !== GameBoard.side
    ) {
      const key = `sumn${PceChar.charAt(pocketCap).toUpperCase()}`;
      const cfg =
        GameBoard.side === COLOURS.WHITE
          ? whiteArcaneConfig
          : blackArcaneConfig;
      cfg[key] = (cfg[key] ?? 0) - 1;
    }
  }

  if (
    TOSQ(move) > 0 &&
    promoEpsilon !== PIECES.EMPTY &&
    !isShift(move) &&
    !isSummon(move) &&
    !isSwap(move)
  ) {
    const L = PceChar.charAt(promoEpsilon).toUpperCase();
    const expectedPromo =
      GameBoard.side === COLOURS.WHITE ? PIECES[`w${L}`] : PIECES[`b${L}`];

    if (GameBoard.pieces[from] === expectedPromo) {
      ClearPiece(from);
      AddPiece(from, GameBoard.side === COLOURS.WHITE ? PIECES.wP : PIECES.bP);
    }
  } else if (TOSQ(move) > 0 && move & MFLAGSUMN) {
    if (promoEpsilon > 0) {
      ClearPiece(to, true);
    }
  } else if (TOSQ(move) > 0 && move & MFLAGSWAP) {
    const putBack = GameBoard.pieces[from];

    ClearPiece(from);
    MovePiece(to, from);
    AddPiece(to, putBack);

    const swapType = isSwap(move) ? pieceEpsilon : PIECES.EMPTY;
    if (GameBoard.side === COLOURS.WHITE) {
      if (swapType === ARCANE_BIT_VALUES.DEP) whiteArcaneConfig.swapDEP += 1;
      if (swapType === ARCANE_BIT_VALUES.ADJ) whiteArcaneConfig.swapADJ += 1;
    } else {
      if (swapType === ARCANE_BIT_VALUES.DEP) blackArcaneConfig.swapDEP += 1;
      if (swapType === ARCANE_BIT_VALUES.ADJ) blackArcaneConfig.swapADJ += 1;
    }
  }

  // should only ever be offering moves
  else if (TOSQ(move) === 0 && FROMSQ(move) > 0 && CAPTURED(move) > 0) {
    const side = GameBoard.side === COLOURS.WHITE ? 'white' : 'black';
    const arcaneConfig =
      side === 'white' ? whiteArcaneConfig : blackArcaneConfig;

    AddPiece(from, captured);

    const h = GameBoard.history[GameBoard.hisPly];
    if (h.offering) {
      const { offrKey, gifts } = h.offering;

      // remove gifts first
      for (const gift of gifts) {
        if (typeof gift === 'string') {
          arcaneConfig[gift] = (arcaneConfig[gift] ?? 0) - 1;
        } else {
          const sumnKey = `sumn${PceChar.charAt(gift).toUpperCase()}`;
          arcaneConfig[sumnKey] = (arcaneConfig[sumnKey] ?? 0) - 1;
        }
      }
      // restore the token
      arcaneConfig[offrKey] = (arcaneConfig[offrKey] ?? 0) + 1;

      h.offering = undefined; // clear marker
    }
  }
}
