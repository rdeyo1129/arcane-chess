import {
  GameBoard,
  MFLAGCAP,
  FROMSQ,
  TOSQ,
  PrintBoard,
  ParseFen,
} from './board';
import {
  BOOL,
  PVENTRIES,
  MATE,
  INFINITE,
  MAXDEPTH,
  NOMOVE,
  BRD_SQ_NUM,
} from './defs';
import { EvalPosition } from './evaluate';
import { generatePlayableOptions } from './movegen';
import { MakeMove, TakeMove } from './makemove';
import { PrMove } from './io';
import { StorePvMove, ProbePvTable, GetPvLine } from './pvtable.mjs';
import { GameController } from './board.mjs';
import {
  CheckAndSet,
  upRightDiagCheck,
  downRightDiagCheck,
  fileCheck,
  rankCheck,
} from './gui.mjs';

export const SearchController = { thinking: BOOL.FALSE, best: NOMOVE };

SearchController.nodes;
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;

export function PickNextMove(MoveNum) {
  let index = 0;
  let bestScore = -1;
  let bestNum = MoveNum;

  for (
    index = MoveNum;
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    index++
  ) {
    if (GameBoard.moveScores[index] > bestScore) {
      bestScore = GameBoard.moveScores[index];
      bestNum = index;
    }
  }

  if (bestNum !== MoveNum) {
    let temp = 0;
    temp = GameBoard.moveScores[MoveNum];
    GameBoard.moveScores[MoveNum] = GameBoard.moveScores[bestNum];
    GameBoard.moveScores[bestNum] = temp;

    temp = GameBoard.moveList[MoveNum];
    GameBoard.moveList[MoveNum] = GameBoard.moveList[bestNum];
    GameBoard.moveList[bestNum] = temp;
  }
}

export function ClearPvTable() {
  for (let index = 0; index < PVENTRIES; index++) {
    GameBoard.PvTable[index].move = NOMOVE;
    GameBoard.PvTable[index].posKey = 0;
  }
}

export function CheckUp() {
  if (Date.now() - SearchController.start > SearchController.time) {
    SearchController.stop = BOOL.TRUE;
  }
}

export function IsRepetition() {
  let index = 0;

  for (
    index = GameBoard.hisPly - GameBoard.fiftyMove;
    index < GameBoard.hisPly - 1;
    index++
  ) {
    // may be dangerous for that optional chaining below but fixed a bug where there was no repetition
    if (GameBoard.posKey === GameBoard.history[index]?.posKey) {
      return BOOL.TRUE;
    }
  }

  return BOOL.FALSE;
}

export function AlphaBeta(alpha, beta, depth) {
  if (depth <= 0) {
    return EvalPosition();
  }

  if ((SearchController.nodes & 2047) === 0) {
    CheckUp();
  }

  if (
    upRightDiagCheck().colorWin === (GameBoard.side ^ 1) ||
    downRightDiagCheck().colorWin === (GameBoard.side ^ 1) ||
    fileCheck().colorWin === (GameBoard.side ^ 1) ||
    rankCheck().colorWin === (GameBoard.side ^ 1)
  ) {
    return -MATE + GameBoard.ply;
  }

  SearchController.nodes++;

  if (IsRepetition() && GameBoard.ply !== 0) {
    return 0;
  }

  if (GameBoard.ply > MAXDEPTH - 1) {
    return EvalPosition();
  }

  let Score = -INFINITE;

  generatePlayableOptions(true, false, 'COMP', 'COMP');

  let MoveNum = 0;
  let Legal = 0;
  let OldAlpha = alpha;
  let BestMove = NOMOVE;
  let Move = NOMOVE;

  let PvMove = ProbePvTable();
  if (PvMove !== NOMOVE) {
    for (
      MoveNum = GameBoard.moveListStart[GameBoard.ply];
      MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
      MoveNum++
    ) {
      if (GameBoard.moveList[MoveNum] === PvMove) {
        GameBoard.moveScores[MoveNum] = 2000000;
        break;
      }
    }
  }

  for (
    MoveNum = GameBoard.moveListStart[GameBoard.ply];
    MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
    MoveNum++
  ) {
    PickNextMove(MoveNum);

    Move = GameBoard.moveList[MoveNum];

    if (MakeMove(Move) === BOOL.FALSE) {
      continue;
    }
    Legal++;

    Score = -AlphaBeta(-beta, -alpha, depth - 1);

    TakeMove();

    if (SearchController.stop === BOOL.TRUE) {
      return 0;
    }

    if (Score > alpha) {
      if (Score >= beta) {
        if (Legal === 1) {
          SearchController.fhf++;
        }
        SearchController.fh++;
        if ((Move & MFLAGCAP) === 0) {
          GameBoard.searchKillers[MAXDEPTH + GameBoard.ply] =
            GameBoard.searchKillers[GameBoard.ply];
          GameBoard.searchKillers[GameBoard.ply] = Move;
        }
        return beta;
      }
      if ((Move & MFLAGCAP) === 0) {
        GameBoard.searchHistory[
          GameBoard.pieces[FROMSQ(Move)] * BRD_SQ_NUM + TOSQ(Move)
        ] += depth * depth;
      }
      alpha = Score;
      BestMove = Move;
    }
  }

  if (alpha !== OldAlpha) {
    StorePvMove(BestMove);
  }

  return alpha;
}

export function ClearForSearch() {
  let index = 0;

  for (index = 0; index < 31 * BRD_SQ_NUM; index++) {
    GameBoard.searchHistory[index] = 0;
  }

  for (index = 0; index < 3 * MAXDEPTH; index++) {
    GameBoard.searchKillers[index] = 0;
  }

  ClearPvTable();

  GameBoard.ply = 0;
  SearchController.nodes = 0;
  SearchController.fh = 0;
  SearchController.fhf = 0;
  SearchController.start = Date.now();
  SearchController.stop = BOOL.FALSE;

  GameBoard.cleanPV = [];
}

export function SearchPosition() {
  let bestMove = NOMOVE;
  let bestScore = -INFINITE;
  let Score = -INFINITE;
  let currentDepth = 0;
  let line;
  let PvNum;
  let c;
  let temporalPincer = '';

  ClearForSearch();

  for (
    currentDepth = 1;
    currentDepth <= SearchController.depth;
    currentDepth++
  ) {
    Score = AlphaBeta(-INFINITE, INFINITE, currentDepth);

    if (SearchController.stop === BOOL.TRUE) {
      break;
    }

    bestScore = Score;
    bestMove = ProbePvTable();
    line =
      'D:' +
      currentDepth +
      ' Best:' +
      PrMove(bestMove) +
      ' Score:' +
      bestScore +
      ' nodes:' +
      SearchController.nodes;

    PvNum = GetPvLine(currentDepth);
    line += ' Pv:';
    temporalPincer += `Depth ${currentDepth}` + ' ';
    for (c = 0; c < PvNum; c++) {
      line += ' ' + PrMove(GameBoard.PvArray[c]);
      temporalPincer += PrMove(GameBoard.PvArray[c]) + ' ';
    }
    if (currentDepth !== 1) {
      line +=
        ' Ordering:' +
        ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) +
        '%';
    }
    temporalPincer += ' ';
    console.log(line);
  }

  GameBoard.cleanPV = [bestScore, line];

  SearchController.best = bestMove;
  SearchController.thinking = BOOL.FALSE;

  return {
    bestScore: bestScore,
    bestMove: bestMove,
    line: line,
    temporalPincer,
  };
}

export function gameSim(thinkingTime) {
  const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  ParseFen(start);

  while (GameController.GameOver === BOOL.FALSE) {
    SearchController.depth = MAXDEPTH;
    SearchController.time = thinkingTime;

    // generatePowers();
    // GenerateMoves(true, false, 'COMP', 'COMP');

    const { bestMove } = SearchPosition();

    MakeMove(bestMove);
    CheckAndSet();
    PrintBoard();
  }
}
