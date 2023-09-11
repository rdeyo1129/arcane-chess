import _ from 'lodash';

// import all vars and functions from arcanechess folder that are not defined
import {
  GameBoard,
  SqAttacked,
  SQOFFBOARD,
  MFLAGCA,
  MFLAGCON,
  MFLAGPS,
  MFLAGEP,
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
  PCEINDEX,
} from './defs';

export function MOVE(from, to, captured, promoted, summoned, flag) {
  return (
    BigInt(from) |
    (BigInt(to) << 7n) |
    (BigInt(captured) << 14n) |
    (BigInt(promoted) << 20n) |
    (BigInt(summoned) << 46n) |
    flag
  );
}

export function AddCaptureMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  // GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] =
  //   MvvLvaScores[CAPTURED(move) * 14 + GameBoard.pieces[FROMSQ(move)]] +
  //   1000000;
}

export function AddQuietMove(move) {
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

  GameBoard.moveListStart[GameBoard.ply + 1]++;
}

export function AddEnPassantMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] =
    105 + 1000000;
}

export function AddWhitePawnCaptureMove(from, to, cap, con) {
  if (GameBoard.whiteArcane & (16n << 35n) && RanksBrd[to] === RANKS.RANK_7) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wQ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wZ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wU, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wR, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wB, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wN, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
  }
  if (RanksBrd[to] === RANKS.RANK_8) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wQ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wZ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wU, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wR, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wB, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.wN, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
  } else {
    AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, PIECES.EMPTY, 0n));
  }
}

export function AddBlackPawnCaptureMove(from, to, cap, con) {
  if (GameBoard.blackArcane & (16n << 35n) && RanksBrd[to] === RANKS.RANK_2) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bQ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bZ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bU, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bR, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bB, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bN, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
  }
  if (RanksBrd[to] === RANKS.RANK_1) {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bQ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bZ, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bU, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bR, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bB, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.bN, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
  } else {
    AddCaptureMove(
      MOVE(from, to, cap, PIECES.EMPTY, PIECES.EMPTY, con ? MFLAGCON : 0n)
    );
  }
}

export function AddWhitePawnQuietMove(from, to, flag) {
  if (GameBoard.whiteArcane & (16n << 35n) && RanksBrd[to] === RANKS.RANK_7) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wZ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wU, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, PIECES.EMPTY, flag));
  }
  if (RanksBrd[to] === RANKS.RANK_8) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, PIECES.EMPTY, flag));
  } else {
    AddQuietMove(
      MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, flag)
    );
  }
}

export function AddBlackPawnQuietMove(from, to, flag) {
  if (GameBoard.blackArcane & (16n << 35n) && RanksBrd[to] === RANKS.RANK_2) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, PIECES.EMPTY, flag));
  }
  if (RanksBrd[to] === RANKS.RANK_1) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bZ, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bU, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, PIECES.EMPTY, flag));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, PIECES.EMPTY, flag));
  } else {
    AddQuietMove(
      MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, flag)
    );
  }
}

// get binary representation of powers that are non-zero for the current player
export const generatePowers = () => {
  let powerBits = 0n;
  const powerTypes = {
    dyad: 0n,
    sumn: 0n,
    shft: 0n,
    swap: 0n,
    mods: 0n,
  };

  if (GameBoard.side === COLOURS.WHITE) {
    _.forEach(whiteArcane(), (value, key) => {
      const powerName = key.substring(0, 4);
      powerTypes[powerName] |= BigInt(POWERBIT[key]);
    });

    powerBits |= powerTypes.dyad;
    powerBits |= powerTypes.shft << 12n;
    powerBits |= powerTypes.swap << 16n;
    powerBits |= powerTypes.sumn << 19n;
    powerBits |= powerTypes.mods << 35n;

    GameBoard.whiteArcane = powerBits;
  } else {
    _.forEach(blackArcane(), (value, key) => {
      const powerName = key.substring(0, 4);
      powerTypes[powerName] |= BigInt(POWERBIT[key]);
    });

    powerBits |= powerTypes.dyad;
    powerBits |= powerTypes.shft << 12n;
    powerBits |= powerTypes.swap << 16n;
    powerBits |= powerTypes.sumn << 19n;
    powerBits |= powerTypes.mods << 35n;

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

export function GenerateMoves() {
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

  const herringArray = getHerrings(GameBoard.side);

  const herringsAttacked = () => {
    const herrings = [];
    _.forEach(herringArray, (herringSq) => {
      if (SqAttacked(herringSq, GameBoard.side)) {
        herrings.push(herringSq);
      }
    });
    return herrings;
  };

  const herrings = herringsAttacked();
  const areHerringsAttacked = herrings.length;

  // _.includes(herrings, t_sq)?

  // if (areHerringsAttacked && !_.includes(herrings, sq + 10)) {
  //   continue;
  // }

  // pawn and specials
  if (GameBoard.side === COLOURS.WHITE) {
    pceType = PIECES.wP;

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++) {
      sq = BigInt(GameBoard.pList[PCEINDEX(pceType, pceNum)]);

      if (
        _.includes(GameBoard.royaltyQ, sq) ||
        _.includes(GameBoard.royaltyZ, sq) ||
        _.includes(GameBoard.royaltyU, sq) ||
        _.includes(GameBoard.royaltyV, sq) ||
        _.includes(GameBoard.royaltyE, sq)
      ) {
        continue;
      }

      if (
        GameBoard.dyad === 0n ||
        GameBoard.dyad === 1n ||
        GameBoard.dyad === 2n
      ) {
        // note WHITE PAWN QUIET MOVES
        if (GameBoard.pieces[sq + 10n] === PIECES.EMPTY) {
          if (areHerringsAttacked) {
            continue;
          }

          AddWhitePawnQuietMove(sq, sq + 10n, GameBoard.dyad << 27n);
          if (
            RanksBrd[sq] === RANKS.RANK_2 &&
            GameBoard.pieces[sq + 20n] === PIECES.EMPTY
          ) {
            AddQuietMove(
              MOVE(
                sq,
                sq + 20n,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGPS | (GameBoard.dyad << 27n)
              )
            );
          }
        }

        // note WHITE PAWN SHIFTS
        if (GameBoard.whiteArcane & (1n << 12n)) {
          if (areHerringsAttacked) {
            continue;
          }

          if (GameBoard.pieces[sq - 1n] === PIECES.EMPTY) {
            AddWhitePawnQuietMove(
              sq,
              sq - 1n,
              (1n << 39n) | (GameBoard.dyad << 27n)
            );
          }
          if (GameBoard.pieces[sq + 1n] === PIECES.EMPTY) {
            AddWhitePawnQuietMove(
              sq,
              sq + 1n,
              (1n << 39n) | (GameBoard.dyad << 27n)
            );
          }
          if (GameBoard.pieces[sq - 10n] === PIECES.EMPTY) {
            AddWhitePawnQuietMove(
              sq,
              sq - 10n,
              (1n << 39n) | (GameBoard.dyad << 27n)
            );
          }
        }
      }

      // note WHITE PAWN CAPTURES
      if (GameBoard.dyad === 0n) {
        // note
        // if square is not off board and if square then continue to next condition:
        // if square does not include a herring, and there is an attacked herring, then contiu=nue to next from square iteration
        // if piece or pawn is pinned and is only , then how to determine
        if (SQOFFBOARD(sq + 9n) === BOOL.FALSE) {
          if (areHerringsAttacked && !_.includes(herrings, sq + 9n)) {
            continue;
          }

          if (PieceCol[GameBoard.pieces[sq + 9n]] === BigInt(COLOURS.BLACK)) {
            AddWhitePawnCaptureMove(sq, sq + 9n, GameBoard.pieces[sq + 9]),
              false;
          }
          if (
            PieceCol[GameBoard.pieces[sq + 9n]] === COLOURS.WHITE &&
            // consume
            GameBoard.whiteArcane & (8n << 32n) &&
            !PieceKing[GameBoard.pieces[sq + 9n]]
          ) {
            AddWhitePawnCaptureMove(
              sq,
              sq + 9n,
              GameBoard.pieces[sq + 9n],
              true
            );
          }
        }

        if (SQOFFBOARD(sq + 11n) === BOOL.FALSE) {
          if (areHerringsAttacked && !_.includes(herrings, sq + 11n)) {
            continue;
          }

          if (PieceCol[GameBoard.pieces[sq + 11n]] === COLOURS.BLACK) {
            AddWhitePawnCaptureMove(sq, sq + 11n, GameBoard.pieces[sq + 11n]),
              false;
          }
          if (
            PieceCol[GameBoard.pieces[sq + 11n]] === COLOURS.WHITE &&
            // consume
            GameBoard.whiteArcane & (8n << 32n) &&
            !PieceKing[GameBoard.pieces[sq + 11n]]
          ) {
            AddWhitePawnCaptureMove(
              sq,
              sq + 11n,
              GameBoard.pieces[sq + 11n],
              true
            );
          }
        }

        if (areHerringsAttacked) {
          continue;
        }

        if (GameBoard.enPas !== BigInt(SQUARES.NO_SQ)) {
          if (sq + 9n === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(
                sq,
                sq + 9n,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGEP
              )
            );
          }

          if (sq + 11n === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(
                sq,
                sq + 11n,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGEP
              )
            );
          }
        }
      }
    }

    // WARNING, this will only work in a vanilla setup, no extra rooks
    if (GameBoard.castlePerm & BigInt(CASTLEBIT.WKCA) && !areHerringsAttacked) {
      if (blackArcane().modsRAN) {
        const getKingPos = _.indexOf(GameBoard.pieces, 6, 22);
        const getRookPos = _.lastIndexOf(GameBoard.pieces, 4);

        for (let sq = GameBoard.pieces.indexOf(6); sq <= 27; sq++) {
          const getPiece = _.get(GameBoard.pieces, sq);

          if (sq === 27n && getPiece === PIECES.wK) {
            AddQuietMove(
              MOVE(
                SQUARES.G1,
                SQUARES.H1,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
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
            sq !== 27n &&
            !GameBoard.whiteArcane & (4n << 35n)
          ) {
            break;
          }

          if (sq === 27n) {
            AddQuietMove(
              MOVE(
                getKingPos,
                getRookPos,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
            );
          }
        }
      } else {
        if (
          GameBoard.pieces[SQUARES.F1] === PIECES.EMPTY &&
          GameBoard.pieces[SQUARES.G1] === PIECES.EMPTY
        ) {
          if (
            SqAttacked(SQUARES.F1, COLOURS.BLACK) === BOOL.FALSE &&
            SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE &&
            !GameBoard.whiteArcane & (4n << 35n)
          ) {
            AddQuietMove(
              MOVE(
                SQUARES.E1,
                SQUARES.G1,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
            );
          }
        }
      }
    }

    if (GameBoard.castlePerm & BigInt(CASTLEBIT.WQCA) && !areHerringsAttacked) {
      if (blackArcane().modsRAN) {
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
                  PIECES.EMPTY,
                  MFLAGCA
                )
              );
            }
          }
        } else {
          for (let sq = GameBoard.pieces.indexOf(6); sq >= 23n; sq--) {
            const getPiece = _.get(GameBoard.pieces, sq);

            if (sq === 23n && getPiece === PIECES.wK) {
              AddQuietMove(
                MOVE(
                  SQUARES.C1,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                )
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
              sq !== 23n &&
              !GameBoard.whiteArcane & (4n << 35n)
            ) {
              break;
            }

            if (sq === 23n) {
              AddQuietMove(
                MOVE(
                  getKingPos,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                )
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
            SqAttacked(SQUARES.D1, COLOURS.BLACK) === BOOL.FALSE &&
            SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE
          ) {
            AddQuietMove(
              MOVE(
                SQUARES.E1,
                SQUARES.C1,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
            );
          }
        }
      }
    }

    // note BLACK SPECIAL MOVES
  } else {
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
        GameBoard.dyad === 0n ||
        GameBoard.dyad === 1n ||
        GameBoard.dyad === 2n
      ) {
        if (areHerringsAttacked) {
          continue;
        }

        if (GameBoard.pieces[sq - 10n] === PIECES.EMPTY) {
          AddBlackPawnQuietMove(sq, sq - 10n, GameBoard.dyad << 27n);
          if (
            RanksBrd[sq] === RANKS.RANK_7 &&
            GameBoard.pieces[sq - 20n] === PIECES.EMPTY
          ) {
            AddQuietMove(
              MOVE(
                sq,
                sq - 20n,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGPS | (GameBoard.dyad << 27n)
              )
            );
          }
        }

        // note BLACK PAWN SHIFTS
        if (GameBoard.blackArcane & (1n << 12n)) {
          if (GameBoard.pieces[sq - 1n] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(
              sq,
              sq - 1n,
              (1n << 39n) | (GameBoard.dyad << 27n)
            );
          }
          if (GameBoard.pieces[sq + 1n] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(
              sq,
              sq + 1n,
              (1n << 39n) | (GameBoard.dyad << 27n)
            );
          }
          if (GameBoard.pieces[sq + 10n] === PIECES.EMPTY) {
            AddBlackPawnQuietMove(
              sq,
              sq + 10n,
              (1n << 39n) | (GameBoard.dyad << 27n)
            );
          }
        }
      }

      // note BLACK PAWN CAPTURES
      if (GameBoard.dyad === 0n) {
        if (SQOFFBOARD(sq - 9n) === BOOL.FALSE) {
          if (areHerringsAttacked && !_.includes(herrings, sq - 9n)) {
            continue;
          }

          if (PieceCol[GameBoard.pieces[sq - 9n]] === COLOURS.WHITE) {
            AddBlackPawnCaptureMove(sq, sq - 9n, GameBoard.pieces[sq - 9n]),
              false;
          }
          if (
            PieceCol[GameBoard.pieces[sq - 9n]] === COLOURS.BLACK &&
            GameBoard.blackArcane & (8n << 32n) &&
            !PieceKing[GameBoard.pieces[sq - 9n]]
          ) {
            AddBlackPawnCaptureMove(
              sq,
              sq - 9n,
              GameBoard.pieces[sq - 9n],
              true
            );
          }
        }

        if (SQOFFBOARD(sq - 11n) === BOOL.FALSE) {
          if (areHerringsAttacked && !_.includes(herrings, sq - 11n)) {
            continue;
          }

          if (PieceCol[GameBoard.pieces[sq - 11n]] === COLOURS.WHITE) {
            AddBlackPawnCaptureMove(sq, sq - 11n, GameBoard.pieces[sq - 11n]),
              false;
          }

          if (
            PieceCol[GameBoard.pieces[sq - 11n]] === COLOURS.BLACK &&
            GameBoard.blackArcane & (8n << 32n) &&
            !PieceKing[GameBoard.pieces[sq - 11n]]
          ) {
            AddBlackPawnCaptureMove(
              sq,
              sq - 11n,
              GameBoard.pieces[sq - 11n],
              true
            );
          }
        }

        if (areHerringsAttacked) {
          continue;
        }

        if (GameBoard.enPas !== BigInt(SQUARES.NO_SQ)) {
          if (sq - 9n === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(
                sq,
                sq - 9n,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGEP
              )
            );
          }

          if (sq - 11n === GameBoard.enPas) {
            AddEnPassantMove(
              MOVE(
                sq,
                sq - 11n,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGEP
              )
            );
          }
        }
      }
    }

    if (GameBoard.castlePerm & BigInt(CASTLEBIT.BKCA) && !areHerringsAttacked) {
      if (whiteArcane().modsRAN) {
        const getKingPos = _.indexOf(GameBoard.pieces, 12, 92);
        const getRookPos = _.lastIndexOf(GameBoard.pieces, 10);

        for (let sq = GameBoard.pieces.indexOf(12); sq <= 97n; sq++) {
          const getPiece = _.get(GameBoard.pieces, sq);

          if (sq === 97n && getPiece === PIECES.bK) {
            AddQuietMove(
              MOVE(
                SQUARES.G8,
                SQUARES.H8,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
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
            sq !== 97n &&
            !GameBoard.blackArcane & (4n << 35n)
          ) {
            break;
          }

          if (sq === 97n) {
            AddQuietMove(
              MOVE(
                getKingPos,
                getRookPos,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
            );
          }
        }
      } else {
        if (
          GameBoard.pieces[SQUARES.F8] === PIECES.EMPTY &&
          GameBoard.pieces[SQUARES.G8] === PIECES.EMPTY
        ) {
          if (
            SqAttacked(SQUARES.F8, COLOURS.WHITE) === BOOL.FALSE &&
            SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE &&
            !GameBoard.blackArcane & (4n << 35n)
          ) {
            AddQuietMove(
              MOVE(
                SQUARES.E8,
                SQUARES.G8,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
            );
          }
        }
      }
    }

    if (GameBoard.castlePerm & BigInt(CASTLEBIT.BQCA) && !areHerringsAttacked) {
      if (whiteArcane().modsRAN) {
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
                  PIECES.EMPTY,
                  MFLAGCA
                )
              );
            }
          }
        } else {
          for (let sq = GameBoard.pieces.indexOf(12); sq >= 93n; sq--) {
            const getPiece = _.get(GameBoard.pieces, sq);

            if (sq === 93n && getPiece === PIECES.bK) {
              AddQuietMove(
                MOVE(
                  SQUARES.C8,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                )
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
              sq !== 93n &&
              !GameBoard.blackArcane & (4n << 35n)
            ) {
              break;
            }

            if (sq === 93n) {
              AddQuietMove(
                MOVE(
                  getKingPos,
                  getRookPos,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  MFLAGCA
                )
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
            SqAttacked(SQUARES.D8, COLOURS.WHITE) === BOOL.FALSE &&
            SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE
          ) {
            AddQuietMove(
              MOVE(
                SQUARES.E8,
                SQUARES.C8,
                PIECES.EMPTY,
                PIECES.EMPTY,
                PIECES.EMPTY,
                MFLAGCA
              )
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
    GameBoard.royaltyV.length ||
    GameBoard.royaltyZ.length ||
    GameBoard.royaltyU.length ||
    GameBoard.royaltyE.length
  ) {
    pceIndexPrimeVar = LoopIndexPrime[GameBoard.side];
    pcePrimeVar = LoopPcePrime[pceIndexPrimeVar];
    dyadPrimeVar = LoopDyadPrime[pceIndexPrimeVar++];

    // note NON-SLIDERS ROYALTY
    while (pcePrimeVar !== 0) {
      for (pceNum = 0; pceNum < GameBoard.pceNum[pcePrimeVar]; pceNum++) {
        sq = GameBoard.pList[PCEINDEX(pcePrimeVar, pceNum)];

        // ENTAGLE
        if (_.includes(GameBoard.royaltyE, sq)) {
          continue;
        }

        // PREVENT KING CAPTURE HERRING
        if (areHerringsAttacked) {
          if (GameBoard.side === COLOURS.WHITE && pce === PIECES.wK) continue;
          if (GameBoard.side === COLOURS.BLACK && pce === PIECES.bK) continue;
        }

        // KING WITH CASTLING RIGHTS NO ROYALTY
        if (
          GameBoard.side === COLOURS.WHITE &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.WKCA) &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.WQCA) &&
          pce === PIECES.wK
        ) {
          continue;
        }
        if (
          GameBoard.side === COLOURS.BLACK &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.BKCA) &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.BQCA) &&
          pce === PIECES.bK
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

        for (index = 0; index < DirNum[pce]; index++) {
          dir = PceDir[pce][index];
          t_sq = sq + dir;

          // note ROYALTY NON-SLIDERS CAPTURES
          if (SQOFFBOARD(t_sq) === BOOL.FALSE) {
            if (areHerringsAttacked && !_.includes(herrings, t_sq)) {
              continue;
            }

            if (
              GameBoard.dyad === 0n &&
              GameBoard.pieces[t_sq] !== PIECES.EMPTY
            ) {
              if (
                PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
                PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
              ) {
                if (pcePrimeVar === PIECES.wP) {
                  AddWhitePawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    false
                  );
                } else if (pcePrimeVar === PIECES.bP) {
                  AddBlackPawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    false
                  );
                } else {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      0n
                    )
                  );
                }
              }
              console.log(
                'consume',
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side,
                !PieceKing[GameBoard.pieces[t_sq]]
              );
              // note ROYALTY NON-SLIDERS CONSUME
              if (
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
                !PieceKing[GameBoard.pieces[t_sq]]
              ) {
                console.log('white consume non slider');
                if (
                  GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane & (8n << 32n)
                ) {
                  if (pcePrimeVar === PIECES.wP) {
                    AddWhitePawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(
                        sq,
                        t_sq,
                        GameBoard.pieces[t_sq],
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        MFLAGCON
                      )
                    );
                  }
                }
                if (
                  GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane & (8n << 32n)
                ) {
                  if (pcePrimeVar === PIECES.bP) {
                    AddWhitePawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(
                        sq,
                        t_sq,
                        GameBoard.pieces[t_sq],
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        MFLAGCON
                      )
                    );
                  }
                }
              }
              // note ROYALTY NON-SLIDERS QUIET MOVES
            } else {
              if (
                GameBoard.dyad === 0n ||
                GameBoard.dyad === 1n ||
                GameBoard.dyad === dyadPrimeVar
              ) {
                if (pcePrimeVar === PIECES.wP) {
                  AddWhitePawnQuietMove(sq, t_sq, GameBoard.dyad << 27n);
                } else if (pcePrimeVar === PIECES.bP) {
                  AddBlackPawnQuietMove(sq, t_sq, GameBoard.dyad << 27n);
                } else {
                  AddQuietMove(
                    MOVE(
                      sq,
                      t_sq,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      GameBoard.dyad << 27n
                    )
                  );
                }
              }
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

        // ENTAGLE
        if (_.includes(GameBoard.royaltyE, sq)) {
          continue;
        }

        if (areHerringsAttacked) {
          if (GameBoard.side === COLOURS.WHITE && pce === PIECES.wK) continue;
          if (GameBoard.side === COLOURS.BLACK && pce === PIECES.bK) continue;
        }

        // KING WITH CASTLING RIGHTS NO ROYALTY
        if (
          GameBoard.side === COLOURS.WHITE &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.WKCA) &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.WQCA) &&
          pce === PIECES.wK
        ) {
          continue;
        }
        if (
          GameBoard.side === COLOURS.BLACK &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.BKCA) &&
          GameBoard.castlePerm & BigInt(CASTLEBIT.BQCA) &&
          pce === PIECES.bK
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

          // note ROYALTY SLIDERS CAPTURES
          if (SQOFFBOARD(t_sq) === BOOL.FALSE) {
            if (areHerringsAttacked && !_.includes(herrings, t_sq)) {
              continue;
            }

            if (
              GameBoard.dyad === 0n &&
              GameBoard.pieces[t_sq] !== PIECES.EMPTY
            ) {
              if (
                PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
                PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
              ) {
                if (pcePrimeVar === PIECES.wP) {
                  AddWhitePawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    false
                  );
                } else if (pcePrimeVar === PIECES.bP) {
                  AddBlackPawnCaptureMove(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    false
                  );
                } else {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      0n
                    )
                  );
                }
              }
              // note ROYALTY SLIDERS CONSUME
              if (
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
                !PieceKing[GameBoard.pieces[t_sq]]
              ) {
                if (
                  GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane & (8n << 32n)
                ) {
                  if (pcePrimeVar === PIECES.wP) {
                    AddWhitePawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(
                        sq,
                        t_sq,
                        GameBoard.pieces[t_sq],
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        MFLAGCON
                      )
                    );
                  }
                }
                if (
                  GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane & (8n << 32n)
                ) {
                  if (pcePrimeVar === PIECES.bP) {
                    AddWhitePawnCaptureMove(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      true
                    );
                  } else {
                    AddCaptureMove(
                      MOVE(
                        sq,
                        t_sq,
                        GameBoard.pieces[t_sq],
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        MFLAGCON
                      )
                    );
                  }
                }
              }
              // note ROYALTY SLIDERS QUIET MOVES
            } else {
              if (
                GameBoard.dyad === 0n ||
                GameBoard.dyad === 1n ||
                GameBoard.dyad === dyadPrimeVar
              ) {
                if (pcePrimeVar === PIECES.wP) {
                  AddWhitePawnQuietMove(sq, t_sq, GameBoard.dyad << 27n);
                } else if (pcePrimeVar === PIECES.bP) {
                  AddBlackPawnQuietMove(sq, t_sq, GameBoard.dyad << 27n);
                } else {
                  AddQuietMove(
                    MOVE(
                      sq,
                      t_sq,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      GameBoard.dyad << 27n
                    )
                  );
                }
              }
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

          dir = BigInt(PceDir[pce][index]);

          if (pce !== PIECES.wN && pce !== PIECES.bN) {
            kDir = BigInt(KiDir[index]);
            shft_t_N_sq = sq + kDir;
          }

          t_sq = sq + dir;

          // note NON-SLIDERS CAPTURES
          if (SQOFFBOARD(t_sq) === BOOL.FALSE) {
            if (
              GameBoard.dyad === 0n &&
              GameBoard.pieces[t_sq] !== PIECES.EMPTY
            ) {
              if (
                PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
                PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
              ) {
                AddCaptureMove(
                  MOVE(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    0n
                  )
                );
              }
              // note NON-SLIDERS CONSUME
              if (
                PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side &&
                !PieceKing[GameBoard.pieces[t_sq]]
              ) {
                // console.log('consume?');
                if (
                  GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane & (8n << 32n) &&
                  !(
                    pce === PIECES.wK &&
                    GameBoard.castlePerm & BigInt(CASTLEBIT.WKCA) &&
                    GameBoard.castlePerm & BigInt(CASTLEBIT.WQCA)
                  )
                ) {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGCON
                    )
                  );
                }
                if (
                  GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane & (8n << 32n) &&
                  !(
                    pce === PIECES.bK &&
                    GameBoard.castlePerm & BigInt(CASTLEBIT.BKCA) &&
                    GameBoard.castlePerm & BigInt(CASTLEBIT.BQCA)
                  )
                ) {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGCON
                    )
                  );
                }
              }
              // note NON-SLIDERS QUIET MOVES
            } else {
              if (
                GameBoard.dyad === 0n ||
                GameBoard.dyad === 1n ||
                GameBoard.dyad === dyad
              ) {
                AddQuietMove(
                  MOVE(
                    sq,
                    t_sq,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    GameBoard.dyad << 27n
                  )
                );
              }
            }
          }

          // note KNIGHT SHIFT
          if (!isOverrided) {
            if (SQOFFBOARD(shft_t_N_sq) === BOOL.FALSE) {
              if (GameBoard.pieces[shft_t_N_sq] === PIECES.EMPTY) {
                if (
                  GameBoard.dyad === 0n ||
                  GameBoard.dyad === 1n ||
                  GameBoard.dyad === dyad
                ) {
                  if (
                    pce === PIECES.wN &&
                    GameBoard.whiteArcane & (2n << 12n)
                  ) {
                    AddQuietMove(
                      MOVE(
                        sq,
                        shft_t_N_sq,
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        (2n << 39n) | (GameBoard.dyad << 27n)
                      )
                    );
                  }
                  if (
                    pce === PIECES.bN &&
                    GameBoard.blackArcane & (2n << 12n)
                  ) {
                    AddQuietMove(
                      MOVE(
                        sq,
                        shft_t_N_sq,
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        PIECES.EMPTY,
                        (2n << 39n) | (GameBoard.dyad << 27n)
                      )
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
          dir = BigInt(PceDir[pce][index]);

          if (pce !== PIECES.wQ && pce !== PIECES.bQ) {
            rDir = BigInt(RkDir[index]);
            bDir = BigInt(BiDir[index]);

            shft_t_B_sq = sq + rDir;
            shft_t_R_sq = sq + bDir;
          }

          t_sq = sq + dir;

          while (SQOFFBOARD(t_sq) === BOOL.FALSE) {
            if (
              GameBoard.dyad === 0n &&
              GameBoard.pieces[t_sq] !== PIECES.EMPTY
            ) {
              // note SLIDERS CAPTURE
              if (
                PieceCol[GameBoard.pieces[t_sq]] !== GameBoard.side &&
                PieceCol[GameBoard.pieces[t_sq]] !== COLOURS.BOTH
              ) {
                AddCaptureMove(
                  MOVE(
                    sq,
                    t_sq,
                    GameBoard.pieces[t_sq],
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    0n
                  )
                );
              }
              // note SLIDERS CONSUME
              if (PieceCol[GameBoard.pieces[t_sq]] === GameBoard.side) {
                if (
                  GameBoard.side === COLOURS.WHITE &&
                  GameBoard.whiteArcane & (8n << 32n) &&
                  !PieceKing[GameBoard.pieces[t_sq]]
                ) {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGCON
                    )
                  );
                }
                if (
                  GameBoard.side === COLOURS.BLACK &&
                  GameBoard.blackArcane & (8n << 32n) &&
                  !PieceKing[GameBoard.pieces[t_sq]]
                ) {
                  AddCaptureMove(
                    MOVE(
                      sq,
                      t_sq,
                      GameBoard.pieces[t_sq],
                      PIECES.EMPTY,
                      PIECES.EMPTY,
                      MFLAGCON
                    )
                  );
                }
              }
              break;
            }

            // note SLIDERS QUIET MOVES
            if (
              GameBoard.dyad === 0n ||
              GameBoard.dyad === 1n ||
              GameBoard.dyad === dyad
            ) {
              AddQuietMove(
                MOVE(
                  sq,
                  t_sq,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  PIECES.EMPTY,
                  GameBoard.dyad << 27n
                )
              );
              t_sq += dir;
            }
          }

          // note ROOK SHIFT
          if (SQOFFBOARD(shft_t_R_sq) === BOOL.FALSE) {
            if (
              GameBoard.dyad === 0n ||
              GameBoard.dyad === 1n ||
              GameBoard.dyad === dyad
            ) {
              // note ROOK SHIFT
              if (pce === PIECES.wR && GameBoard.whiteArcane & (8n << 12n)) {
                AddQuietMove(
                  MOVE(
                    sq,
                    shft_t_R_sq,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    (8n << 39n) | (GameBoard.dyad << 27n)
                  )
                );
              }
              if (pce === PIECES.bR && GameBoard.blackArcane & (8n << 12n)) {
                AddQuietMove(
                  MOVE(
                    sq,
                    shft_t_R_sq,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    (8n << 39n) | (GameBoard.dyad << 27n)
                  )
                );
              }
            }
          }
          // note BISHOP SHIFT
          if (SQOFFBOARD(shft_t_B_sq) === BOOL.FALSE) {
            if (
              GameBoard.dyad === 0n ||
              GameBoard.dyad === 1n ||
              GameBoard.dyad === dyad
            ) {
              if (pce === PIECES.wB && GameBoard.whiteArcane & (4n << 12n)) {
                AddQuietMove(
                  MOVE(
                    sq,
                    shft_t_B_sq,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    (4n << 39n) | (GameBoard.dyad << 27n)
                  )
                );
              }
              if (pce === PIECES.bB && GameBoard.blackArcane & (4n << 12n)) {
                AddQuietMove(
                  MOVE(
                    sq,
                    shft_t_B_sq,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    PIECES.EMPTY,
                    (4n << 39n) | (GameBoard.dyad << 27n)
                  )
                );
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
