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
} from './board';
import { whiteArcane, blackArcane, POWERBIT } from './arcaneDefs';
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
  LoopIndexPrime,
  LoopSlideIndex,
  LoopDyadPrime,
  LoopPcePrime,
  DirNum,
  PceDir,
  RkDir,
  BiDir,
  KiDir,
  KnDir,
  PCEINDEX,
  NOMOVE,
} from './defs';
import { MakeMove, TakeMove } from './makemove';

export function MoveExists(move) {
  GenerateMoves();

  var index;
  var moveFound = NOMOVE;
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
  if ((capturesOnly && !consume) || !capturesOnly) {
    console.log('could be consume');
    if (GameBoard.suspend <= 0) {
      GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
      GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 543;

      // todo consume to drag score in proper direction
      //  =
      //   MvvLvaScores[CAPTURED(move) * 14 + GameBoard.pieces[FROMSQ(move)]] +
      //   1000000;
    }
  }
}

export function AddQuietMove(move, capturesOnly) {
  if (!capturesOnly) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;

    // if (move == GameBoard.searchKillers[GameBoard.ply]) {
    //   GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 900000;
    // } else if (move == GameBoard.searchKillers[GameBoard.ply + MAXDEPTH]) {
    //   GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 800000;
    // } else {
    //   GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] =
    //     GameBoard.searchHistory[
    //       GameBoard.pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move)
    //     ];
    // }

    // todo move this incrementer to allow dyads?
    GameBoard.moveListStart[GameBoard.ply + 1]++;
  }
}

export function AddEnPassantMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] =
    105 + 1000000;
}

export function AddWhitePawnCaptureMove(from, to, cap, consume, capturesOnly) {
  if (GameBoard.whiteArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_7) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wZ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wU, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0), consume, capturesOnly);
  }
  if (RanksBrd[to] === RANKS.RANK_8) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wZ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wU, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0), consume, capturesOnly);
  } else {
    AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
  }
}

export function AddBlackPawnCaptureMove(from, to, cap, consume, capturesOnly) {
  if (GameBoard.blackArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_2) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bZ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bU, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0), consume, capturesOnly);
  }
  if (RanksBrd[to] === RANKS.RANK_1) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bZ, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bU, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0), consume, capturesOnly);
    AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0), consume, capturesOnly);
  } else {
    AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0), consume, capturesOnly);
  }
}

export function AddWhitePawnQuietMove(from, to, flag, capturesOnly) {
  if (GameBoard.whiteArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_7) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, flag), capturesOnly);
  }
  if (RanksBrd[to] === RANKS.RANK_8) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, flag), capturesOnly);
  } else {
    AddQuietMove(
      MOVE(
        from,
        to,
        flag === MFLAGSHFT ? PIECES.wP : PIECES.EMPTY,
        PIECES.EMPTY,
        flag
      ),
      capturesOnly
    );
  }
}

export function AddBlackPawnQuietMove(from, to, flag, capturesOnly) {
  if (GameBoard.blackArcane[4] & 16 && RanksBrd[to] === RANKS.RANK_2) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, flag), capturesOnly);
  }
  if (RanksBrd[to] === RANKS.RANK_1) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, flag), capturesOnly);
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, flag), capturesOnly);
  } else {
    AddQuietMove(
      MOVE(
        from,
        to,
        flag === MFLAGSHFT ? PIECES.bP : PIECES.EMPTY,
        PIECES.EMPTY,
        flag
      ),
      capturesOnly
    );
  }
}

// get binary representation of powers that are non-zero for the current player
export const generatePowers = () => {
  let powerBits = [0, 0, 0, 0, 0];
  const powerTypes = {
    dyad: 0,
    sumn: 0,
    shft: 0,
    swap: 0,
    mods: 0,
  };

  if (GameBoard.side === COLOURS.WHITE) {
    _.forEach(whiteArcane(), (value, key) => {
      const powerName = key.substring(0, 4);
      powerTypes[powerName] |= POWERBIT[key];
    });

    powerBits[0] |= powerTypes.dyad;
    powerBits[1] |= powerTypes.shft;
    powerBits[2] |= powerTypes.swap;
    powerBits[3] |= powerTypes.sumn;
    powerBits[4] |= powerTypes.mods;

    GameBoard.whiteArcane = powerBits;
  } else {
    _.forEach(blackArcane(), (value, key) => {
      const powerName = key.substring(0, 4);
      powerTypes[powerName] |= POWERBIT[key];
    });

    powerBits[0] |= powerTypes.dyad;
    powerBits[1] |= powerTypes.shft;
    powerBits[2] |= powerTypes.swap;
    powerBits[3] |= powerTypes.sumn;
    powerBits[4] |= powerTypes.mods;

    GameBoard.blackArcane = powerBits;
  }
};

// todo generate summons

// todo generate swaps

export const getHerrings = (color) => {
  const herrings = [];
  if (color === COLOURS.BLACK) {
    GameBoard.pieces.forEach((piece, index) => {
      if (piece === 15) {
        herrings.push(index);
      }
    });
  }
  if (color === COLOURS.WHITE) {
    GameBoard.pieces.forEach((piece, index) => {
      if (piece === 20) {
        herrings.push(index);
      }
    });
  }
  return herrings;
};

export function GenerateMoves(withHerrings = true, capturesOnly = false) {
  GameBoard.moveListStart[GameBoard.ply + 1] =
    GameBoard.moveListStart[GameBoard.ply];

  let index;
  let pceType;
  let pceNum;
  let sq;
  // let sqP;
  let pceIndex = 0;
  let pceIndexPrimeVar = 0;
  let pcePrimeVar;
  let dyadPrimeVar;
  let pce;
  let t_sq;
  let dir;
  let dyad;

  let herrings = [];

  const herringArray = getHerrings(GameBoard.side);

  // herring edge cases
  // if king is only attacker and not in check
  // if only attacker is pinned to king
  // if only attacker is entangled
  // then set herrings to empty array
  // if move list === 0? and not in check does this take care of these edge cases?

  if (withHerrings) {
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

  // NOTE WHITE PAWN AND SPECIAL MOVES
  if (GameBoard.side === COLOURS.WHITE) {
    pceType = PIECES.wP;

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

      if (
        _.includes(GameBoard.royaltyQ, sq) ||
        _.includes(GameBoard.royaltyZ, sq) ||
        _.includes(GameBoard.royaltyU, sq) ||
        _.includes(GameBoard.royaltyV, sq) ||
        _.includes(GameBoard.royaltyE, sq)
      ) {
        continue;
      }

      // note WHITE PAWN QUIET MOVES
      if (
        (GameBoard.dyad === 0 ||
          GameBoard.dyad === 1 ||
          GameBoard.dyad === 2) &&
        !herrings.length
      ) {
        // NORMAL PAWN MOVES
        if (GameBoard.pieces[sq + 10] === PIECES.EMPTY) {
          AddWhitePawnQuietMove(sq, sq + 10, 0, capturesOnly);
          if (
            RanksBrd[sq] === RANKS.RANK_2 &&
            GameBoard.pieces[sq + 20] === PIECES.EMPTY
          ) {
            AddQuietMove(
              MOVE(
                sq,
                sq + 20,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGPS,
                capturesOnly
              )
            );
          }
        }

        // note WHITE PAWN SHIFTS
        if (GameBoard.whiteArcane[2] & 1) {
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

      // note WHITE PAWN CAPTURES CONSUME
      if (GameBoard.dyad === 0) {
        if (
          (SQOFFBOARD(sq + 9) === BOOL.FALSE && !herrings.length) ||
          (SQOFFBOARD(sq + 9) === BOOL.FALSE &&
            herrings.length &&
            _.includes(herrings, sq + 9))
        ) {
          if (PieceCol[GameBoard.pieces[sq + 9]] === COLOURS.BLACK) {
            AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq + 9]);
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
          (SQOFFBOARD(sq + 11) === BOOL.FALSE && !herrings.length) ||
          (SQOFFBOARD(sq + 11) === BOOL.FALSE &&
            herrings.length &&
            _.includes(herrings, sq + 11))
        ) {
          if (PieceCol[GameBoard.pieces[sq + 11]] === COLOURS.BLACK) {
            AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq + 11]);
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

        // NOTE WHITE EP
        if (GameBoard.enPas !== SQUARES.NO_SQ && !herrings.length) {
          if (sq + 9 === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
            );
          }

          if (sq + 11 === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
            );
          }
        }
      }
    }

    // WARNING, this will only work in a vanilla setup, no extra rooks
    if (GameBoard.castlePerm & CASTLEBIT.WKCA && !herrings.length) {
      if (GameBoard.blackArcane[4] & 8) {
        const getKingPos = _.indexOf(GameBoard.pieces, 6, 22);
        const getRookPos = _.lastIndexOf(GameBoard.pieces, 4);

        for (let sq = GameBoard.pieces.indexOf(6); sq <= 27; sq++) {
          const getPiece = _.get(GameBoard.pieces, sq);

          if (sq === 28 && getPiece === PIECES.wK) {
            AddQuietMove(
              MOVE(SQUARES.G1, SQUARES.H1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
            break;
          }

          if (
            GameBoard.pieces[sq] !== PIECES.EMPTY &&
            GameBoard.pieces[sq] !== PIECES.wK &&
            GameBoard.pieces[sq] !== PIECES.wR
          ) {
            break;
          }

          if (
            SqAttacked(sq, COLOURS.BLACK) &&
            sq !== 28 &&
            !(GameBoard.whiteArcane[4] & 4)
          ) {
            break;
          }

          if (sq === 28) {
            AddQuietMove(
              MOVE(getKingPos, getRookPos, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
          }
        }
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
              MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
          }
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.WQCA && !herrings.length) {
      if (blackArcane[4] & 8) {
        const getKingPos = _.indexOf(GameBoard.pieces, 6, 22);
        const getRookPos = _.indexOf(GameBoard.pieces, 4, 21);

        if (getKingPos === 22) {
          if (
            GameBoard.pieces[SQUARES.D1] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.C1] === PIECES.EMPTY
          ) {
            if (SqAttacked(SQUARES.B1, COLOURS.BLACK) === BOOL.FALSE) {
              AddQuietMove(
                MOVE(
                  SQUARES.B1,
                  SQUARES.A1,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        } else {
          for (let sq = GameBoard.pieces.indexOf(6); sq >= 23; sq--) {
            const getPiece = _.get(GameBoard.pieces, sq);

            if (sq === 23 && getPiece === PIECES.wK) {
              AddQuietMove(
                MOVE(
                  SQUARES.C1,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
              break;
            }

            if (
              GameBoard.pieces[sq] !== PIECES.EMPTY &&
              GameBoard.pieces[sq] !== PIECES.wK &&
              GameBoard.pieces[sq] !== PIECES.wR
            ) {
              break;
            }

            if (
              SqAttacked(sq, COLOURS.BLACK) &&
              sq !== 23 &&
              !(GameBoard.whiteArcane[4] & 4)
            ) {
              break;
            }

            if (sq === 23) {
              AddQuietMove(
                MOVE(
                  getKingPos,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        }
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
              MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
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
        _.includes(GameBoard.royaltyQ, sq) ||
        _.includes(GameBoard.royaltyZ, sq) ||
        _.includes(GameBoard.royaltyU, sq) ||
        _.includes(GameBoard.royaltyV, sq) ||
        _.includes(GameBoard.royaltyE, sq)
      ) {
        continue;
      }

      // note BLACK PAWN QUIET MOVES
      if (
        (GameBoard.dyad === 0 ||
          GameBoard.dyad === 1 ||
          GameBoard.dyad === 2) &&
        !herrings.length
      ) {
        if (GameBoard.pieces[sq - 10] === PIECES.EMPTY) {
          AddBlackPawnQuietMove(sq, sq - 10, 0, capturesOnly);
          if (
            RanksBrd[sq] === RANKS.RANK_7 &&
            GameBoard.pieces[sq - 20] === PIECES.EMPTY
          ) {
            AddQuietMove(
              MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS),
              capturesOnly
            );
          }
        }

        // note BLACK PAWN SHIFTS
        if (GameBoard.blackArcane[2] & 1) {
          if (GameBoard.pieces[sq - 1] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(sq, sq - 1, 0, MFLAGSHFT, capturesOnly);
          }
          if (GameBoard.pieces[sq + 1] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(sq, sq + 1, 0, MFLAGSHFT, capturesOnly);
          }
          if (GameBoard.pieces[sq + 10] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(sq, sq + 10, 0, MFLAGSHFT, capturesOnly);
          }
        }
      }

      // note BLACK PAWN CAPTURES CONSUME
      if (GameBoard.dyad === 0) {
        if (
          (SQOFFBOARD(sq - 9) === BOOL.FALSE && !herrings.length) ||
          (SQOFFBOARD(sq - 9) === BOOL.FALSE &&
            herrings.length &&
            _.includes(herrings, sq - 9))
        ) {
          if (PieceCol[GameBoard.pieces[sq - 9]] === COLOURS.WHITE) {
            AddBlackPawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq - 9]);
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
          (SQOFFBOARD(sq - 11) === BOOL.FALSE && !herrings.length) ||
          (SQOFFBOARD(sq - 11) === BOOL.FALSE &&
            herrings.length &&
            _.includes(herrings, sq - 11))
        ) {
          if (PieceCol[GameBoard.pieces[sq - 11]] === COLOURS.WHITE) {
            AddBlackPawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq - 11]);
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
        if (GameBoard.enPas !== SQUARES.NO_SQ && !herrings.length) {
          if (sq - 9 === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
            );
          }

          if (sq - 11 === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
            );
          }
        }
      }
    }

    // WARNING, this will only work in a vanilla setup, no extra rooks
    if (GameBoard.castlePerm & CASTLEBIT.BKCA && !herrings.length) {
      if (GameBoard.whiteArcane[4] & 8) {
        const getKingPos = _.indexOf(GameBoard.pieces, 12, 92);
        const getRookPos = _.lastIndexOf(GameBoard.pieces, 10);

        for (let sq = GameBoard.pieces.indexOf(12); sq <= 97; sq++) {
          const getPiece = _.get(GameBoard.pieces, sq);

          if (sq === 97 && getPiece === PIECES.bK) {
            AddQuietMove(
              MOVE(SQUARES.G8, SQUARES.H8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
            break;
          }

          if (
            GameBoard.pieces[sq] !== PIECES.EMPTY &&
            GameBoard.pieces[sq] !== PIECES.bK &&
            GameBoard.pieces[sq] !== PIECES.bR
          ) {
            break;
          }

          if (
            SqAttacked(sq, COLOURS.WHITE) &&
            sq !== 97 &&
            !(GameBoard.blackArcane[4] & 4)
          ) {
            break;
          }

          if (sq === 97) {
            AddQuietMove(
              MOVE(getKingPos, getRookPos, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
          }
        }
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
              MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
          }
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.BQCA && !herrings.length) {
      if (GameBoard.whiteArcane[4] & 8) {
        const getKingPos = _.indexOf(GameBoard.pieces, 12, 92);
        const getRookPos = _.indexOf(GameBoard.pieces, 10, 91);

        if (getKingPos === 92) {
          if (
            GameBoard.pieces[SQUARES.D8] === PIECES.EMPTY &&
            GameBoard.pieces[SQUARES.C8] === PIECES.EMPTY
          ) {
            if (SqAttacked(SQUARES.B8, COLOURS.WHITE) === BOOL.FALSE) {
              AddQuietMove(
                MOVE(
                  SQUARES.B8,
                  SQUARES.A8,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        } else {
          for (let sq = GameBoard.pieces.indexOf(12); sq >= 93; sq--) {
            const getPiece = _.get(GameBoard.pieces, sq);

            if (sq === 93 && getPiece === PIECES.bK) {
              AddQuietMove(
                MOVE(
                  SQUARES.C8,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
              break;
            }

            if (
              GameBoard.pieces[sq] !== PIECES.EMPTY &&
              GameBoard.pieces[sq] !== PIECES.bK &&
              GameBoard.pieces[sq] !== PIECES.bR
            ) {
              break;
            }

            if (
              SqAttacked(sq, COLOURS.WHITE) &&
              sq !== 93 &&
              !(GameBoard.blackArcane[4] & 4)
            ) {
              break;
            }

            if (sq === 93) {
              AddQuietMove(
                MOVE(
                  getKingPos,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                ),
                capturesOnly
              );
            }
          }
        }
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
              MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
              capturesOnly
            );
          }
        }
      }
    }
  }

  // herring spike bookmark
  // prereq videos on pins and number of attackers

  // royalty hoppers
  if (
    GameBoard.royaltyZ.length ||
    GameBoard.royaltyU.length ||
    GameBoard.royaltyV.length ||
    GameBoard.royaltyE.length
  ) {
    pceIndexPrimeVar = LoopIndexPrime[GameBoard.side];
    pcePrimeVar = LoopPcePrime[pceIndexPrimeVar];
    dyadPrimeVar = LoopDyadPrime[pceIndexPrimeVar++];

    // note NON-SLIDERS ROYALTY
    while (pcePrimeVar !== 0) {
      for (pceNum = 0; pceNum < GameBoard.pceNum[pcePrimeVar]; pceNum++) {
        sq = GameBoard.pList[PCEINDEX(pcePrimeVar, pceNum)];

        const isOverrided =
          _.includes(GameBoard.royaltyZ, sq) ||
          _.includes(GameBoard.royaltyU, sq) ||
          _.includes(GameBoard.royaltyV, sq);

        // ENTAGLE
        if (_.includes(GameBoard.royaltyE, sq) || !isOverrided) {
          continue;
        }

        // PREVENT KING CAPTURE HERRING
        // if (herrings.length) {
        //   if (GameBoard.side === COLOURS.WHITE && pce === PIECES.wK) continue;
        //   if (GameBoard.side === COLOURS.BLACK && pce === PIECES.bK) continue;
        // }

        // KING WITH CASTLING RIGHTS NO ROYALTY
        if (
          GameBoard.side === COLOURS.WHITE &&
          GameBoard.castlePerm & CASTLEBIT.WKCA &&
          GameBoard.castlePerm & CASTLEBIT.WQCA &&
          pcePrimeVar === PIECES.wK
        ) {
          continue;
        }
        if (
          GameBoard.side === COLOURS.BLACK &&
          GameBoard.castlePerm & CASTLEBIT.BKCA &&
          GameBoard.castlePerm & CASTLEBIT.BQCA &&
          pcePrimeVar === PIECES.bK
        ) {
          continue;
        }

        if (_.includes(GameBoard.royaltyV, sq)) {
          // note ROYALTY VANGUARD ZEALOT UNICORN
          if (GameBoard.side === COLOURS.WHITE) {
            pce = PIECES.wV;
          }
          if (GameBoard.side === COLOURS.BLACK) {
            pce = PIECES.bV;
          }
        }
        if (_.includes(GameBoard.royaltyZ, sq)) {
          if (GameBoard.side === COLOURS.WHITE) {
            pce = PIECES.wZ;
          }
          if (GameBoard.side === COLOURS.BLACK) {
            pce = PIECES.bZ;
          }
        }
        if (_.includes(GameBoard.royaltyU, sq)) {
          if (GameBoard.side === COLOURS.WHITE) {
            pce = PIECES.wU;
          }
          if (GameBoard.side === COLOURS.BLACK) {
            pce = PIECES.bU;
          }
        }

        // note royalty hoppers only applies to knight right now, hardcoded PIECES.wN here shouldn't matter
        for (index = 0; index < DirNum[PIECES.wN]; index++) {
          dir = KnDir[index];

          // dir = PceDir[pce][index];
          // if (
          //   pce === PIECES.wZ ||
          //   pce === PIECES.bZ ||
          //   pce === PIECES.wU ||
          //   pce === PIECES.bU
          // ) {
          //   dir = KnDir[index];
          // }

          t_sq = sq + dir;

          if (SQOFFBOARD(t_sq) === BOOL.TRUE) {
            continue;
          }

          if (GameBoard.dyad === 0 && GameBoard.pieces[t_sq] !== PIECES.EMPTY) {
            // note ROYALTY NON-SLIDERS CAPTURES
            if (
              !herrings.length ||
              (herrings.length && _.includes(herrings, t_sq))
            ) {
              if (
                PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
                PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
              ) {
                if (pcePrimeVar === PIECES.wP) {
                  AddWhitePawnCaptureMove(sq, t_sq, GameBoard.pieces[t_sq]);
                } else if (pcePrimeVar === PIECES.bP) {
                  AddBlackPawnCaptureMove(sq, t_sq, GameBoard.pieces[t_sq]);
                } else {
                  AddCaptureMove(
                    MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0)
                  );
                }
              }
            }

            // note ROYALTY NON-SLIDERS CONSUME
            if (SQOFFBOARD(t_sq) === BOOL.FALSE && !herrings.length) {
              if (
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
                !PieceKing[GameBoard.pieces[t_sq]]
              ) {
                if (
                  GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane[4] & 1
                ) {
                  if (pcePrimeVar === PIECES.wP) {
                    AddWhitePawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true,
                      capturesOnly
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                      true,
                      capturesOnly
                    );
                  }
                }
                if (
                  GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane[4] & 1
                ) {
                  if (pcePrimeVar === PIECES.bP) {
                    AddWhitePawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true,
                      capturesOnly
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                      true,
                      capturesOnly
                    );
                  }
                }
              }
            }
          }

          // note ROYALTY NON-SLIDERS QUIET MOVES
          if (
            (GameBoard.dyad === 0 ||
              GameBoard.dyad === 1 ||
              GameBoard.dyad === dyadPrimeVar) &&
            !herrings.length
          ) {
            if (pcePrimeVar === PIECES.wP) {
              AddWhitePawnQuietMove(sq, t_sq, 0, capturesOnly);
            } else if (pcePrimeVar === PIECES.bP) {
              AddBlackPawnQuietMove(sq, t_sq, 0, capturesOnly);
            } else {
              AddQuietMove(
                MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0),
                capturesOnly
              );
            }
          }
        }
      }
      pcePrimeVar = LoopPcePrime[pceIndexPrimeVar];
      dyadPrimeVar = LoopDyadPrime[pceIndexPrimeVar++];
    }
  }

  // royalty sliders
  if (
    GameBoard.royaltyQ.length ||
    GameBoard.royaltyZ.length ||
    GameBoard.royaltyU.length ||
    GameBoard.royaltyE.length
  ) {
    pceIndexPrimeVar = LoopIndexPrime[GameBoard.side];
    pcePrimeVar = LoopPcePrime[pceIndexPrimeVar];
    dyadPrimeVar = LoopDyadPrime[pceIndexPrimeVar++];

    // note SLIDERS ROYALTY
    while (pcePrimeVar !== 0) {
      for (pceNum = 0; pceNum < GameBoard.pceNum[pcePrimeVar]; pceNum++) {
        sq = GameBoard.pList[PCEINDEX(pcePrimeVar, pceNum)];

        const isOverrided =
          _.includes(GameBoard.royaltyQ, sq) ||
          _.includes(GameBoard.royaltyZ, sq) ||
          _.includes(GameBoard.royaltyU, sq) ||
          _.includes(GameBoard.royaltyV, sq);

        // ENTAGLE
        if (_.includes(GameBoard.royaltyE, sq) || !isOverrided) {
          continue;
        }

        // PREVENT KING CAPTURE HERRING
        // if (herrings.length) {
        //   if (GameBoard.side === COLOURS.WHITE && pce === PIECES.wK) continue;
        //   if (GameBoard.side === COLOURS.BLACK && pce === PIECES.bK) continue;
        // }

        // KING WITH CASTLING RIGHTS NO ROYALTY
        if (
          GameBoard.side === COLOURS.WHITE &&
          GameBoard.castlePerm & CASTLEBIT.WKCA &&
          GameBoard.castlePerm & CASTLEBIT.WQCA &&
          pcePrimeVar === PIECES.wK
        ) {
          continue;
        }
        if (
          GameBoard.side === COLOURS.BLACK &&
          GameBoard.castlePerm & CASTLEBIT.BKCA &&
          GameBoard.castlePerm & CASTLEBIT.BQCA &&
          pcePrimeVar === PIECES.bK
        ) {
          continue;
        }

        // note ROYALTY QUEEN ZEALOT UNICORN
        if (_.includes(GameBoard.royaltyQ, sq)) {
          if (GameBoard.side === COLOURS.WHITE) {
            pce = PIECES.wQ;
          }
          if (GameBoard.side === COLOURS.BLACK) {
            pce = PIECES.bQ;
          }
        }
        if (_.includes(GameBoard.royaltyZ, sq)) {
          if (GameBoard.side === COLOURS.WHITE) {
            pce = PIECES.wZ;
          }
          if (GameBoard.side === COLOURS.BLACK) {
            pce = PIECES.bZ;
          }
        }
        if (_.includes(GameBoard.royaltyU, sq)) {
          if (GameBoard.side === COLOURS.WHITE) {
            pce = PIECES.wU;
          }
          if (GameBoard.side === COLOURS.BLACK) {
            pce = PIECES.bU;
          }
        }

        for (index = 0; index < DirNum[pce]; index++) {
          dir = PceDir[pce][index];
          t_sq = sq + dir;

          while (SQOFFBOARD(t_sq) === BOOL.FALSE) {
            if (
              GameBoard.dyad === 0 &&
              GameBoard.pieces[t_sq] !== PIECES.EMPTY
            ) {
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
                    AddWhitePawnCaptureMove(sq, t_sq, GameBoard.pieces[t_sq]);
                  } else if (GameBoard.pieces[sq] === PIECES.bP) {
                    AddBlackPawnCaptureMove(sq, t_sq, GameBoard.pieces[t_sq]);
                  } else {
                    AddCaptureMove(
                      MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0)
                    );
                  }
                }
              }
              // note ROYALTY SLIDERS CONSUME
              if (
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
                !PieceKing[GameBoard.pieces[t_sq]] &&
                !herrings.length
              ) {
                if (
                  GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane[4] & 1
                ) {
                  if (pcePrimeVar === PIECES.wP) {
                    AddWhitePawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true,
                      capturesOnly
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                      true,
                      capturesOnly
                    );
                  }
                }
                if (
                  GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane[4] & 1
                ) {
                  if (pcePrimeVar === PIECES.bP) {
                    AddBlackPawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true,
                      capturesOnly
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
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
                GameBoard.dyad === dyadPrimeVar) &&
              GameBoard.pieces[t_sq] === PIECES.EMPTY
            ) {
              if (
                !herrings.length ||
                (herrings.length && _.includes(herrings, t_sq))
              ) {
                if (pcePrimeVar === PIECES.wP) {
                  AddWhitePawnQuietMove(sq, t_sq, 0, capturesOnly);
                } else if (pcePrimeVar === PIECES.bP) {
                  AddBlackPawnQuietMove(sq, t_sq, 0, capturesOnly);
                } else {
                  AddQuietMove(
                    MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0),
                    capturesOnly
                  );
                }
              }
              t_sq += dir;
            }
          }
        }
      }
      pcePrimeVar = LoopPcePrime[pceIndexPrimeVar];
      dyadPrimeVar = LoopDyadPrime[pceIndexPrimeVar++];
    }
  }

  pceIndex = LoopNonSlideIndex[GameBoard.side];
  pce = LoopNonSlidePce[pceIndex];
  dyad = LoopNonSlideDyad[pceIndex++];

  // note NON-SLIDERS
  while (pce !== 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++) {
      sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

      const isOverrided =
        _.includes(GameBoard.royaltyQ, sq) ||
        _.includes(GameBoard.royaltyZ, sq) ||
        _.includes(GameBoard.royaltyU, sq) ||
        _.includes(GameBoard.royaltyV, sq) ||
        _.includes(GameBoard.royaltyE, sq);

      if (!isOverrided) {
        for (index = 0; index < DirNum[pce]; index++) {
          let kDir, shft_t_N_sq;

          dir = PceDir[pce][index];

          if (
            pce === PIECES.wZ ||
            pce === PIECES.bZ ||
            pce === PIECES.wU ||
            pce === PIECES.bU
          ) {
            dir = KnDir[index];
          }

          if (pce === PIECES.wN || pce === PIECES.bN) {
            kDir = KiDir[index];
            shft_t_N_sq = sq + kDir;
          }

          t_sq = sq + dir;

          if (SQOFFBOARD(t_sq) === BOOL.TRUE) {
            continue;
          }

          // note non-sliders captures
          if (
            !herrings.length ||
            (herrings.length && _.includes(herrings, t_sq))
          ) {
            if (
              GameBoard.dyad === 0 &&
              GameBoard.pieces[t_sq] !== PIECES.EMPTY
            ) {
              const targetPieceColor = PieceCol[GameBoard.pieces[t_sq]];

              if (
                targetPieceColor !== GameBoard.side &&
                targetPieceColor !== COLOURS.BOTH
              ) {
                AddCaptureMove(
                  MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0)
                );
              }
            }
          }

          // note NON-SLIDERS CONSUME
          if (SQOFFBOARD(t_sq) === BOOL.FALSE && !herrings.length) {
            if (
              PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
              !PieceKing[GameBoard.pieces[t_sq]]
            ) {
              if (
                GameBoard.side === COLOURS.WHITE &&
                GameBoard.whiteArcane[4] & 1 &&
                !(
                  pce === PIECES.wK &&
                  GameBoard.castlePerm & CASTLEBIT.WKCA &&
                  GameBoard.castlePerm & CASTLEBIT.WQCA
                )
              ) {
                AddCaptureMove(
                  MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                  true,
                  capturesOnly
                );
              }
              if (
                GameBoard.side === COLOURS.BLACK &&
                GameBoard.blackArcane[4] & 1 &&
                !(
                  pce === PIECES.bK &&
                  GameBoard.castlePerm & CASTLEBIT.BKCA &&
                  GameBoard.castlePerm & CASTLEBIT.BQCA
                )
              ) {
                AddCaptureMove(
                  MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                  true,
                  capturesOnly
                );
              }
            }
          }

          // note NON-SLIDERS QUIET MOVES
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

          // note KNIGHT SHIFT
          if (!isOverrided) {
            if (SQOFFBOARD(shft_t_N_sq) === BOOL.FALSE) {
              if (GameBoard.pieces[shft_t_N_sq] === PIECES.EMPTY) {
                if (
                  (GameBoard.dyad === 0 ||
                    GameBoard.dyad === 1 ||
                    GameBoard.dyad === dyad) &&
                  !herrings.length
                ) {
                  if (pce === PIECES.wN && GameBoard.whiteArcane[2] & 2) {
                    // note capture here just refers to piece type to be able to subtract arcane
                    AddQuietMove(
                      MOVE(sq, shft_t_N_sq, PIECES.wN, PIECES.EMPTY, MFLAGSHFT),
                      capturesOnly
                    );
                  }
                  if (pce === PIECES.bN && GameBoard.blackArcane[2] & 2) {
                    AddQuietMove(
                      MOVE(sq, shft_t_N_sq, PIECES.bN, PIECES.EMPTY, MFLAGSHFT),
                      capturesOnly
                    );
                  }
                }
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

  // note SLIDERS
  while (pce !== 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++) {
      sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

      const isOverrided =
        _.includes(GameBoard.royaltyQ, sq) ||
        _.includes(GameBoard.royaltyZ, sq) ||
        _.includes(GameBoard.royaltyU, sq) ||
        _.includes(GameBoard.royaltyV, sq) ||
        _.includes(GameBoard.royaltyE, sq);

      if (!isOverrided) {
        for (index = 0; index < DirNum[pce]; index++) {
          let rDir, bDir, shft_t_R_sq, shft_t_B_sq;

          dir = PceDir[pce][index];
          t_sq = sq + dir;

          if (
            pce === PIECES.wB ||
            pce === PIECES.wR ||
            pce === PIECES.bB ||
            pce === PIECES.bR
          ) {
            rDir = RkDir[index];
            bDir = BiDir[index];

            shft_t_B_sq = sq + rDir;
            shft_t_R_sq = sq + bDir;
          }

          while (SQOFFBOARD(t_sq) === BOOL.FALSE) {
            if (
              GameBoard.dyad === 0 &&
              GameBoard.pieces[t_sq] !== PIECES.EMPTY
            ) {
              // note SLIDERS CAPTURES
              if (
                PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
                PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
              ) {
                if (
                  !herrings.length ||
                  (herrings.length && _.includes(herrings, t_sq))
                ) {
                  AddCaptureMove(
                    MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0)
                  );
                }
              }
              // note SLIDERS CONSUME
              if (
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
                !PieceKing[GameBoard.pieces[t_sq]] &&
                !herrings.length
              ) {
                if (
                  GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane[4] & 1
                ) {
                  AddCaptureMove(
                    MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
                    true,
                    capturesOnly
                  );
                }
                if (
                  GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane[4] & 1
                ) {
                  AddCaptureMove(
                    MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0),
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
              t_sq += dir;
            }
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
                if (pce === PIECES.wR && GameBoard.whiteArcane[2] & 8) {
                  AddQuietMove(
                    MOVE(sq, shft_t_R_sq, PIECES.wR, PIECES.EMPTY, MFLAGSHFT),
                    capturesOnly
                  );
                }
                if (pce === PIECES.bR && GameBoard.blackArcane[2] & 8) {
                  AddQuietMove(
                    MOVE(sq, shft_t_R_sq, PIECES.bR, PIECES.EMPTY, MFLAGSHFT),
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
                if (pce === PIECES.wB && GameBoard.whiteArcane[2] & 4) {
                  AddQuietMove(
                    MOVE(sq, shft_t_B_sq, PIECES.wB, PIECES.EMPTY, MFLAGSHFT),
                    capturesOnly
                  );
                }
                if (pce === PIECES.bB && GameBoard.blackArcane[2] & 4) {
                  AddQuietMove(
                    MOVE(sq, shft_t_B_sq, PIECES.bB, PIECES.EMPTY, MFLAGSHFT),
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
