import _ from 'lodash';
import { GameBoard, FROMSQ } from './board';
import {
  // generatePlayableOptions,
  GenerateMoves,
  generatePowers,
  forcedEpAvailable,
  herrings,
} from './movegen';
import { SearchController, SearchPosition } from './search';
import {
  MakeMove,
  TakeMove,
  MovePiece,
  ClearPiece,
  AddPiece,
} from './makemove';
import {
  NOMOVE,
  BOOL,
  prettyToSquare,
  GameController,
  // PCEINDEX,
  COLOURS,
  PIECES,
  // Kings,
  PceChar,
  RtyChar,
  SQUARES,
  PieceCol,
} from './defs';
import { PrMove, ParseMove, PrSq } from './io';
// import { SqAttacked } from './board.mjs';
import { blackArcaneConfig, whiteArcaneConfig } from './arcaneDefs.mjs';

export function validGroundMoves(summon = '', swap = '') {
  const moveMap = new Map();
  const validMovesReturn = validMoves(summon, swap);

  for (let move of validMovesReturn) {
    const from = PrMove(move, 'array')[0];
    const to = PrMove(move, 'array')[1];
    if (!moveMap.has(from)) {
      moveMap.set(from, []);
    }
    moveMap.get(from).push(to);
  }
  return moveMap;
}

export const validSummonMoves = (piece) => {
  const moveMap = new Map();
  const validMovesReturn = validMoves('SUMMON', '', piece);

  for (let move of validMovesReturn) {
    const from =
      piece >= 30
        ? `R${RtyChar.split('')[piece]}@`
        : `${PceChar.split('')[piece].toUpperCase()}@`;
    const to = PrMove(move, 'array')[1];

    if (!moveMap.has(from)) {
      moveMap.set(from, []);
    }
    moveMap.get(from).push(to);
  }
  return moveMap;
};

export const validOfferingMoves = (userSummonPceRty) => {
  const moveMap = new Map();
  const validMovesReturn = validMoves('OFFERING', '', userSummonPceRty);
  for (let move of validMovesReturn) {
    const from = `o${userSummonPceRty}@`;
    const to = PrSq(FROMSQ(move));
    if (!moveMap.has(from)) {
      moveMap.set(from, []);
    }
    moveMap.get(from).push(to);
  }
  return moveMap;
};

export function validMoves(
  summon = 'COMP',
  swap = 'COMP',
  userSummonPieceRoyalty = 0,
  capturesOnly = false
) {
  const moves = [];
  let moveFound = NOMOVE;

  generatePowers();
  GenerateMoves(true, capturesOnly, summon, swap, userSummonPieceRoyalty);

  for (
    let index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    moveFound = GameBoard.moveList[index];
    if (MakeMove(moveFound) === BOOL.FALSE) {
      continue;
    }
    TakeMove();
    moves.push(moveFound);
  }

  if (moves.length === 0 && (forcedEpAvailable || herrings.length)) {
    generatePowers();
    GenerateMoves(false, capturesOnly, summon, swap, userSummonPieceRoyalty);
    for (
      let index = GameBoard.moveListStart[GameBoard.ply];
      index < GameBoard.moveListStart[GameBoard.ply + 1];
      ++index
    ) {
      moveFound = GameBoard.moveList[index];
      if (MakeMove(moveFound) === BOOL.FALSE) {
        continue;
      }
      TakeMove();
      moves.push(moveFound);
    }
    return moves;
  }
  return moves;
}

export function editAddPiece(sq, pce) {
  AddPiece(prettyToSquare(sq), pce);
}

export function editClearPiece(sq) {
  ClearPiece(prettyToSquare(sq));
}

export function editMovePiece(orig, dest) {
  var from = prettyToSquare(orig);
  var to = prettyToSquare(dest);
  MovePiece(from, to);
}

export function MakeUserMove(
  orig,
  dest,
  pieceEpsilon = PIECES.EMPTY,
  swapType = '',
  royaltyEpsilon = PIECES.EMPTY
) {
  const { parsed, isInitPromotion } = ParseMove(
    orig,
    dest,
    pieceEpsilon,
    swapType,
    royaltyEpsilon
  );

  if (isInitPromotion && pieceEpsilon === PIECES.EMPTY) {
    return { parsed, isInitPromotion: BOOL.TRUE };
  }

  MakeMove(parsed, 'userMove');

  CheckAndSet();

  return { parsed, isInitPromotion: BOOL.FALSE };
}

export function DrawMaterial() {
  if (GameBoard.pceNum[PIECES.wP] != 0 || GameBoard.pceNum[PIECES.bP] != 0)
    return BOOL.FALSE;
  if (
    GameBoard.pceNum[PIECES.wQ] != 0 ||
    GameBoard.pceNum[PIECES.bQ] != 0 ||
    GameBoard.pceNum[PIECES.wR] != 0 ||
    GameBoard.pceNum[PIECES.bR] != 0 ||
    GameBoard.pceNum[PIECES.wT] != 0 ||
    GameBoard.pceNum[PIECES.bT] != 0 ||
    GameBoard.pceNum[PIECES.wM] != 0 ||
    GameBoard.pceNum[PIECES.bM] != 0
  )
    return BOOL.FALSE;
  if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) {
    return BOOL.FALSE;
  }
  if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) {
    return BOOL.FALSE;
  }

  if (GameBoard.pceNum[PIECES.wN] != 0 && GameBoard.pceNum[PIECES.wB] != 0) {
    return BOOL.FALSE;
  }
  if (GameBoard.pceNum[PIECES.bN] != 0 && GameBoard.pceNum[PIECES.bB] != 0) {
    return BOOL.FALSE;
  }

  // spectre and wraith combos depending on what square complex they are on can mate
  // 2 wraiths on different
  // 2 spectres on different
  // 1 of each on same

  return BOOL.TRUE;
}

export function ThreeFoldRep() {
  var i = 0,
    r = 0;

  for (i = 0; i < GameBoard.hisPly; ++i) {
    if (GameBoard.history[i].posKey == GameBoard.posKey) {
      r++;
    }
  }
  return r;
}

const upRightStartSquares = [
  91, 81, 71, 61, 51, 41, 31, 21, 22, 23, 24, 25, 26, 27, 28,
];

const downRightStartSquares = [
  98, 97, 96, 95, 94, 93, 92, 91, 81, 71, 61, 51, 41, 31, 21,
];

export const upRightDiagCheck = () => {
  for (let startSq of upRightStartSquares) {
    let t_sq = startSq;
    let comboCountWhite = 0;
    let comboCountBlack = 0;
    while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
      let pce = GameBoard.pieces[t_sq];
      let pceCol = PieceCol[pce];
      if (pce === 0 || pce === 100) {
        comboCountWhite = 0;
        comboCountBlack = 0;
      } else if (pceCol === COLOURS.WHITE) {
        comboCountBlack = 0;
        comboCountWhite += 1;
        if (comboCountWhite === 4) {
          return {
            gameOver: true,
            gameResult: 'white connects four',
            colorWin: COLOURS.WHITE,
          };
        }
      } else if (pceCol === COLOURS.BLACK) {
        comboCountWhite = 0;
        comboCountBlack += 1;
        if (comboCountBlack === 4) {
          return {
            gameOver: true,
            gameResult: 'black connects four',
            colorWin: COLOURS.BLACK,
          };
        }
      }
      t_sq += 11;
    }
  }
  return {
    gameOver: false,
    gameResult: 'game continues',
  };
};

export const downRightDiagCheck = () => {
  for (let startSq of downRightStartSquares) {
    let t_sq = startSq;
    let comboCountWhite = 0;
    let comboCountBlack = 0;
    while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
      let pce = GameBoard.pieces[t_sq];
      let pceCol = PieceCol[pce];
      if (pce === 0 || pce === 100) {
        comboCountWhite = 0;
        comboCountBlack = 0;
      } else if (pceCol === COLOURS.WHITE) {
        comboCountBlack = 0;
        comboCountWhite += 1;
        if (comboCountWhite === 4) {
          return {
            gameOver: true,
            gameResult: 'white connects four',
            colorWin: COLOURS.WHITE,
          };
        }
      } else if (pceCol === COLOURS.BLACK) {
        comboCountWhite = 0;
        comboCountBlack += 1;
        if (comboCountBlack === 4) {
          return {
            gameOver: true,
            gameResult: 'black connects four',
            colorWin: COLOURS.BLACK,
          };
        }
      }
      t_sq -= 9;
    }
  }
  return {
    gameOver: false,
    gameResult: 'game continues',
  };
};

export const fileCheck = () => {
  for (let file = 1; file < 8; file++) {
    let t_sq = 20 + file;
    let comboCountWhite = 0;
    let comboCountBlack = 0;

    while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
      let pce = GameBoard.pieces[t_sq];
      let pceCol = PieceCol[pce];
      if (pce === 0 || pce === 100) {
        comboCountWhite = 0;
        comboCountBlack = 0;
      } else if (pceCol === COLOURS.WHITE) {
        comboCountBlack = 0;
        comboCountWhite += 1;
        if (comboCountWhite === 4) {
          return {
            gameOver: true,
            gameResult: 'white connects four',
            colorWin: COLOURS.WHITE,
          };
        }
      } else if (pceCol === COLOURS.BLACK) {
        comboCountWhite = 0;
        comboCountBlack += 1;
        if (comboCountBlack === 4) {
          return {
            gameOver: true,
            gameResult: 'black connects four',
            colorWin: COLOURS.BLACK,
          };
        }
      }
      t_sq += 10;
    }
  }
  return {
    gameOver: false,
    gameResult: 'game continues',
  };
};

export const rankCheck = () => {
  for (let rank = 2; rank < 9; rank++) {
    let t_sq = rank * 10 + 1;
    let comboCountWhite = 0;
    let comboCountBlack = 0;
    while (GameBoard.pieces[t_sq] !== SQUARES.SQOFFBOARD) {
      let pce = GameBoard.pieces[t_sq];
      let pceCol = PieceCol[pce];
      if (pce === 0 || pce === 100) {
        comboCountWhite = 0;
        comboCountBlack = 0;
      } else if (pceCol === COLOURS.WHITE) {
        comboCountBlack = 0;
        comboCountWhite += 1;
        if (comboCountWhite === 4) {
          return {
            gameOver: true,
            gameResult: 'white connects four',
            colorWin: COLOURS.WHITE,
          };
        }
      } else if (pceCol === COLOURS.BLACK) {
        comboCountWhite = 0;
        comboCountBlack += 1;
        if (comboCountBlack === 4) {
          return {
            gameOver: true,
            gameResult: 'black connects four',
            colorWin: COLOURS.BLACK,
          };
        }
      }
      t_sq += 1;
    }
  }
  return {
    gameOver: false,
    gameResult: 'game continues',
  };
};

export function CheckResult() {
  const URC = upRightDiagCheck();
  const DRC = downRightDiagCheck();
  const FC = fileCheck();
  const RC = rankCheck();

  if (ThreeFoldRep() >= 2) {
    return {
      gameOver: true,
      gameResult: '3-fold repetition',
    };
  }

  if (URC.gameOver) {
    return {
      gameOver: true,
      gameResult: URC.gameResult,
    };
  }
  if (DRC.gameOver) {
    return {
      gameOver: true,
      gameResult: DRC.gameResult,
    };
  }
  if (FC.gameOver) {
    return {
      gameOver: true,
      gameResult: FC.gameResult,
    };
  }
  if (RC.gameOver) {
    return {
      gameOver: true,
      gameResult: RC.gameResult,
    };
  }

  return {
    gameOver: false,
    gameResult: 'game continues',
  };
}

export function CheckAndSet() {
  if (CheckResult().gameOver) {
    GameController.GameOver = BOOL.TRUE;
    return true;
  } else {
    GameController.GameOver = BOOL.FALSE;
    return false;
  }
}

export async function PreSearch(thinkingTime, depth, engineColor) {
  // not sure if needed but fixed problem with white not moving first
  // if (GameController.GameOver === BOOL.FALSE) {
  SearchController.thinking = BOOL.TRUE;
  await new Promise((resolve) => setTimeout(resolve, 200));
  const { bestMove, bestScore, text } = startSearch(
    thinkingTime,
    depth,
    engineColor
  );
  return { bestMove, bestScore, text };
  // }
}

export function engineSuggestion() {
  SearchController.depth = 7;
  SearchController.time = 8 * 1000;
  const { bestMove, bestScore, temporalPincer } = SearchPosition();
  return { bestMove, bestScore, temporalPincer };
}

const returnDialogueTypes = (score) => {
  const dialogue = [];

  if (score >= 700) {
    dialogue.push('lose1');
  }
  if (score >= 1500) {
    dialogue.push('lose2');
  }
  if (score >= 3000) {
    dialogue.push('lose3');
  }

  if (score <= -700) {
    dialogue.push('win1');
  }
  if (score <= -1500) {
    dialogue.push('win2');
  }
  if (score <= -3000) {
    dialogue.push('win3');
  }

  return dialogue;
};

export function startSearch(thinkingTime, depth, engineColor) {
  const engineArcana =
    engineColor === COLOURS.WHITE ? whiteArcaneConfig : blackArcaneConfig;
  const colorInt = engineColor === 'white' ? COLOURS.WHITE : COLOURS.BLACK;

  SearchController.depth = depth || 7;
  SearchController.time = thinkingTime * 1000;

  const { bestMove, bestScore } = SearchPosition();
  let text = [...returnDialogueTypes(bestScore)];

  if (
    _.some(_.keys(engineArcana), (key) => key === 'modsPHA') &&
    GameBoard.invisibility[colorInt] <= 0 &&
    engineArcana.modsPHA > 0
  ) {
    if (bestScore > 500 || bestScore < -500) {
      if (Math.random() > 0.5) {
        GameBoard.invisibility[colorInt] = 6;
        if (colorInt === COLOURS.WHITE) {
          whiteArcaneConfig.modsPHA -= 1;
        } else {
          blackArcaneConfig.modsPHA -= 1;
        }
        text.push(`${engineColor} used phantom mist!`);
      }
    }
  }
  if (
    _.some(_.keys(engineArcana), (key) => key === 'modsSUS') &&
    GameBoard.suspend <= 0 &&
    engineArcana.modsSUS > 0 &&
    GameBoard.invisibility[colorInt] <= 0
  ) {
    if (bestScore < -900) {
      if (Math.random() > 0.5) {
        GameBoard.suspend = 6;
        if (colorInt === COLOURS.WHITE) {
          whiteArcaneConfig.modsSUS -= 1;
        } else {
          blackArcaneConfig.modsSUS -= 1;
        }

        const { bestMove, bestScore } = SearchPosition();

        text = [...returnDialogueTypes(bestScore)];
        text.push(
          `${engineColor} used bulletproof. No captures, checks, or promotions for 3 turns!`
        );

        MakeMove(bestMove);
        CheckAndSet();
        return { bestMove, bestScore, text };
      }
    }
  }

  MakeMove(bestMove);
  CheckAndSet();
  return { bestMove, bestScore, text };
}
