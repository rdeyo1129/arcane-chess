import _ from 'lodash';

// import all vars and functions from arcanechess folder that are not defined
import {
  GameBoard,
  FROMSQ,
  TOSQ,
  CAPTURED,
  PROMOTED,
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
  InCheck,
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
} from './defs';
import { ARCANEFLAG } from './board.mjs';
import { ARCANE_BIT_VALUES, RtyChar } from './defs.mjs';

const royaltyIndexMapRestructure = [0, 30, 31, 32, 33, 34, 35, 36, 37];

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

export function MakeMove(move, moveType = '') {
  let from = FROMSQ(move);
  let to = TOSQ(move);
  let side = GameBoard.side;

  GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;
  GameBoard.history[GameBoard.hisPly].dyad = GameBoard.dyad;
  GameBoard.history[GameBoard.hisPly].dyadClock = GameBoard.dyadClock;

  // const getWhiteKingPos = _.indexOf(GameBoard.pieces, 6, 22);
  const getWhiteKingRookPos = _.lastIndexOf(GameBoard.pieces, 4);
  const getWhiteQueenRookPos = _.indexOf(GameBoard.pieces, 4, 22);

  // const getBlackKingPos = _.indexOf(GameBoard.pieces, 12, 92);
  const getBlackKingRookPos = _.lastIndexOf(GameBoard.pieces, 10);
  const getBlackQueenRookPos = _.indexOf(GameBoard.pieces, 10, 92);

  if ((move & MFLAGEP) !== 0) {
    if (side === COLOURS.WHITE) {
      ClearPiece(to - 10);
    } else {
      ClearPiece(to + 10);
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
  // if > 0 ?
  GameBoard.suspend -= 1;

  GameBoard.history[GameBoard.hisPly].royaltyQ = { ...GameBoard.royaltyQ };
  GameBoard.history[GameBoard.hisPly].royaltyT = { ...GameBoard.royaltyT };
  GameBoard.history[GameBoard.hisPly].royaltyM = { ...GameBoard.royaltyM };
  GameBoard.history[GameBoard.hisPly].royaltyV = { ...GameBoard.royaltyV };
  GameBoard.history[GameBoard.hisPly].royaltyE = { ...GameBoard.royaltyE };
  GameBoard.history[GameBoard.hisPly].royaltyX = { ...GameBoard.royaltyX };

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
  _.forEach(GameBoard.royaltyX, (value, key) => {
    if (value !== undefined && value > 0) {
      GameBoard.royaltyX[key] -= 1;
      if (
        GameBoard.royaltyX[key] <= 0 &&
        GameBoard.pieces[key] === PIECES.EXILE
      ) {
        ClearPiece(key);
      }
    }
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

  let captured = CAPTURED(move);
  let pieceEpsilon = PROMOTED(move);

  const isPassMove =
    TOSQ(move) === 0 &&
    FROMSQ(move) === 0 &&
    captured === 0 &&
    pieceEpsilon === 31 &&
    ARCANEFLAG(move) === 0;

  GameBoard.fiftyMove++;

  if (isPassMove) {
    if (InCheck()) {
      return BOOL.FALSE;
    }

    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.modsSKI -= 1;
    }
    if (GameBoard.side === COLOURS.BLACK) {
      blackArcaneConfig.modsSKI -= 1;
    }

    GameBoard.hisPly++;
    GameBoard.ply++;

    GameBoard.side ^= 1;
    HASH_SIDE();

    if (SqAttacked(GameBoard.pList[PCEINDEX(Kings[side], 0)], side ^ 1)) {
      TakeMove();
      return BOOL.FALSE;
    }

    return BOOL.TRUE;
  }

  if (
    TOSQ(move) > 0 &&
    captured !== PIECES.EMPTY &&
    (move & MFLAGSWAP) === 0 &&
    (move & MFLAGSUMN) === 0
  ) {
    ClearPiece(to);
    GameBoard.fiftyMove = 0;
    if (GameBoard.crazyHouse[GameBoard.side]) {
      if (GameBoard.side === COLOURS.WHITE) {
        if (
          !whiteArcaneConfig[`sumn${PceChar.split('')[captured].toUpperCase()}`]
        )
          whiteArcaneConfig[
            `sumn${PceChar.split('')[captured].toUpperCase()}`
          ] = 0;
        whiteArcaneConfig[
          `sumn${PceChar.split('')[captured].toUpperCase()}`
        ] += 1;
      } else {
        if (
          !blackArcaneConfig[`sumn${PceChar.split('')[captured].toUpperCase()}`]
        )
          blackArcaneConfig[
            `sumn${PceChar.split('')[captured].toUpperCase()}`
          ] = 0;
        blackArcaneConfig[
          `sumn${PceChar.split('')[captured].toUpperCase()}`
        ] += 1;
      }
    }
  }

  if (PiecePawn[GameBoard.pieces[from]] === BOOL.TRUE) {
    GameBoard.fiftyMove = 0;
    if ((move & MFLAGPS) !== 0) {
      if (side === COLOURS.WHITE) {
        GameBoard.enPas = from + 10;
      } else {
        GameBoard.enPas = from - 10;
      }
      HASH_EP();
    }
  }

  if (
    (TOSQ(move) > 0 && ARCANEFLAG(move) === 0) ||
    move & MFLAGCNSM ||
    move & MFLAGSHFT
  ) {
    MovePiece(from, to);
  }
  if (TOSQ(move) > 0 && move & MFLAGCNSM) {
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.modsCON -= 1;
    } else {
      blackArcaneConfig.modsCON -= 1;
    }
  }
  if (TOSQ(move) > 0 && ARCANEFLAG(move) && move & MFLAGSHFT) {
    const shiftType =
      pieceEpsilon > 0
        ? 'T'
        : PceChar.split('')[GameBoard.pieces[to]].toUpperCase();
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig[`shft${shiftType}`] -= 1;
    } else {
      blackArcaneConfig[`shft${shiftType}`] -= 1;
    }
  }

  if (
    TOSQ(move) > 0 &&
    pieceEpsilon !== PIECES.EMPTY &&
    (move & MFLAGSHFT) === 0 &&
    (ARCANEFLAG(move) === 0 || move & MFLAGCNSM)
  ) {
    ClearPiece(to);
    AddPiece(to, pieceEpsilon);
  } else if (TOSQ(move) > 0 && move & MFLAGSUMN) {
    if (captured > 0) {
      if (captured === 6) {
        // file bind
        let onesDigit = to % 10;
        _.times(8, (i) => {
          const rank = (i + 2) * 10;
          const square = rank + onesDigit;
          if (GameBoard.royaltyQ[square] > 0) GameBoard.royaltyQ[square] = 0;
          if (GameBoard.royaltyT[square] > 0) GameBoard.royaltyT[square] = 0;
          if (GameBoard.royaltyM[square] > 0) GameBoard.royaltyM[square] = 0;
          if (GameBoard.royaltyV[square] > 0) GameBoard.royaltyV[square] = 0;
          GameBoard.royaltyE[square] = 8;
        });
      } else if (captured === 7) {
        // rank bind
        const tensDigit = Math.floor(to / 10) * 10;
        _.times(8, (i) => {
          // i aligns with a file ones spot each time
          const onesDigit = i + 1;
          const square = tensDigit + onesDigit;
          if (GameBoard.royaltyQ[square] > 0) GameBoard.royaltyQ[square] = 0;
          if (GameBoard.royaltyT[square] > 0) GameBoard.royaltyT[square] = 0;
          if (GameBoard.royaltyM[square] > 0) GameBoard.royaltyM[square] = 0;
          if (GameBoard.royaltyV[square] > 0) GameBoard.royaltyV[square] = 0;
          GameBoard.royaltyE[square] = 8;
        });
      } else if (captured === 8) {
        const tombSquare = [-11, -10, -9, -1, 0, 1, 9, 10, 11];
        _.forEach(tombSquare, (offset) => {
          const sq = TOSQ(move) + offset;
          if (GameBoard.royaltyQ[sq] > 0) GameBoard.royaltyQ[sq] = 0;
          if (GameBoard.royaltyT[sq] > 0) GameBoard.royaltyT[sq] = 0;
          if (GameBoard.royaltyM[sq] > 0) GameBoard.royaltyM[sq] = 0;
          if (GameBoard.royaltyV[sq] > 0) GameBoard.royaltyV[sq] = 0;
          if (GameBoard.pieces[sq] === PIECES.EXILE) return;
          if (GameBoard.pieces[sq] === PIECES.EMPTY) {
            AddPiece(sq, PIECES.EXILE);
            GameBoard.royaltyX[sq] = 8;
          } else {
            GameBoard.royaltyE[sq] = 8;
          }
        });
      } else if (
        GameBoard[
          `royalty${RtyChar.split('')[royaltyIndexMapRestructure[captured]]}`
        ][to] === undefined ||
        GameBoard[
          `royalty${RtyChar.split('')[royaltyIndexMapRestructure[captured]]}`
        ][to] <= 0
      ) {
        GameBoard[
          `royalty${RtyChar.split('')[royaltyIndexMapRestructure[captured]]}`
        ][to] = 8;
      }
    } else if (pieceEpsilon > 0) {
      AddPiece(to, pieceEpsilon, true);
    }
    if (GameBoard.side === COLOURS.WHITE) {
      if (pieceEpsilon > 0 || captured > 0) {
        whiteArcaneConfig[
          `sumn${captured > 0 ? 'R' : ''}${
            captured > 0
              ? RtyChar.split('')[royaltyIndexMapRestructure[captured]]
              : PceChar.split('')[pieceEpsilon].toUpperCase()
          }`
        ] -= 1;
      }
    } else {
      if (pieceEpsilon > 0 || captured > 0) {
        blackArcaneConfig[
          `sumn${captured > 0 ? 'R' : ''}${
            captured > 0
              ? RtyChar.split('')[royaltyIndexMapRestructure[captured]]
              : PceChar.split('')[pieceEpsilon].toUpperCase()
          }`
        ] -= 1;
      }
    }
  } else if (TOSQ(move) > 0 && move & MFLAGSWAP) {
    ClearPiece(to);
    MovePiece(from, to);
    AddPiece(from, captured);
    if (GameBoard.side === COLOURS.WHITE) {
      if (pieceEpsilon === ARCANE_BIT_VALUES.DEP) {
        whiteArcaneConfig.swapDEP -= 1;
      }
      if (pieceEpsilon === ARCANE_BIT_VALUES.ADJ) {
        whiteArcaneConfig.swapADJ -= 1;
      }
    } else {
      if (pieceEpsilon === ARCANE_BIT_VALUES.DEP) {
        blackArcaneConfig.swapDEP -= 1;
      }
      if (pieceEpsilon === ARCANE_BIT_VALUES.ADJ) {
        blackArcaneConfig.swapADJ -= 1;
      }
    }
  }

  // should only ever be offering moves
  else if (TOSQ(move) === 0 && FROMSQ(move) > 0 && CAPTURED(move) > 0) {
    const promoted = PROMOTED(move);
    const whitePieceToOfferings = {
      1: [PIECES.wH],
      2: [PIECES.wR, PIECES.wB],
      3: [PIECES.wN, PIECES.wZ, PIECES.wU],
      4: [PIECES.wB],
      5: [PIECES.wN],
      6: [PIECES.wZ],
      7: [PIECES.wU],
      8: [PIECES.wM],
      9: [captured],
    };
    const blackPieceToOfferings = {
      1: [PIECES.bH],
      2: [PIECES.bR, PIECES.bB],
      3: [PIECES.bN, PIECES.bZ, PIECES.bU],
      4: [PIECES.bB],
      5: [PIECES.bN],
      6: [PIECES.bZ],
      7: [PIECES.bU],
      8: [PIECES.bM],
      9: [captured],
    };

    const offerString = '.HSMCCCCRA';
    const side = GameBoard.side === COLOURS.WHITE ? 'white' : 'black';
    const arcaneConfig =
      side === 'white' ? whiteArcaneConfig : blackArcaneConfig;
    const pieceToOfferings =
      side === 'white' ? whitePieceToOfferings : blackPieceToOfferings;

    const offeringNumbers = pieceToOfferings[promoted];

    ClearPiece(from);

    if (offeringNumbers && offeringNumbers.length > 0) {
      const offerSymbol =
        (captured === PIECES.wR || captured === PIECES.bR) &&
        (promoted === 4 || promoted === 5 || promoted === 6 || promoted === 7)
          ? 'E'
          : offerString.split('')[promoted];
      const offrKey = `offr${offerSymbol}`;
      for (const offeringNumber of offeringNumbers) {
        const sumnKey = `sumn${PceChar.split('')[offeringNumber]}`;
        if (!arcaneConfig[sumnKey]) {
          arcaneConfig[sumnKey] = 0;
        }
        arcaneConfig[sumnKey] += 1;
      }
      arcaneConfig[offrKey] -= 1;
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
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
      GameBoard.side ^ 1
    )
  ) {
    GameBoard.checksGiven[GameBoard.side ^ 1]--;
  }

  let move = GameBoard.history[GameBoard.hisPly].move;
  let from = FROMSQ(move);
  let to = TOSQ(move);
  // let swapPiece = GameBoard.pieces[to];

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

  GameBoard.royaltyQ = { ...GameBoard.history[GameBoard.hisPly].royaltyQ };
  GameBoard.royaltyT = { ...GameBoard.history[GameBoard.hisPly].royaltyT };
  GameBoard.royaltyM = { ...GameBoard.history[GameBoard.hisPly].royaltyM };
  GameBoard.royaltyV = { ...GameBoard.history[GameBoard.hisPly].royaltyV };
  GameBoard.royaltyE = { ...GameBoard.history[GameBoard.hisPly].royaltyE };
  GameBoard.royaltyX = { ...GameBoard.history[GameBoard.hisPly].royaltyX };

  _.forEach(GameBoard.royaltyX, (value, key) => {
    if (value !== undefined && value > 0) {
      if (GameBoard.pieces[key] !== PIECES.EXILE) {
        AddPiece(key, PIECES.EXILE);
      }
    } else {
      if (GameBoard.pieces[key] === PIECES.EXILE) {
        ClearPiece(key);
      }
    }
  });

  let captured = CAPTURED(move);
  let pieceEpsilon = PROMOTED(move);

  const isPassMove =
    TOSQ(move) === 0 &&
    FROMSQ(move) === 0 &&
    captured === 0 &&
    pieceEpsilon === 31 &&
    ARCANEFLAG(move) === 0;

  if (isPassMove) {
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.modsSKI += 1;
    }
    if (GameBoard.side === COLOURS.BLACK) {
      blackArcaneConfig.modsSKI += 1;
    }
    return;
  }

  if (TOSQ(move) > 0 && ARCANEFLAG(move) && move & MFLAGCNSM) {
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.modsCON += 1;
    } else {
      blackArcaneConfig.modsCON += 1;
    }
  }
  if (TOSQ(move) > 0 && ARCANEFLAG(move) && move & MFLAGSHFT) {
    const shiftType =
      pieceEpsilon > 0
        ? 'T'
        : PceChar.split('')[GameBoard.pieces[to]].toUpperCase();
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig[`shft${shiftType}`] += 1;
    } else {
      blackArcaneConfig[`shft${shiftType}`] += 1;
    }
  }

  if ((MFLAGEP & move) !== 0) {
    if (GameBoard.side === COLOURS.WHITE) {
      AddPiece(to - 10, PIECES.bP);
    } else {
      AddPiece(to + 10, PIECES.wP);
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
    TOSQ(move) > 0 &&
    (ARCANEFLAG(move) === 0 ||
      move & MFLAGCNSM ||
      move & MFLAGSHFT ||
      move & MFLAGEP)
  ) {
    MovePiece(to, from);
  }

  if (
    TOSQ(move) > 0 &&
    captured !== PIECES.EMPTY &&
    (move & MFLAGSWAP) === 0 &&
    (move & MFLAGSUMN) === 0
  ) {
    AddPiece(to, captured);
    if (GameBoard.crazyHouse[GameBoard.side]) {
      if (GameBoard.side === COLOURS.WHITE) {
        whiteArcaneConfig[
          `sumn${PceChar.split('')[captured].toUpperCase()}`
        ] -= 1;
      } else {
        blackArcaneConfig[
          `sumn${PceChar.split('')[captured].toUpperCase()}`
        ] -= 1;
      }
    }
  }

  if (
    TOSQ(move) > 0 &&
    pieceEpsilon !== PIECES.EMPTY &&
    (move & MFLAGSHFT) === 0 &&
    (move & MFLAGSUMN) === 0 &&
    (move & MFLAGSWAP) === 0
  ) {
    ClearPiece(from);
    AddPiece(
      from,
      PieceCol[pieceEpsilon] === COLOURS.WHITE ? PIECES.wP : PIECES.bP
    );
  } else if (TOSQ(move) > 0 && move & MFLAGSUMN) {
    if (pieceEpsilon > 0) {
      ClearPiece(to, true);
    }
    if (captured === 8) {
      const tombSquare = [-11, -10, -9, -1, 0, 1, 9, 10, 11];
      _.forEach(tombSquare, (offset) => {
        const sq = TOSQ(move) + offset;
        if (
          (GameBoard.royaltyX[sq] <= 0 || !GameBoard.royaltyX[sq]) &&
          GameBoard.pieces[sq] === PIECES.EXILE
        ) {
          ClearPiece(sq);
        }
      });
    }
    if (GameBoard.side === COLOURS.WHITE) {
      if (pieceEpsilon > 0 || captured > 0) {
        whiteArcaneConfig[
          `sumn${captured > 0 ? 'R' : ''}${
            captured > 0
              ? RtyChar.split('')[royaltyIndexMapRestructure[captured]]
              : PceChar.split('')[pieceEpsilon].toUpperCase()
          }`
        ] += 1;
      }
    } else {
      if (pieceEpsilon > 0 || captured > 0) {
        blackArcaneConfig[
          `sumn${captured > 0 ? 'R' : ''}${
            captured > 0
              ? RtyChar.split('')[royaltyIndexMapRestructure[captured]]
              : PceChar.split('')[pieceEpsilon].toUpperCase()
          }`
        ] += 1;
      }
    }
  } else if (TOSQ(move) > 0 && move & MFLAGSWAP) {
    const swapType = PROMOTED(move);
    ClearPiece(from);
    MovePiece(to, from);
    AddPiece(to, captured);
    if (GameBoard.side === COLOURS.WHITE) {
      if (swapType === ARCANE_BIT_VALUES.DEP) {
        whiteArcaneConfig.swapDEP += 1;
      }
      if (swapType === ARCANE_BIT_VALUES.ADJ) {
        whiteArcaneConfig.swapADJ += 1;
      }
    } else {
      if (swapType === ARCANE_BIT_VALUES.DEP) {
        blackArcaneConfig.swapDEP += 1;
      }
      if (swapType === ARCANE_BIT_VALUES.ADJ) {
        blackArcaneConfig.swapADJ += 1;
      }
    }
  }

  // should only ever be offering moves
  else if (TOSQ(move) === 0 && FROMSQ(move) > 0 && CAPTURED(move) > 0) {
    let promoted = PROMOTED(move);
    const whitePieceToOfferings = {
      1: [PIECES.wH],
      2: [PIECES.wR, PIECES.wB],
      3: [PIECES.wN, PIECES.wZ, PIECES.wU],
      4: [PIECES.wB],
      5: [PIECES.wN],
      6: [PIECES.wZ],
      7: [PIECES.wU],
      8: [PIECES.wM],
      9: [captured],
    };
    const blackPieceToOfferings = {
      1: [PIECES.bH],
      2: [PIECES.bR, PIECES.bB],
      3: [PIECES.bN, PIECES.bZ, PIECES.bU],
      4: [PIECES.bB],
      5: [PIECES.bN],
      6: [PIECES.bZ],
      7: [PIECES.bU],
      8: [PIECES.bM],
      9: [captured],
    };

    const offerString = '.HSMCCCCRA';
    const side = GameBoard.side === COLOURS.WHITE ? 'white' : 'black';
    const arcaneConfig =
      side === 'white' ? whiteArcaneConfig : blackArcaneConfig;
    const pieceToOfferings =
      side === 'white' ? whitePieceToOfferings : blackPieceToOfferings;

    const offeringNumbers = pieceToOfferings[promoted];

    AddPiece(from, captured);

    if (offeringNumbers && offeringNumbers.length > 0) {
      const offerSymbol =
        (captured === PIECES.wR || captured === PIECES.bR) &&
        (promoted === 4 || promoted === 5 || promoted === 6 || promoted === 7)
          ? 'E'
          : offerString.split('')[promoted];
      const offrKey = `offr${offerSymbol}`;
      for (const offeringNumber of offeringNumbers) {
        const sumnKey = `sumn${PceChar.split('')[offeringNumber]}`;
        arcaneConfig[sumnKey] -= 1;
      }
      arcaneConfig[offrKey] += 1;
    }
  }
}
