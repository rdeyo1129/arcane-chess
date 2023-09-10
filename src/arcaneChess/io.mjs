// import all vars and functions from arcanechess folder that are not defined
import { GameBoard, FROMSQ, TOSQ, PROMOTED } from './board';
import {
  PIECES,
  BOOL,
  FilesBrd,
  RanksBrd,
  FileChar,
  RankChar,
  PieceKnight,
  PieceRookQueen,
  PieceBishopQueen,
} from './defs';

export function PrSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

// todo edits
export function PrMove(move) {
  var MvStr;

  var ff = FilesBrd[FROMSQ(move)];
  var rf = RanksBrd[FROMSQ(move)];
  var ft = FilesBrd[TOSQ(move)];
  var rt = RanksBrd[TOSQ(move)];

  MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

  var promoted = PROMOTED(move);

  if (promoted != PIECES.EMPTY) {
    var pchar = 'q';
    if (PieceKnight[promoted] == BOOL.TRUE) {
      pchar = 'n';
    } else if (
      PieceRookQueen[promoted] == BOOL.TRUE &&
      PieceBishopQueen[promoted] == BOOL.FALSE
    ) {
      pchar = 'r';
    } else if (
      PieceRookQueen[promoted] == BOOL.FALSE &&
      PieceBishopQueen[promoted] == BOOL.TRUE
    ) {
      pchar = 'b';
    }
    MvStr += pchar;
  }
  return MvStr;
}

export function PrintMoveList() {
  var index;
  var move;
  var num = 1;
  console.log('MoveList:');

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    move = GameBoard.moveList[index];
    console.log(
      'Move:' +
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
