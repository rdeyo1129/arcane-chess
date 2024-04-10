import _ from 'lodash';
import { GameBoard } from './board';
import { GenerateMoves, generatePowers } from './movegen';
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
  PCEINDEX,
  COLOURS,
  PIECES,
  Kings,
} from './defs';
import { PrMove, ParseMove } from './io';
import { SqAttacked } from './board.mjs';

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
  const validMovesReturn = validMoves('PLAYER', '', piece);

  for (let move of validMovesReturn) {
    const from = `${piece.toUpperCase()}@`;
    const to = PrMove(move, 'array')[1];

    if (from.includes('R') && from !== 'R@') {
      if (!moveMap.has(from)) {
        moveMap.set(from, []);
      }
      moveMap.get(from).push(to);
    } else {
      if (!moveMap.has(from)) {
        moveMap.set(from, []);
      }
      moveMap.get(from).push(to);
    }
  }
  return moveMap;
};

export function validMoves(
  summon = 'COMP',
  swap = 'COMP',
  userSummonPieceRoyalty = ''
) {
  const moves = [];
  let moveFound = NOMOVE;
  generatePowers();
  GenerateMoves(true, false, summon, swap, userSummonPieceRoyalty);
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
    royaltyEpsilon,
    true
  );

  if (isInitPromotion && pieceEpsilon === PIECES.EMPTY) {
    return { parsed, isInitPromotion: BOOL.TRUE };
  }

  MakeMove(parsed);

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
    GameBoard.pceNum[PIECES.bR] != 0
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

export function CheckResult(preset = GameBoard.preset) {
  if (GameBoard.fiftyMove >= 100) {
    return {
      gameOver: true,
      gameResult: 'fifty move rule',
    };
  }

  if (ThreeFoldRep() >= 2) {
    return {
      gameOver: true,
      gameResult: '3-fold repetition',
    };
  }

  if (DrawMaterial() === BOOL.TRUE) {
    return {
      gameOver: true,
      gameResult: 'insufficient material',
    };
  }

  if (preset === 'HORDE') {
    if (GameBoard.material[COLOURS.WHITE] === 150000) {
      return {
        gameOver: true,
        gameResult: 'black mates (all white material captured)',
      };
    }
  }
  if (preset === 'KOH' || preset === 'RACINGKINGS') {
    let gameOverObj = null;
    for (const sq of GameBoard.kohSquares) {
      if (GameBoard.pieces[sq] === PIECES.wK) {
        gameOverObj = {
          gameOver: true,
          gameResult: 'white mates (king takes the throne)',
        };
        break;
      } else if (GameBoard.pieces[sq] === PIECES.bK) {
        gameOverObj = {
          gameOver: true,
          gameResult: 'black mates (king takes the throne)',
        };
        break;
      }
    }
    if (gameOverObj) return gameOverObj;
  }

  if (preset === 'XCHECK') {
    if (
      GameBoard.xCheckLimit[GameBoard.side ^ 1] > 0 &&
      GameBoard.checksGiven[GameBoard.side ^ 1] >=
        GameBoard.xCheckLimit[GameBoard.side ^ 1]
    ) {
      if (GameBoard.side === COLOURS.WHITE) {
        return {
          gameOver: true,
          gameResult: 'black mates (x check ending)',
        };
      } else {
        return {
          gameOver: true,
          gameResult: 'white mates (x check ending)',
        };
      }
    }
  }

  if (preset === 'CAPALL') {
    if (GameBoard.material[COLOURS.WHITE] === 150000) {
      return {
        gameOver: true,
        gameResult: 'black mates (all white material captured)',
      };
    }
    if (GameBoard.material[COLOURS.BLACK] === 150000) {
      return {
        gameOver: true,
        gameResult: 'white mates (all black material captured)',
      };
    }
  }

  // todo herring and forced ep
  generatePowers();
  GenerateMoves(true, false, 'COMP', 'COMP');

  var MoveNum = 0;
  var found = 0;

  for (
    MoveNum = GameBoard.moveListStart[GameBoard.ply];
    MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
    ++MoveNum
  ) {
    if (MakeMove(GameBoard.moveList[MoveNum]) === BOOL.FALSE) {
      continue;
    }
    found++;
    TakeMove();
    break;
  }

  if (found !== 0) return BOOL.FALSE;

  var InCheck = SqAttacked(
    GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
    GameBoard.side ^ 1
  );

  if (InCheck === BOOL.TRUE) {
    if (GameBoard.side === COLOURS.WHITE) {
      return {
        gameOver: true,
        gameResult: 'black mates',
      };
    } else {
      return {
        gameOver: true,
        gameResult: 'white mates',
      };
    }
  } else {
    return {
      gameOver: true,
      gameResult: 'stalemate',
    };
  }
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

export function engineSuggestion(thinkingTime, depth) {
  SearchController.depth = depth;
  SearchController.time = thinkingTime;
  const { bestMove, bestScore, temporalPincer } = SearchPosition();
  return { bestMove, bestScore, temporalPincer };
}

export function engineMove(thinkingTime, depth) {
  SearchController.depth = depth;
  SearchController.time = thinkingTime;
  const { bestMove } = SearchPosition();
  MakeMove(bestMove);
  CheckAndSet();
  return bestMove;
}
