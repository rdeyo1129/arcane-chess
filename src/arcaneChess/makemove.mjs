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
import { ARCANEFLAG, PrintBoard, SideText } from './board.mjs';
import { PrMove, PrintMoveList } from './io';
import { ARCANE_BIT_VALUES } from './defs.mjs';

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

export function MakeMove(move) {
  let from = FROMSQ(move);
  let to = TOSQ(move);
  let side = GameBoard.side;

  GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;

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

  // here to include arcane flags and a move array to account for dayd messaging
  // use GameBoard.dyadClock to access move array
  // history to also include messages about arcanes being used, property somehow?

  // take move
  // todo put a loop for dyad takebacks
  // todo pretty history for all other moves and events
  // todo io check checkmate draw
  // todo variant endings
  // todo arcane brain
  // todo testing
  // todo start ui

  GameBoard.invisibility[0] -= 1;
  GameBoard.invisibility[1] -= 1;
  // if > 0 ?
  GameBoard.suspend -= 1;

  _.forEach(GameBoard.royaltyQ, (value, key) => {
    GameBoard.royaltyQ[key] -= 1;
  });
  _.forEach(GameBoard.royaltyT, (value, key) => {
    GameBoard.royaltyT[key] -= 1;
  });
  _.forEach(GameBoard.royaltyM, (value, key) => {
    GameBoard.royaltyM[key] -= 1;
  });
  _.forEach(GameBoard.royaltyV, (value, key) => {
    GameBoard.royaltyV[key] -= 1;
  });
  _.forEach(GameBoard.royaltyE, (value, key) => {
    GameBoard.royaltyE[key] -= 1;
  });

  if (GameBoard.pass) {
    GameBoard.history[GameBoard.hisPly].move = 0;
    GameBoard.history[GameBoard.hisPly].prettyHistory = [
      SideText + ' passes turn.',
    ];

    console.log('passes');

    if (InCheck()) {
      GameBoard.pass = false;
      return BOOL.FALSE;
    }

    HASH_CA();
    GameBoard.pass = false;
    GameBoard.side ^= 1;
    HASH_SIDE();

    return BOOL.TRUE;
  }

  if (GameBoard.dyad > 0) {
    GameBoard.history[GameBoard.hisPly].move = move;
    GameBoard.history[GameBoard.hisPly].prettyHistory = [];
    GameBoard.history[GameBoard.hisPly].prettyHistory.push(PrMove(move));
  } else {
    // to have mutiple moves in one turn like invisibility and and swap
    GameBoard.history[GameBoard.hisPly].move = move;
    GameBoard.history[GameBoard.hisPly].prettyHistory = [];
    // GameBoard.history[GameBoard.hisPly].prettyHistory.push(PrMove(move));
  }
  GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
  GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
  GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;

  GameBoard.castlePerm &= CastlePerm[from];
  GameBoard.castlePerm &= CastlePerm[to];
  GameBoard.enPas = SQUARES.NO_SQ;

  HASH_CA();

  let captured = CAPTURED(move);
  let pieceEpsilon = PROMOTED(move);

  GameBoard.fiftyMove++;

  if (captured !== PIECES.EMPTY && (move & MFLAGSWAP) === 0) {
    ClearPiece(to);
    GameBoard.fiftyMove = 0;
    if (GameBoard.crazyHouse[GameBoard.side]) {
      if (GameBoard.side === COLOURS.WHITE) {
        whiteArcaneConfig[
          `sumn${PceChar.split('')[captured].toUpperCase()}`
        ] += 1;
      } else {
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

  if (ARCANEFLAG(move) === 0 || move & MFLAGCNSM || move & MFLAGSHFT) {
    MovePiece(from, to);
  }
  if (move & MFLAGCNSM) {
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.modsCON -= 1;
    } else {
      blackArcaneConfig.modsCON -= 1;
    }
  }
  if (move & MFLAGSHFT) {
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig[
        `shft${PceChar.split('')[GameBoard.pieces[from]].toUpperCase()}`
      ] -= 1;
    } else {
      blackArcaneConfig[
        `shft${PceChar.split('')[GameBoard.pieces[from]].toUpperCase()}`
      ] -= 1;
    }
  }

  if (
    pieceEpsilon !== PIECES.EMPTY &&
    (ARCANEFLAG(move) === 0 || move & MFLAGCNSM)
  ) {
    ClearPiece(to);
    AddPiece(to, pieceEpsilon);
  } else if (move & MFLAGSUMN) {
    if (pieceEpsilon > 27 || pieceEpsilon === ARCANE_BIT_VALUES.RV) {
      GameBoard[`royalty${PceChar.split('')[pieceEpsilon]}`][to] = 4;
    } else {
      AddPiece(to, pieceEpsilon, true);
    }
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig[
        `sumn${
          pieceEpsilon > 27 || pieceEpsilon === ARCANE_BIT_VALUES.RV ? 'R' : ''
        }${PceChar.split('')[pieceEpsilon].toUpperCase()}`
      ] -= 1;
    } else {
      blackArcaneConfig[
        `sumn${
          pieceEpsilon > 27 || pieceEpsilon === ARCANE_BIT_VALUES.RV ? 'R' : ''
        }${PceChar.split('')[pieceEpsilon].toUpperCase()}`
      ] -= 1;
    }
  } else if (move & MFLAGSWAP) {
    ClearPiece(to);
    MovePiece(from, to);
    AddPiece(from, captured);
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.swapATK -= 1;
      whiteArcaneConfig.swapDEP -= 1;
      whiteArcaneConfig.swapADJ -= 1;
    } else {
      blackArcaneConfig.swapATK -= 1;
      blackArcaneConfig.swapDEP -= 1;
      blackArcaneConfig.swapADJ -= 1;
    }
  }

  if (
    SqAttacked(
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
      GameBoard.side ^ 1
    )
  ) {
    GameBoard.checks[GameBoard.side]++;
  }

  if (GameBoard.dyad > 0) {
    GameBoard.dyadClock += 1;
  } else {
    GameBoard.side ^= 1;
    HASH_SIDE();
  }

  if (
    GameBoard.dyad === 0 ||
    GameBoard.dyadClock === GameBoard.dyadMax[GameBoard.side]
  ) {
    GameBoard.hisPly++;
    GameBoard.ply++;
  }

  if (!move) {
    console.log('make move error', move);
  }

  if (
    SqAttacked(
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side ^ 1], 0)],
      GameBoard.side
    ) ||
    GameBoard.suspend > 0
  ) {
    TakeMove();
    return BOOL.FALSE;
  }
  if (
    SqAttacked(
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
      GameBoard.side ^ 1
    ) &&
    GameBoard.racingKings
  ) {
    TakeMove();
    return BOOL.FALSE;
  }

  return BOOL.TRUE;
}

// take move
export function TakeMove() {
  if (GameBoard.dyad === 0) {
    GameBoard.hisPly--;
    GameBoard.ply--;
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

  _.forEach(GameBoard.royaltyQ, (value, key) => {
    GameBoard.royaltyQ[key] += 1;
  });
  _.forEach(GameBoard.royaltyT, (value, key) => {
    GameBoard.royaltyT[key] += 1;
  });
  _.forEach(GameBoard.royaltyM, (value, key) => {
    GameBoard.royaltyM[key] += 1;
  });
  _.forEach(GameBoard.royaltyV, (value, key) => {
    GameBoard.royaltyV[key] += 1;
  });
  _.forEach(GameBoard.royaltyE, (value, key) => {
    GameBoard.royaltyE[key] += 1;
  });

  let captured = CAPTURED(move);
  let pieceEpsilon = PROMOTED(move);

  if (GameBoard.dyad === 0) {
    GameBoard.side ^= 1;
    HASH_SIDE();
  }

  if (move & MFLAGCNSM) {
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.modsCON += 1;
    } else {
      blackArcaneConfig.modsCON += 1;
    }
  }
  if (move & MFLAGSHFT) {
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig[
        `shft${PceChar.split('')[GameBoard.pieces[from]].toUpperCase()}`
      ] += 1;
    } else {
      blackArcaneConfig[
        `shft${PceChar.split('')[GameBoard.pieces[from]].toUpperCase()}`
      ] += 1;
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
    ARCANEFLAG(move) === 0 ||
    move & MFLAGCNSM ||
    move & MFLAGSHFT ||
    move & MFLAGEP
  ) {
    MovePiece(to, from);
  }

  if (captured !== PIECES.EMPTY && (move & MFLAGSWAP) === 0) {
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
    SqAttacked(
      GameBoard.pList[PCEINDEX(Kings[GameBoard.side ^ 1], 0)],
      GameBoard.side
    )
  ) {
    GameBoard.checks[GameBoard.side ^ 1]--;
  }

  if (
    pieceEpsilon !== PIECES.EMPTY &&
    (move & MFLAGSUMN) === 0 &&
    (move & MFLAGSWAP) === 0
  ) {
    ClearPiece(from);
    AddPiece(
      from,
      PieceCol[pieceEpsilon] === COLOURS.WHITE ? PIECES.wP : PIECES.bP
    );
  } else if (move & MFLAGSUMN) {
    if (pieceEpsilon > 27 || pieceEpsilon === ARCANE_BIT_VALUES.RV) {
      GameBoard[`royalty${PceChar.split('')[pieceEpsilon]}`][to] = -500;
    } else {
      ClearPiece(to, true);
    }
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig[
        `sumn${
          pieceEpsilon > 27 || pieceEpsilon === ARCANE_BIT_VALUES.RV ? 'R' : ''
        }${PceChar.split('')[pieceEpsilon].toUpperCase()}`
      ] += 1;
    } else {
      blackArcaneConfig[
        `sumn${
          pieceEpsilon > 27 || pieceEpsilon === ARCANE_BIT_VALUES.RV ? 'R' : ''
        }${PceChar.split('')[pieceEpsilon].toUpperCase()}`
      ] += 1;
    }
  } else if (move & MFLAGSWAP) {
    ClearPiece(from);
    MovePiece(to, from);
    AddPiece(to, captured);
    if (GameBoard.side === COLOURS.WHITE) {
      whiteArcaneConfig.swapATK += 1;
      whiteArcaneConfig.swapDEP += 1;
      whiteArcaneConfig.swapADJ += 1;
    } else {
      blackArcaneConfig.swapATK += 1;
      blackArcaneConfig.swapDEP += 1;
      blackArcaneConfig.swapADJ += 1;
    }
  }
}
