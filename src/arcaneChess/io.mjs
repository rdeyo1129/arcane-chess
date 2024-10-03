import _ from 'lodash';
import {
  GameBoard,
  FROMSQ,
  TOSQ,
  CAPTURED,
  PROMOTED,
  ARCANEFLAG,
  MFLAGSHFT,
  MFLAGCNSM,
  MFLAGSUMN,
  MFLAGSWAP,
  MFLAGCA,
  MFLAGEP,
} from './board';
import {
  NOMOVE,
  FileChar,
  RankChar,
  FilesBrd,
  RanksBrd,
  PIECES,
  BOOL,
  COLOURS,
  PceChar,
  RtyChar,
  RANKS,
} from './defs';
import { GenerateMoves, generatePowers } from './movegen';
import { MakeMove, TakeMove } from './makemove';
import { ARCANE_BIT_VALUES, prettyToSquare } from './defs.mjs';

export function PrSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

// todo update to allow swapping your pawns into promotion, but not your opponents

const isInitPromotion = (move) => {
  if (GameBoard.pieces[FROMSQ(move)] === PIECES.wP) {
    if (
      GameBoard.whiteArcane[4] & 16 &&
      RanksBrd[TOSQ(move)] === RANKS.RANK_7
    ) {
      return true;
    }
    if (RanksBrd[TOSQ(move)] === RANKS.RANK_8) {
      return true;
    }
  } else if (GameBoard.pieces[FROMSQ(move)] === PIECES.bP) {
    if (
      GameBoard.blackArcane[4] & 16 &&
      RanksBrd[TOSQ(move)] === RANKS.RANK_2
    ) {
      return true;
    }
    if (RanksBrd[TOSQ(move)] === RANKS.RANK_1) {
      return true;
    }
  }
  return false;
};

export function PrMove(move, returnType) {
  const getPceChar = (pieceNum) => {
    return PceChar.split('')[pieceNum];
  };

  let MvStr;
  let tempFrom = FROMSQ(move) || 100;

  let ff = FilesBrd[tempFrom];
  let rf = RanksBrd[tempFrom];
  let ft = FilesBrd[TOSQ(move)];
  let rt = RanksBrd[TOSQ(move)];

  // promoted, summon, swap
  let pieceEpsilon = PROMOTED(move);
  let pchar;

  // normal quiet
  if (CAPTURED(move) === 0 && pieceEpsilon === 0 && ARCANEFLAG(move) === 0) {
    MvStr =
      getPceChar(GameBoard.pieces[TOSQ(move)]) +
      FileChar[ff] +
      RankChar[rf] +
      FileChar[ft] +
      RankChar[rt];
  }
  // normal capture
  if (
    CAPTURED(move) > 0 &&
    pieceEpsilon === 0 &&
    !(move & MFLAGSWAP)
    // &&
    // !(move & MFLAGOFFR)
  ) {
    MvStr =
      getPceChar(GameBoard.pieces[TOSQ(move)]) +
      FileChar[ff] +
      RankChar[rf] +
      'x' +
      getPceChar(CAPTURED(move)) +
      FileChar[ft] +
      RankChar[rt];
  }
  // consume capture
  if (move & MFLAGCNSM && pieceEpsilon !== 0) {
    MvStr =
      getPceChar(GameBoard.pieces[TOSQ(move)]) +
      FileChar[ff] +
      RankChar[rf] +
      'x' +
      getPceChar(CAPTURED(move)) +
      FileChar[ft] +
      RankChar[rt];
  }
  // swap
  if (move & MFLAGSWAP) {
    MvStr =
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
      PrSq(FROMSQ(move)) +
      '&' +
      getPceChar(GameBoard.pieces[TOSQ(move)]) +
      PrSq(TOSQ(move));
  }
  // summon
  if (move & MFLAGSUMN) {
    if (
      CAPTURED(move) === ARCANE_BIT_VALUES.RQ ||
      CAPTURED(move) === ARCANE_BIT_VALUES.RT ||
      CAPTURED(move) === ARCANE_BIT_VALUES.RM ||
      CAPTURED(move) === ARCANE_BIT_VALUES.RV ||
      CAPTURED(move) === ARCANE_BIT_VALUES.RE
    ) {
      MvStr = 'R' + RtyChar.split('')[CAPTURED(move)] + '@' + PrSq(TOSQ(move));
    } else {
      MvStr = PceChar.split('')[PROMOTED(move)] + '@' + PrSq(TOSQ(move));
    }
  }
  // offer
  // if (move & MFLAGOFFR) {
  //   MvStr = getPceChar(CAPTURED(move)) + '%' + PrSq(FROMSQ(move));
  // }
  // shift
  if (move & MFLAGSHFT) {
    MvStr =
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
      PrSq(FROMSQ(move)) +
      '^' +
      PrSq(TOSQ(move));
  }
  // promotion
  if (pieceEpsilon !== 0 && !(move & MFLAGSUMN) && !(move & MFLAGSWAP)) {
    MvStr =
      `${GameBoard.side === COLOURS.WHITE ? 'P' : 'p'}` +
      FileChar[ff] +
      RankChar[rf] +
      (CAPTURED(move) & 0 || !(move & MFLAGCNSM)
        ? ''
        : `x${getPceChar(GameBoard.pieces[TOSQ(move)])}`) +
      FileChar[ft] +
      RankChar[rt];

    if (pieceEpsilon === PIECES.wQ) {
      pchar = '=Q';
    }
    if (pieceEpsilon === PIECES.bQ) {
      pchar = '=q';
    }
    if (pieceEpsilon === PIECES.wT) {
      pchar = '=T';
    }
    if (pieceEpsilon === PIECES.bT) {
      pchar = '=t';
    }
    if (pieceEpsilon === PIECES.wM) {
      pchar = '=M';
    }
    if (pieceEpsilon === PIECES.bM) {
      pchar = '=m';
    }
    if (pieceEpsilon === PIECES.wR) {
      pchar = '=R';
    }
    if (pieceEpsilon === PIECES.bR) {
      pchar = '=r';
    }
    if (pieceEpsilon === PIECES.wB) {
      pchar = '=B';
    }
    if (pieceEpsilon === PIECES.bB) {
      pchar = '=b';
    }
    if (pieceEpsilon === PIECES.wZ) {
      pchar = '=Z';
    }
    if (pieceEpsilon === PIECES.bZ) {
      pchar = '=z';
    }
    if (pieceEpsilon === PIECES.wU) {
      pchar = '=U';
    }
    if (pieceEpsilon === PIECES.bU) {
      pchar = '=u';
    }
    if (pieceEpsilon === PIECES.wS) {
      pchar = '=S';
    }
    if (pieceEpsilon === PIECES.bS) {
      pchar = '=s';
    }
    if (pieceEpsilon === PIECES.wN) {
      pchar = '=N';
    }
    if (pieceEpsilon === PIECES.bN) {
      pchar = '=n';
    }
    if (pieceEpsilon === PIECES.wW) {
      pchar = '=W';
    }
    if (pieceEpsilon === PIECES.bW) {
      pchar = '=w';
    }
    MvStr += pchar;
  }
  // castle
  if (move & MFLAGCA) {
    const WKR = _.lastIndexOf(GameBoard.pieces, 4);
    const WQR = _.indexOf(GameBoard.pieces, 4, 21);
    const BKR = _.lastIndexOf(GameBoard.pieces, 10);
    const BQR = _.indexOf(GameBoard.pieces, 10, 91);

    if (GameBoard.side === COLOURS.WHITE) {
      if (FROMSQ(move) - TOSQ(move) === -2 || TOSQ(move) === WKR) {
        MvStr = 'O-O';
      }
      if (FROMSQ(move) - TOSQ(move) === 2 || TOSQ(move) === WQR) {
        MvStr = 'O-O-O';
      }
    } else {
      if (FROMSQ(move) - TOSQ(move) === -2 || TOSQ(move) === BKR) {
        MvStr = 'O-O';
      }
      if (FROMSQ(move) - TOSQ(move) === 2 || TOSQ(move) === BQR) {
        MvStr = 'O-O-O';
      }
    }
  }
  // EP
  if (move & MFLAGEP) {
    MvStr =
      getPceChar(GameBoard.pieces[TOSQ(move)]) +
      PrSq(FROMSQ(move)) +
      'x' +
      getPceChar(GameBoard.pieces[TOSQ(move)]) +
      PrSq(TOSQ(move)) +
      'ep';
  }

  // from chessground translator
  if (returnType === 'array') {
    return [PrSq(FROMSQ(move)), PrSq(TOSQ(move))];
  }
  return MvStr;
}

export function PrintMoveList() {
  let index;
  let move;
  let num = 1;
  console.log('MoveList:');

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    index++
  ) {
    move = GameBoard.moveList[index];
    console.log(
      'IMove:' +
        num +
        ':(' +
        index +
        '):' +
        PrMove(move) +
        ' Score:' +
        GameBoard.moveScores[index]
    );
    num++;
  }
  console.log('End MoveList');
}

export function ParseMove(
  from,
  to,
  pieceEpsilon = PIECES.EMPTY,
  swapType = '',
  royaltyEpsilon = PIECES.EMPTY
) {
  const royaltyMap = ['.', 'RQ', 'RT', 'RM', 'RV', 'RE', 'RY', 'RZ'];
  const parseSummonOnly = royaltyEpsilon > 0 ? 'PLAYER' : 'COMP';
  const userSummonType =
    pieceEpsilon > 0 ? pieceEpsilon : royaltyMap[royaltyEpsilon];
  generatePowers();
  GenerateMoves(true, false, parseSummonOnly, swapType, userSummonType);

  let Move = NOMOVE;
  let found = BOOL.FALSE;

  for (
    let index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    Move = GameBoard.moveList[index];
    if (
      (from === 0 && TOSQ(Move) === prettyToSquare(to)) ||
      (from !== 0 &&
        FROMSQ(Move) === prettyToSquare(from) &&
        TOSQ(Move) === prettyToSquare(to))
    ) {
      if (isInitPromotion(Move) && PROMOTED(Move) === PIECES.EMPTY) {
        found = BOOL.TRUE;
        break;
      }
      if (Move & MFLAGSWAP && swapType !== '') {
        if (CAPTURED(Move)) {
          found = BOOL.TRUE;
          break;
        }
        continue;
      } else if (Move & MFLAGSUMN) {
        if (pieceEpsilon !== PIECES.EMPTY) {
          found = BOOL.TRUE;
          break;
        } else if (
          CAPTURED(Move) === royaltyEpsilon &&
          royaltyEpsilon !== PIECES.EMPTY
        ) {
          found = BOOL.TRUE;
          break;
        }
        continue;
      } else if (pieceEpsilon !== PIECES.EMPTY) {
        if (PROMOTED(Move) === pieceEpsilon) {
          found = BOOL.TRUE;
          break;
        }
        continue;
      }
      found = BOOL.TRUE;
      break;
    }
  }

  if (found !== BOOL.FALSE) {
    if (MakeMove(Move) === BOOL.FALSE) {
      return {
        parsed: NOMOVE,
        isInitPromotion: isInitPromotion(Move) ? BOOL.TRUE : BOOL.FALSE,
      };
    }
    TakeMove();
    return {
      parsed: Move,
      isInitPromotion: isInitPromotion(Move) ? BOOL.TRUE : BOOL.FALSE,
    };
  }
  return {
    parsed: NOMOVE,
    isInitPromotion: isInitPromotion(Move) ? BOOL.TRUE : BOOL.FALSE,
  };
}
