import _ from 'lodash';

// import all vars and functions from arcanechess folder that are not defined
import {
  FilesBrd,
  SQUARES,
  FR2SQ,
  BRD_SQ_NUM,
  PieceKeys,
  SideKey,
  CastleKeys,
  RANKS,
  FILES,
  COLOURS,
  PIECES,
  PieceCol,
  PieceVal,
  CASTLEBIT,
  BOOL,
  MAXPOSITIONMOVES,
  MAXDEPTH,
  PieceKnight,
  PieceRookQueen,
  PieceBishopQueen,
  PieceKing,
  RkDir,
  BiDir,
  KiDir,
  KnDir,
  VaDir,
  SpDir,
  HrDir,
  PieceVanguard,
  PieceHerring,
  PieceSpectre,
  PceChar,
  FileChar,
  RankChar,
  SideChar,
  SQ120,
  updateStartFen,
  PCEINDEX,
} from './defs';
import { PrSq } from './io';
import { whiteArcane, blackArcane } from './arcaneDefs';

export function FROMSQ(m) {
  return m & 0x7fn;
}
export function TOSQ(m) {
  return (m >> 7n) & 0x7fn;
}
export function CAPTURED(m) {
  return (m >> 14n) & 0xfn;
}
export function PROMOTED(m) {
  return (m >> 20n) & 0xfn;
}

// todo might need shifting
export function DYAD(m) {
  return (m >> 27n) & 0xfffn;
}
export function SHIFT(m) {
  return (m >> 39n) & 0xfn;
}
export function SWAP(m) {
  return (m >> 43n) & 0x7n;
}
export function SUMMON(m) {
  return (m >> 46n) & 0xffffn;
}

/*
    dyad << 27 hex?
    shft << 39 
    swap << 43
    sumn << 46
    con flag
    off flag

    0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
    0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
    0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
    0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000
    0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 1000 0000 0000 0000 0000 -> pawn start 0x80000
    0000 0000 0000 0000 0000 0000 0000 0000 0000 0011 1111 0000 0000 0000 0000 0000 -> prom >> 20, 0xF
    0000 0000 0000 0000 0000 0000 0000 0000 0000 0100 0000 0000 0000 0000 0000 0000 -> Castle 0x4000000
    0000 0000 0000 0000 0000 0000 0111 1111 1111 1000 0000 0000 0000 0000 0000 0000 -> dyad 0xeff8000000
    0000 0000 0000 0000 0000 0111 1000 0000 0000 0000 0000 0000 0000 0000 0000 0000 -> shft 0xe8000000000
    0000 0000 0000 0000 0011 1000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 -> swap 0x380000000000
    0011 1111 1111 1111 1100 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 -> sumn 0x3fffd00000000000
    0100 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 -> con 0x4000000000000000
    1000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 -> off 0x8000000000000000

    move
    return (
      from |
      (to << 7) |
      (captured << 14) |
      (promoted << 20) |
      (summoned << 46) |
      flag
    );
  */

export const MFLAGEP = 0x40000n;
export const MFLAGPS = 0x80000n;
export const MFLAGCA = 0x4000000n;

export const MFLAGDYAD = 0xeff8000000n;
export const MFLAGSHFT = 0xe8000000000n;
export const MFLAGSWAP = 0x380000000000n;
export const MFLAGCON = 0x4000000000000000n;
export const MFLAGOFF = 0x8000000000000000n;

export const MFLAGCAP = 0x7c000n;
export const MFLAGPROM = 0x3f00000n;
export const MFLAGSUMN = 0x3fffd00000000000n;

export function SQOFFBOARD(sq) {
  if (FilesBrd[sq] == SQUARES.OFFBOARD) return BOOL.TRUE;
  return BOOL.FALSE;
}

export function HASH_PCE(pce, sq) {
  GameBoard.posKey ^= BigInt(PieceKeys[pce * 120n + sq]);
}
export function HASH_CA() {
  GameBoard.posKey ^= BigInt(CastleKeys[GameBoard.castlePerm]);
}
export function HASH_SIDE() {
  GameBoard.posKey ^= BigInt(SideKey);
}
export function HASH_EP() {
  GameBoard.posKey ^= BigInt(PieceKeys[GameBoard.enPas]);
}

export const GameController = {};
GameController.EngineSide = COLOURS.BOTH;
GameController.PlayerSide = COLOURS.BOTH;
GameController.GameOver = BOOL.FALSE;

export const UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;

export const GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0;
GameBoard.history = [];
GameBoard.PvTable = [];
GameBoard.ply = 0;
// Gameboard.SubPly = 0;
GameBoard.enPas = 0n;
GameBoard.castlePerm = 0n;
GameBoard.material = new Array(2); // WHITE, BLACK material of pieces
GameBoard.pceNum = new Array(24); // indexed by Pce
GameBoard.pList = new Array(25 * 10);
GameBoard.whiteArcane = 0n;
GameBoard.blackArcane = 0n;

// todo square conditions
// [ 23, 52, 88 ] ?
// todo override with the last placed condition
// ^ if any other royalties _.include square num, then remove them from that royalty array to override
GameBoard.royaltyQ = [];
GameBoard.royaltyZ = [];
GameBoard.royaltyU = [44];
GameBoard.royaltyV = [];
GameBoard.royaltyE = [];

GameBoard.posKey = 0n;
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPTH);

GameBoard.dyad = 0n;

export function CheckBoard() {
  let t_pceNum = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let t_material = [0, 0];
  let sq64, t_piece, t_pce_num, sq120;

  for (t_piece = PIECES.wP; t_piece <= PIECES.bV; t_piece++) {
    for (t_pce_num = 0; t_pce_num < GameBoard.pceNum[t_piece]; t_pce_num++) {
      sq120 = GameBoard.pList[PCEINDEX(t_piece, t_pce_num)];
      if (GameBoard.pieces[sq120] !== t_piece) {
        console.log('Error Pce Lists');
        return BOOL.FALSE;
      }
    }
  }

  for (sq64 = 0; sq64 < 64; sq64++) {
    sq120 = SQ120(sq64);
    t_piece = GameBoard.pieces[sq120];
    t_pceNum[t_piece]++;
    t_material[PieceCol[t_piece]] += PieceVal[t_piece];
  }

  for (t_piece = PIECES.wP; t_piece <= PIECES.bV; t_piece++) {
    if (t_pceNum[t_piece] !== GameBoard.pceNum[t_piece]) {
      console.log('Error t_pceNum');
      return BOOL.FALSE;
    }
  }

  if (
    t_material[COLOURS.WHITE] !== GameBoard.material[COLOURS.WHITE] ||
    t_material[COLOURS.BLACK] !== GameBoard.material[COLOURS.BLACK]
  ) {
    console.log('Error t_material');
    return BOOL.FALSE;
  }

  if (GameBoard.side !== COLOURS.WHITE && GameBoard.side !== COLOURS.BLACK) {
    console.log('Error GameBoard.side');
    return BOOL.FALSE;
  }

  if (GeneratePosKey() !== GameBoard.posKey) {
    console.log('Error GameBoard.posKey');
    return BOOL.FALSE;
  }
  return BOOL.TRUE;
}

export function PrintBoard() {
  let sq, file, rank, piece;

  console.log('\nGame Board:\n');
  for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
    let line = RankChar[rank] + '  ';
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      sq = FR2SQ(file, rank);
      piece = GameBoard.pieces[sq];
      line += ' ' + PceChar[piece] + ' ';
    }
    console.log(line);
  }

  console.log('');
  let line = '   ';
  for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
    line += ' ' + FileChar[file] + ' ';
  }

  console.log(line);
  console.log('side:' + SideChar[GameBoard.side]);
  console.log('enPas:' + GameBoard.enPas);
  line = '';

  if (GameBoard.castlePerm & BigInt(CASTLEBIT.WKCA)) line += 'K';
  if (GameBoard.castlePerm & BigInt(CASTLEBIT.WQCA)) line += 'Q';
  if (GameBoard.castlePerm & BigInt(CASTLEBIT.BKCA)) line += 'k';
  if (GameBoard.castlePerm & BigInt(CASTLEBIT.BQCA)) line += 'q';
  console.log('castle:' + line);
  console.log('key:' + GameBoard.posKey.toString(16));
}

export function GeneratePosKey() {
  let finalKey = 0n;
  let piece = PIECES.EMPTY;

  for (let sq = 0; sq < BRD_SQ_NUM; sq++) {
    piece = GameBoard.pieces[sq];
    if (piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD) {
      finalKey ^= PieceKeys[piece * 120 + sq];
    }
  }

  if (GameBoard.side === COLOURS.WHITE) {
    finalKey ^= SideKey;
  }

  if (GameBoard.enPas !== SQUARES.NO_SQ) {
    finalKey ^= PieceKeys[GameBoard.enPas];
  }

  finalKey ^= CastleKeys[GameBoard.castlePerm];

  console.log('final key', finalKey);

  return finalKey;
}

export function PrintPieceLists() {
  let piece, pceNum;

  for (piece = PIECES.wP; piece <= PIECES.bV; piece++) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[piece]; pceNum++) {
      console.log(
        'Piece ' +
          PceChar[piece] +
          ' on ' +
          PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)])
      );
    }
  }
}

export function UpdateListsMaterial() {
  let piece, sq, index, colour;

  for (index = 0; index < 24 * 120; index++) {
    GameBoard.pList[index] = BigInt(PIECES.EMPTY);
  }

  for (index = 0; index < 2; index++) {
    GameBoard.material[index] = 0;
  }

  for (index = 0; index < 24; index++) {
    GameBoard.pceNum[index] = 0;
  }

  for (index = 0; index < 64; index++) {
    sq = SQ120(index);
    piece = GameBoard.pieces[sq];
    if (piece !== PIECES.EMPTY) {
      colour = PieceCol[piece];

      GameBoard.material[colour] += PieceVal[piece];

      GameBoard.pList[PCEINDEX(piece, GameBoard.pceNum[piece])] = BigInt(sq);
      GameBoard.pceNum[piece]++;
    }
  }

  PrintPieceLists();
}

export function ResetBoard() {
  for (let index = 0; index < BRD_SQ_NUM; index++) {
    GameBoard.pieces[index] = SQUARES.OFFBOARD;
  }
  for (let index = 0; index < 64; index++) {
    GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
  }

  GameBoard.side = COLOURS.BOTH;
  GameBoard.enPas = BigInt(SQUARES.NO_SQ);
  GameBoard.fiftyMove = 0;
  GameBoard.ply = 0;
  GameBoard.hisPly = 0;
  GameBoard.castlePerm = 0n;
  GameBoard.posKey = 0n;
  GameBoard.moveListStart[GameBoard.ply] = 0;
  // todo reset powers to given config
}

export function randomize() {
  const randomizer = (side) => {
    const rank = [];
    const queenTypesMap = ['Q', 'Z', 'U', 'V'];

    function d(num) {
      return Math.floor(Math.random() * ++num);
    }
    function emptySquares() {
      const arr = [];
      for (let i = 0; i < 8; i++) if (rank[i] == undefined) arr.push(i);
      return arr;
    }

    // white has arcane, randomize black
    if (side === COLOURS.BLACK) {
      if (whiteArcane().modsRAN) {
        rank[d(2) * 2] = 'b';
        rank[d(2) * 2 + 1] = 'b';
        rank[emptySquares()[d(5)]] =
          queenTypesMap[blackArcane().modsQTY].toLowerCase();
        rank[emptySquares()[d(4)]] = 'n';
        rank[emptySquares()[d(3)]] = 'n';
        for (let x = 1; x <= 3; x++) {
          rank[emptySquares()[0]] = x === 2 ? 'k' : 'r';
        }
        return rank.join('');
      } else {
        return `rnb${queenTypesMap[1].toLowerCase()}kbnr`;
      }
    }

    // black has arcane, randomize white
    if (side === COLOURS.WHITE) {
      if (blackArcane().modsRAN) {
        rank[d(2) * 2] = 'B';
        rank[d(2) * 2 + 1] = 'B';
        rank[emptySquares()[d(5)]] = queenTypesMap[whiteArcane().modsQTY];
        rank[emptySquares()[d(4)]] = 'N';
        rank[emptySquares()[d(3)]] = 'N';
        for (let x = 1; x <= 3; x++) {
          rank[emptySquares()[0]] = x === 2 ? 'K' : 'R';
        }
        return rank.join('');
      } else {
        return `RNB${queenTypesMap[whiteArcane().modsQTY]}KBNR`;
      }
    }
  };

  if (whiteArcane().modsRAN || blackArcane().modsRAN) {
    updateStartFen(
      `${randomizer(COLOURS.BLACK)}/pppppppp/8/8/8/8/PPPPPPPP/${randomizer(
        COLOURS.WHITE
      )} w KQkq - 0 1`
    );
  }
}

export function ParseFen(fen) {
  ResetBoard();

  let rank = RANKS.RANK_8;
  let file = FILES.FILE_A;
  let piece = 0;
  let count = 0;
  let sq120 = 0;
  let fenCnt = 0; // fen[fenCnt]

  while (rank >= RANKS.RANK_1 && fenCnt < fen.length) {
    count = 1;
    switch (fen[fenCnt]) {
      case 'p':
        piece = PIECES.bP;
        break;
      case 'r':
        piece = PIECES.bR;
        break;
      case 'n':
        piece = PIECES.bN;
        break;
      case 'b':
        piece = PIECES.bB;
        break;
      case 'k':
        piece = PIECES.bK;
        break;
      case 'q':
        piece = PIECES.bQ;
        break;
      case 'P':
        piece = PIECES.wP;
        break;
      case 'R':
        piece = PIECES.wR;
        break;
      case 'N':
        piece = PIECES.wN;
        break;
      case 'B':
        piece = PIECES.wB;
        break;
      case 'K':
        piece = PIECES.wK;
        break;
      case 'Q':
        piece = PIECES.wQ;
        break;
      case 'X':
        piece = PIECES.EXILE;
        break;
      case 'S':
        piece = PIECES.wS;
        break;
      case 'H':
        piece = PIECES.wH;
        break;
      case 'Z':
        piece = PIECES.wZ;
        break;
      case 'U':
        piece = PIECES.wU;
        break;
      case 'V':
        piece = PIECES.wV;
        break;
      case 's':
        piece = PIECES.bS;
        break;
      case 'h':
        piece = PIECES.bH;
        break;
      case 'z':
        piece = PIECES.bZ;
        break;
      case 'u':
        piece = PIECES.bU;
        break;
      case 'v':
        piece = PIECES.bV;
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
        piece = PIECES.EMPTY;
        count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
        break;

      case '/':
      case ' ':
        rank--;
        file = FILES.FILE_A;
        fenCnt++;
        continue;
      default:
        console.log('FEN error');
        return;
    }

    for (let i = 0; i < count; i++) {
      sq120 = FR2SQ(file, rank);
      GameBoard.pieces[sq120] = piece;
      file++;
    }
    fenCnt++;
  } // while loop end

  // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  GameBoard.side = fen[fenCnt] == 'w' ? COLOURS.WHITE : COLOURS.BLACK;
  fenCnt += 2;

  for (let i = 0; i < 4; i++) {
    if (fen[fenCnt] == ' ') {
      break;
    }
    switch (fen[fenCnt]) {
      case 'K':
        GameBoard.castlePerm |= BigInt(CASTLEBIT.WKCA);
        break;
      case 'Q':
        GameBoard.castlePerm |= BigInt(CASTLEBIT.WQCA);
        break;
      case 'k':
        GameBoard.castlePerm |= BigInt(CASTLEBIT.BKCA);
        break;
      case 'q':
        GameBoard.castlePerm |= BigInt(CASTLEBIT.BQCA);
        break;
      default:
        break;
    }
    fenCnt++;
  }
  fenCnt++;

  if (fen[fenCnt] !== '-') {
    file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
    rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();
    console.log(
      'fen[fenCnt]:' + fen[fenCnt] + ' File:' + file + ' Rank:' + rank
    );
    GameBoard.enPas = FR2SQ(file, rank);
  }

  GameBoard.posKey = GeneratePosKey();
  UpdateListsMaterial();
  PrintSqAttacked();
}

export function PrintSqAttacked() {
  let sq, file, rank, piece;

  console.log('\nAttacked:\n');

  for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
    let line = rank + 1 + '  ';
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      sq = FR2SQ(file, rank);
      // todo  ^ 1
      if (SqAttacked(sq, GameBoard.side) === BOOL.TRUE) piece = 'X';
      else piece = '-';
      line += ' ' + piece + ' ';
    }
    console.log(line);
  }

  console.log('');
}

// todo royalty, herring, entangle
export function SqAttacked(sq, side) {
  let pce;
  let dir;
  let t_sq;
  let index;

  sq = BigInt(sq);

  let overridePresent = (t_sq) =>
    _.includes(GameBoard.royaltyQ, t_sq) ||
    _.includes(GameBoard.royaltyZ, t_sq) ||
    _.includes(GameBoard.royaltyU, t_sq) ||
    _.includes(GameBoard.royaltyV, t_sq) ||
    _.includes(GameBoard.royaltyE, t_sq);

  // note OVERRIDES

  // note UNICORN ZEALOT
  for (index = 0; index < 8; index++) {
    pce = GameBoard.pieces[sq + BigInt(KnDir[index])];
    if (
      pce !== SQUARES.OFFBOARD &&
      PieceCol[pce] === side &&
      (_.includes(GameBoard.royaltyZ, sq + BigInt(KnDir[index])) ||
        _.includes(GameBoard.royaltyU, sq + BigInt(KnDir[index]))) &&
      !_.includes(GameBoard.royaltyE, sq + BigInt(KnDir[index]))
    ) {
      return BOOL.TRUE;
    }
  }

  // note QUEEN ZEALOT
  for (index = 0; index < 4; index++) {
    dir = BigInt(RkDir[index]);
    t_sq = sq + dir;
    pce = GameBoard.pieces[t_sq];

    while (pce !== SQUARES.OFFBOARD) {
      if (pce !== PIECES.EMPTY) {
        if (
          (_.includes(GameBoard.royaltyQ, t_sq) ||
            _.includes(GameBoard.royaltyZ, t_sq)) &&
          PieceCol[pce] === side &&
          !_.includes(GameBoard.royaltyE, t_sq)
        ) {
          return BOOL.TRUE;
        }
        break;
      }
      t_sq += dir;
      pce = GameBoard.pieces[t_sq];
    }
  }

  // note QUEEN UNICORN
  for (index = 0; index < 4; index++) {
    dir = BigInt(BiDir[index]);
    t_sq = sq + dir;
    pce = GameBoard.pieces[t_sq];

    while (pce !== SQUARES.OFFBOARD) {
      if (pce !== PIECES.EMPTY) {
        if (
          (_.includes(GameBoard.royaltyQ, t_sq) ||
            _.includes(GameBoard.royaltyU, t_sq)) &&
          PieceCol[pce] === side &&
          !_.includes(GameBoard.royaltyE, t_sq)
        ) {
          return BOOL.TRUE;
        }
        break;
      }
      t_sq += dir;
      pce = GameBoard.pieces[t_sq];
    }
  }

  // vanguard
  for (index = 0; index < 24; index++) {
    pce = GameBoard.pieces[sq + BigInt(VaDir[index])];
    if (
      pce !== SQUARES.OFFBOARD &&
      PieceCol[pce] === side &&
      _.includes(GameBoard.royaltyV, sq + BigInt(VaDir[index])) &&
      !_.includes(GameBoard.royaltyE, sq + BigInt(VaDir[index]))
    ) {
      return BOOL.TRUE;
    }
  }

  // NO OVERRIDE

  // knight unicorn zealot
  for (index = 0; index < 8; index++) {
    pce = GameBoard.pieces[sq + BigInt(KnDir[index])];
    if (
      pce !== SQUARES.OFFBOARD &&
      PieceCol[pce] === side &&
      PieceKnight[pce] === BOOL.TRUE &&
      !overridePresent(sq + BigInt(KnDir[index])) &&
      !_.includes(GameBoard.royaltyE, sq + BigInt(VaDir[index]))
    ) {
      return BOOL.TRUE;
    }
  }

  // rook queen zealot
  for (index = 0; index < 4; index++) {
    dir = BigInt(RkDir[index]);
    t_sq = sq + dir;
    pce = GameBoard.pieces[t_sq];

    while (pce !== SQUARES.OFFBOARD) {
      if (pce !== PIECES.EMPTY) {
        if (
          PieceRookQueen[pce] === BOOL.TRUE &&
          PieceCol[pce] === side &&
          !overridePresent(t_sq) &&
          !_.includes(GameBoard.royaltyE, t_sq)
        ) {
          return BOOL.TRUE;
        }
        break;
      }
      t_sq += dir;
      pce = GameBoard.pieces[t_sq];
    }
  }

  // bishop queen unicorn
  for (index = 0; index < 4; index++) {
    dir = BigInt(BiDir[index]);
    t_sq = sq + dir;
    pce = GameBoard.pieces[t_sq];

    while (pce !== SQUARES.OFFBOARD) {
      if (pce !== PIECES.EMPTY) {
        if (
          PieceBishopQueen[pce] === BOOL.TRUE &&
          PieceCol[pce] === side &&
          !overridePresent(t_sq) &&
          !_.includes(GameBoard.royaltyE, t_sq)
        ) {
          return BOOL.TRUE;
        }
        break;
      }
      t_sq += dir;
      pce = GameBoard.pieces[t_sq];
    }
  }

  // vanguard
  for (index = 0; index < 24; index++) {
    pce = GameBoard.pieces[sq + BigInt(VaDir[index])];
    if (
      pce !== SQUARES.OFFBOARD &&
      PieceCol[pce] === side &&
      PieceVanguard[pce] === BOOL.TRUE &&
      !overridePresent(sq + BigInt(VaDir[index])) &&
      !_.includes(GameBoard.royaltyE, sq + BigInt(VaDir[index]))
    ) {
      return BOOL.TRUE;
    }
  }

  // king
  for (index = 0; index < 8; index++) {
    pce = GameBoard.pieces[sq + BigInt(KiDir[index])];
    if (
      pce !== SQUARES.OFFBOARD &&
      PieceCol[pce] === side &&
      PieceKing[pce] === BOOL.TRUE &&
      !overridePresent(sq + BigInt(KiDir[index])) &&
      !_.includes(GameBoard.royaltyE, sq + BigInt(KiDir[index]))
    ) {
      return BOOL.TRUE;
    }
  }

  // pawn
  if (side == COLOURS.WHITE) {
    if (
      (GameBoard.pieces[sq - BigInt(11)] === PIECES.wP &&
        !overridePresent(sq - BigInt(11)) &&
        !_.includes(GameBoard.royaltyE, sq - BigInt(11))) ||
      (GameBoard.pieces[sq - BigInt(9)] === PIECES.wP &&
        !overridePresent(sq - BigInt(9)) &&
        !_.includes(GameBoard.royaltyE, sq - BigInt(9)))
    ) {
      return BOOL.TRUE;
    }
  } else {
    if (
      (GameBoard.pieces[sq + BigInt(11)] === PIECES.bP &&
        !overridePresent(sq + BigInt(11)) &&
        !_.includes(GameBoard.royaltyE, sq + BigInt(11))) ||
      (GameBoard.pieces[sq + BigInt(9)] === PIECES.bP &&
        !overridePresent(sq + BigInt(9)) &&
        !_.includes(GameBoard.royaltyE, sq + BigInt(9)))
    ) {
      return BOOL.TRUE;
    }
  }

  // spectre
  for (index = 0; index < 6; index++) {
    pce = GameBoard.pieces[sq + BigInt(SpDir[index])];
    if (
      pce !== SQUARES.OFFBOARD &&
      PieceCol[pce] === side &&
      PieceSpectre[pce] === BOOL.TRUE &&
      !overridePresent(sq + BigInt(SpDir[index])) &&
      !_.includes(GameBoard.royaltyE, sq + BigInt(SpDir[index]))
    ) {
      return BOOL.TRUE;
    }
  }

  // herring
  for (index = 0; index < 4; index++) {
    pce = GameBoard.pieces[sq + BigInt(HrDir[index])];
    if (
      pce !== SQUARES.OFFBOARD &&
      PieceCol[pce] === side &&
      PieceHerring[pce] === BOOL.TRUE &&
      !overridePresent(sq + BigInt(HrDir[index])) &&
      !_.includes(GameBoard.royaltyE, sq + BigInt(HrDir[index]))
    ) {
      return BOOL.TRUE;
    }
  }

  return BOOL.FALSE;
}
