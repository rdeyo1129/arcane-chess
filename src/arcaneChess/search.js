import _ from 'lodash';
import {
  GameBoard,
  SqAttacked,
  MFLAGCAP,
  FROMSQ,
  TOSQ,
  CAPTURED,
  ARCANEFLAG,
  InCheck,
  MFLAGSUMN,
  PrintBoard,
  PROMOTED,
} from './board';
import {
  BOOL,
  PVENTRIES,
  MATE,
  INFINITE,
  MAXDEPTH,
  NOMOVE,
  PCEINDEX,
  Kings,
  BRD_SQ_NUM,
  now,
  PIECES,
} from './defs';
import { EvalPosition } from './evaluate';
import { GenerateMoves, generatePowers } from './movegen';
import { MakeMove, TakeMove } from './makemove';
import { PrMove } from './io';
import { StorePvMove, ProbePvTable, GetPvLine } from './pvtable';
import { PrintMoveList } from './io.mjs';
import { PrintPieceLists, PrintSqAttacked } from './board.mjs';
import { validMoves, validGroundMoves } from './gui.mjs';
import { whiteArcane, blackArcane } from './arcaneDefs.mjs';

export const SearchController = {};

SearchController.nodes;
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

// if summon royalty just happened, then we need to regenerate moves...?
// export const isSummonMove = (move) => {
//   return move & MFLAGSUMN;
// };

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
  if (now() - SearchController.start > SearchController.time) {
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
    if (GameBoard.posKey === GameBoard.history[index].posKey) {
      return BOOL.TRUE;
    }
  }

  return BOOL.FALSE;
}

export function Quiescence(alpha, beta) {
  if ((SearchController.nodes & 2047) === 0) {
    CheckUp();
  }

  SearchController.nodes++;

  if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply !== 0) {
    return 0;
  }

  if (GameBoard.ply > MAXDEPTH - 1) {
    return EvalPosition();
  }

  let Score = EvalPosition();

  if (Score >= beta) {
    return beta;
  }

  if (Score > alpha) {
    alpha = Score;
  }

  generatePowers();

  GenerateMoves(true, true);

  let MoveNum = 0;
  let Legal = 0;
  let CheckCount = 0;
  let OldAlpha = alpha;
  let BestMove = NOMOVE;
  let Move = NOMOVE;

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

    if (InCheck() === BOOL.TRUE) {
      CheckCount++;
      if (
        GameBoard.xCheckLimit[GameBoard.side] > 0 &&
        CheckCount >= GameBoard.xCheckLimit[GameBoard.side]
      ) {
        TakeMove();
        break;
      }
    }

    Score = -Quiescence(-beta, -alpha);

    TakeMove();

    if (SearchController.stop === BOOL.TRUE) {
      return 0;
    }

    if (
      (GameBoard.pieces[FROMSQ(Move)] === PIECES.wK ||
        GameBoard.pieces[FROMSQ(Move)] === PIECES.bK) &&
      _.includes(GameBoard.kohSquares, TOSQ(Move))
    ) {
      BestMove = Move;
      alpha = MATE - GameBoard.ply;
    }

    if (Score > alpha) {
      if (Score >= beta) {
        if (Legal === 1) {
          SearchController.fhf++;
        }
        SearchController.fh++;
        return beta;
      }
      alpha = Score;
      BestMove = Move;
    }
  }

  if (
    GameBoard.xCheckLimit[GameBoard.side ^ 1] > 0 &&
    CheckCount >= GameBoard.xCheckLimit[GameBoard.side ^ 1]
  ) {
    return MATE - GameBoard.ply;
  }

  if (alpha !== OldAlpha) {
    StorePvMove(BestMove);
  }

  return alpha;
}

export function AlphaBeta(alpha, beta, depth) {
  if (depth <= 0) {
    return Quiescence(alpha, beta);
  }

  if ((SearchController.nodes & 2047) === 0) {
    CheckUp();
  }

  SearchController.nodes++;

  if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply !== 0) {
    return 0;
  }

  if (GameBoard.ply > MAXDEPTH - 1) {
    return EvalPosition();
  }

  let InCheckA = SqAttacked(
    GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)],
    GameBoard.side ^ 1
  );

  if (InCheckA === BOOL.TRUE) {
    depth++;
  }

  let Score = -INFINITE;

  generatePowers();
  // todo make function that generates moves summons and swaps
  GenerateMoves();
  // todo regenerate if herring edge case hit

  // should take care of herrings but what about stalemate?
  // todo assign generate moves with herrings to a variable and check here
  // if (validMoves().length === 0 && !InCheck()) {
  //   console.log('valid moves false');
  //   GenerateMoves(false);
  //   console.log(validGroundMoves());
  // }

  let MoveNum = 0;
  let Legal = 0;
  let CheckCount = 0;
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

    if (InCheck() === BOOL.TRUE) {
      CheckCount++;
      if (
        GameBoard.xCheckLimit[GameBoard.side] > 0 &&
        CheckCount >= GameBoard.xCheckLimit[GameBoard.side]
      ) {
        TakeMove();
        break;
      }
    }

    // this is the black box, it will give you a magical score that you can assume is correct at the deepest level
    Score = -AlphaBeta(-beta, -alpha, depth - 1);

    TakeMove();

    if (SearchController.stop === BOOL.TRUE) {
      return 0;
    }

    if (
      (GameBoard.pieces[FROMSQ(Move)] === PIECES.wK ||
        GameBoard.pieces[FROMSQ(Move)] === PIECES.bK) &&
      _.includes(GameBoard.kohSquares, TOSQ(Move))
    ) {
      BestMove = Move;
      alpha = MATE - GameBoard.ply;
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

  if (
    GameBoard.xCheckLimit[GameBoard.side ^ 1] > 0 &&
    CheckCount >= GameBoard.xCheckLimit[GameBoard.side ^ 1]
  ) {
    return MATE - GameBoard.ply;
  }

  // rook entangled mate
  // future sight should be the last one
  // implant (from sq)
  // vision (from and to sq)
  // future sight (computer line)
  // hints and arrows soon, find out how to draw them automatically
  // insert elements onto chessboard that are sent to the dom?
  // insert using jsx interpolation for the
  // more thinking time for the computer

  if (Legal === 0) {
    if (InCheckA === BOOL.TRUE) {
      return -MATE + GameBoard.ply;
    } else {
      return 0;
    }
  }

  if (alpha !== OldAlpha) {
    StorePvMove(BestMove);
  }

  return alpha;
}

export function ClearForSearch() {
  let index = 0;

  for (index = 0; index < 25 * BRD_SQ_NUM; index++) {
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
  SearchController.start = new Date();
  SearchController.stop = BOOL.FALSE;
}

export function SearchPosition() {
  let bestMove = NOMOVE;
  let bestScore = -INFINITE;
  let Score = -INFINITE;
  let currentDepth = 0;
  let line;
  let PvNum;
  let c;

  ClearForSearch();

  for (
    currentDepth = 1;
    // currentDepth <= SearchController.depth;
    currentDepth <= 5;
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
    for (c = 0; c < PvNum; c++) {
      line += ' ' + PrMove(GameBoard.PvArray[c]);
    }
    if (currentDepth !== 1) {
      line +=
        ' Ordering:' +
        ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) +
        '%';
    }
    console.log(line);
  }

  SearchController.best = bestMove;
  SearchController.thinking = BOOL.FALSE;
  // todo
  // UpdateDOMStats(bestScore, currentDepth);
}

export function UpdateDOMStats(dom_score, dom_depth) {
  let scoreText = 'Score: ' + (dom_score / 100).toFixed(2);
  if (Math.abs(dom_score) > MATE - MAXDEPTH) {
    scoreText = 'Score: Mate In ' + (MATE - Math.abs(dom_score) - 1) + ' moves';
  }

  $('#OrderingOut').text(
    'Ordering: ' +
      ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) +
      '%'
  );
  $('#DepthOut').text('Depth: ' + dom_depth);
  $('#ScoreOut').text(scoreText);
  $('#NodesOut').text('Nodes: ' + SearchController.nodes);
  $('#TimeOut').text(
    'Time: ' + (($.now() - SearchController.start) / 1000).toFixed(1) + 's'
  );
  $('#BestOut').text('BestMove: ' + PrMove(SearchController.best));
}
