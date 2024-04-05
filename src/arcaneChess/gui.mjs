import { GameBoard } from './board';
import { GenerateMoves, generatePowers, MoveExists } from './movegen';
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
  MAXDEPTH,
  PCEINDEX,
  COLOURS,
  PIECES,
  Kings,
} from './defs';
import { PrMove, PrSq, ParseMove, PrintMoveList } from './io';
import {
  PrintBoard,
  SqAttacked,
  FROMSQ,
  TOSQ,
  ARCANEFLAG,
  MFLAGSUMN,
} from './board.mjs';
import { MissionView } from 'src/pages/missionView/MissionView';
import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';
import { get } from 'lodash';
import arcaneChess from './arcaneChess.mjs';

export function validGroundMoves(summon = '', swap = '') {
  const moveMap = new Map();
  const validMovesReturn = validMoves(summon, swap);

  // moves
  // click button on UI = setCurrentArcane
  // is this for dyads?
  // if (GameBoard.currentArcane & POWERBITS[substr(sumn, 4)]) substring of box notation? {
  for (let move of validMovesReturn) {
    // todo, need to split to and from sqaures from things like x and &
    const from = PrMove(move, 'array')[0];
    const to = PrMove(move, 'array')[1];
    if (!moveMap.has(from)) {
      moveMap.set(from, []);
      // gameOver
      // updateReactUI();
    }
    moveMap.get(from).push(to);
  }
  return moveMap;
}

export const validSummonMoves = (piece) => {
  const moveMap = new Map();
  const validMovesReturn = validMoves('PLAYER', '', piece);

  // moves
  // click button on UI = setCurrentArcane
  // is this for dyads?
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

export function CheckResult(preset) {
  if (GameBoard.fiftyMove >= 100) {
    // $("#GameStatus").text("GAME DRAWN {fifty move rule}");
    return {
      gameOver: true,
      gameResult: 'fifty move rule',
    };
  }

  if (ThreeFoldRep() >= 2) {
    // $("#GameStatus").text("GAME DRAWN {3-fold repetition}");
    return {
      gameOver: true,
      gameResult: '3-fold repetition',
    };
  }

  if (DrawMaterial() === BOOL.TRUE) {
    // $("#GameStatus").text("GAME DRAWN {insufficient material to mate}");
    return {
      gameOver: true,
      gameResult: 'insufficient material',
    };
  }

  if (preset === 'capAllPieces') {
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

  // todo herring
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
      // $("#GameStatus").text("GAME OVER {black mates}");
      return {
        gameOver: true,
        gameResult: 'black mates',
      };
    } else {
      // $("#GameStatus").text("GAME OVER {white mates}");
      return {
        gameOver: true,
        gameResult: 'white mates',
      };
    }
  } else {
    // $("#GameStatus").text("GAME DRAWN {stalemate}");
    return {
      gameOver: true,
      gameResult: 'stalemate',
    };
  }

  // return BOOL.FALSE;
}

export function CheckAndSet(preset = '') {
  if (CheckResult(preset).gameOver) {
    GameController.GameOver = BOOL.TRUE;
    return true;
  } else {
    GameController.GameOver = BOOL.FALSE;
    return false;
  }
}

export function engineMove(thinkingTime, depth) {
  // generatePowers();
  // GenerateMoves(true, false, 'COMP');
  SearchController.depth = depth;
  SearchController.time = thinkingTime;
  const { bestMove, bestScore, line } = SearchPosition();
  MakeMove(bestMove);
  CheckAndSet();
  return bestMove;
}
