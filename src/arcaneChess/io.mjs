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
} from './defs';
import { GenerateMoves } from './movegen';
import { MakeMove, TakeMove } from './makemove';
import { ARCANE_BIT_VALUES } from './defs.mjs';

export function PrSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

// todo update to allow swapping your pawns into promotion, but not your opponents

export function PrMove(move) {
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
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
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
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
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
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
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
      pieceEpsilon === ARCANE_BIT_VALUES.RQ ||
      pieceEpsilon === ARCANE_BIT_VALUES.RZ ||
      pieceEpsilon === ARCANE_BIT_VALUES.RU ||
      pieceEpsilon === ARCANE_BIT_VALUES.RV ||
      pieceEpsilon === ARCANE_BIT_VALUES.RE
    ) {
      MvStr = 'R' + getPceChar(pieceEpsilon) + '@' + PrSq(TOSQ(move));
    } else {
      MvStr = getPceChar(pieceEpsilon) + '@' + PrSq(TOSQ(move));
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
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
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
    if (pieceEpsilon === PIECES.wN) {
      pchar = '=N';
    }
    if (pieceEpsilon === PIECES.bN) {
      pchar = '=n';
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
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
      PrSq(FROMSQ(move)) +
      'x' +
      getPceChar(GameBoard.pieces[FROMSQ(move)]) +
      PrSq(TOSQ(move)) +
      'ep';
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

export function ParseMove(from, to) {
  GenerateMoves();

  let Move = NOMOVE;
  let PromPce = PIECES.EMPTY;
  let found = BOOL.FALSE;

  for (
    let index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    Move = GameBoard.moveList[index];
    if (FROMSQ(Move) === from && TOSQ(Move) === to) {
      PromPce = PROMOTED(Move);
      if (PromPce != PIECES.EMPTY) {
        if (
          (PromPce === PIECES.wQ && GameBoard.side === COLOURS.WHITE) ||
          (PromPce === PIECES.bQ && GameBoard.side === COLOURS.BLACK)
        ) {
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
      return NOMOVE;
    }
    TakeMove();
    return Move;
  }

  return NOMOVE;
}
