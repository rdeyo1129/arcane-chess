import { GameBoard } from './board';
import { SQUARES, PCEINDEX, PIECES, SQ64, COLOURS, PieceCol } from './defs';

// 4 5 6 (maybe 7) in a row for win scenarios optional?
// no king herring valkyrie pawn
// number of starting pieces and placements?
// different board sizes might be too difficult
// optional setups for different games? or keep them all
// no captures

// prettier-ignore
const stackTable = [
  10, 10, 10, 10, 10, 10, 10, 10,
  10, 20, 20, 20, 20, 20, 20, 10,
  10, 20, 30, 30, 30, 30, 20, 10,
  10, 20, 30, 40, 40, 30, 20, 10,
  10, 20, 30, 40, 40, 40, 30, 20,
  10, 20, 30, 30, 30, 30, 20, 10,
  10, 20, 20, 20, 20, 20, 20, 10,
  10, 10, 10, 10, 10, 10, 10, 10,
];

// checks before a piece, but need to also check after piece
// to check and set from gui

// to add points on makemove and not from here

export function EvalPosition() {
  let score = 0;

  const upRightStartSquares = [
    91, 81, 71, 61, 51, 41, 31, 21, 22, 23, 24, 25, 26, 27, 28,
  ];

  const downRightStartSquares = [
    98, 97, 96, 95, 94, 93, 92, 91, 81, 71, 61, 51, 41, 31, 21,
  ];

  const upRightDiagEval = () => {
    for (let startSq of upRightStartSquares) {
      let t_sq = startSq;
      let comboCountWhite = 0;
      let comboCountBlack = 0;
      let spaceCount = 0;
      while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
        let pce = GameBoard.pieces[t_sq];
        let pceCol = PieceCol[pce];
        if (pce === 0 || pce === 100) {
          spaceCount += 1;
          comboCountWhite = 0;
          comboCountBlack = 0;
        }
        if (pceCol === COLOURS.WHITE) {
          comboCountBlack = 0;
          comboCountWhite += 1;
          if (comboCountWhite > 1) {
            score += 100;
          }
          if (spaceCount === 1) {
            score += 50;
            spaceCount = 0;
          }
        }
        if (pceCol === COLOURS.BLACK) {
          comboCountWhite = 0;
          comboCountBlack += 1;
          if (comboCountBlack > 1) {
            score -= 100;
          }
          if (spaceCount === 1) {
            score -= 50;
            spaceCount = 0;
          }
        }
        t_sq += 11;
      }
    }
  };

  const downRightDiagEval = () => {
    for (let startSq of downRightStartSquares) {
      let t_sq = startSq;
      let comboCountWhite = 0;
      let comboCountBlack = 0;
      let spaceCount = 0;
      while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
        let pce = GameBoard.pieces[t_sq];
        let pceCol = PieceCol[pce];
        if (pce === 0 || pce === 100) {
          spaceCount += 1;
          comboCountWhite = 0;
          comboCountBlack = 0;
        }
        if (pceCol === COLOURS.WHITE) {
          comboCountBlack = 0;
          comboCountWhite += 1;
          if (comboCountWhite > 1) {
            score += 100;
          }
          if (spaceCount === 1) {
            score += 50;
            spaceCount = 0;
          }
        }
        if (pceCol === COLOURS.BLACK) {
          comboCountWhite = 0;
          comboCountBlack += 1;
          if (comboCountBlack > 1) {
            score -= 100;
          }
          if (spaceCount === 1) {
            score -= 50;
            spaceCount = 0;
          }
        }
        t_sq -= 9;
      }
    }
  };

  const filesEval = () => {
    for (let file = 1; file < 8; file++) {
      let t_sq = 20 + file;
      let comboCountWhite = 0;
      let comboCountBlack = 0;
      let spaceCount = 0;
      while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
        let pce = GameBoard.pieces[t_sq];
        let pceCol = PieceCol[pce];
        if (pce === 0 || pce === 100) {
          spaceCount += 1;
          comboCountWhite = 0;
          comboCountBlack = 0;
        }
        if (pceCol === COLOURS.WHITE) {
          comboCountBlack = 0;
          comboCountWhite += 1;
          if (comboCountWhite > 1) {
            score += 100;
          }
          if (spaceCount === 1) {
            score += 50;
            spaceCount = 0;
          }
        }
        if (pceCol === COLOURS.BLACK) {
          comboCountWhite = 0;
          comboCountBlack += 1;
          if (comboCountBlack > 1) {
            score -= 100;
          }
          if (spaceCount === 1) {
            score -= 50;
            spaceCount = 0;
          }
        }
        t_sq += 10;
      }
    }
  };

  const ranksEval = () => {
    for (let rank = 2; rank < 9; rank++) {
      let t_sq = rank * 10 + 1;
      let comboCountWhite = 0;
      let comboCountBlack = 0;
      let spaceCount = 0;
      while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
        let pce = GameBoard.pieces[t_sq];
        let pceCol = PieceCol[pce];
        if (pce === 0 || pce === 100) {
          spaceCount += 1;
          comboCountWhite = 0;
          comboCountBlack = 0;
        }
        if (pceCol === COLOURS.WHITE) {
          comboCountBlack = 0;
          comboCountWhite += 1;
          if (comboCountWhite > 1) {
            score += 100;
          }
          if (spaceCount === 1) {
            score += 50;
            spaceCount = 0;
          }
        }
        if (pceCol === COLOURS.BLACK) {
          comboCountWhite = 0;
          comboCountBlack += 1;
          if (comboCountBlack > 1) {
            score -= 100;
          }
          if (spaceCount === 1) {
            score -= 50;
            spaceCount = 0;
          }
        }
        t_sq += 1;
      }
    }
  };

  filesEval();
  ranksEval();
  upRightDiagEval();
  downRightDiagEval();

  let pce;
  let sq;
  let pceNum;

  pce = PIECES.wN;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bN;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wS;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bS;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wV;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bV;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wB;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bB;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wM;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bM;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wR;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bR;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wQ;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bQ;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wT;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bT;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wZ;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bZ;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wU;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bU;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  pce = PIECES.wW;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score += stackTable[SQ64(sq)];
  }

  pce = PIECES.bW;
  for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
    sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
    score -= stackTable[SQ64(sq)];
  }

  if (GameBoard.side === COLOURS.WHITE) {
    return score;
  } else {
    return -score;
  }
}
