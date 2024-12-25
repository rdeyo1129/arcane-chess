export const PIECES = {
  EMPTY: 0,
  wP: 1,
  wN: 2,
  wB: 3,
  wR: 4,
  wQ: 5,
  wK: 6,
  bP: 7,
  bN: 8,
  bB: 9,
  bR: 10,
  bQ: 11,
  bK: 12,
  EXILE: 13,
  wS: 14,
  wH: 15,
  wT: 16,
  wM: 17,
  wV: 18,
  bS: 19,
  bH: 20,
  bT: 21,
  bM: 22,
  bV: 23,
  wZ: 24,
  wU: 25,
  bZ: 26,
  bU: 27,
  wW: 28,
  bW: 29,
};

export const ARCANE_BIT_VALUES = {
  RQ: 30,
  RT: 31,
  RM: 32,
  RV: 33,
  RE: 34,
  RY: 35,
  RZ: 36,
  RA: 37,
  ATK: 8,
  DEP: 9,
  ADJ: 10,
};

export const BRD_SQ_NUM = 120;

export const FILES = {
  FILE_A: 0,
  FILE_B: 1,
  FILE_C: 2,
  FILE_D: 3,
  FILE_E: 4,
  FILE_F: 5,
  FILE_G: 6,
  FILE_H: 7,
  FILE_NONE: 8,
};

export const RANKS = {
  RANK_1: 0,
  RANK_2: 1,
  RANK_3: 2,
  RANK_4: 3,
  RANK_5: 4,
  RANK_6: 5,
  RANK_7: 6,
  RANK_8: 7,
  RANK_NONE: 8,
};

// create function that uses parameter of string like "d4" and return 54
export const prettyToSquare = (pretty) => {
  if (pretty === null) return 0;
  const file = pretty.charCodeAt(0) - 97;
  const rank = pretty.charCodeAt(1) - 49;
  return 21 + file + rank * 10;
};

export const COLOURS = { WHITE: 0, BLACK: 1, BOTH: 2 };

export const CASTLEBIT = { WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8 };

export const SQUARES = {
  A1: 21,
  B1: 22,
  C1: 23,
  D1: 24,
  E1: 25,
  F1: 26,
  G1: 27,
  H1: 28,
  A8: 91,
  B8: 92,
  C8: 93,
  D8: 94,
  E8: 95,
  F8: 96,
  G8: 97,
  H8: 98,
  NO_SQ: 99,
  OFFBOARD: 100,
};

export const BOOL = { FALSE: 0, TRUE: 1 };

export const MAXGAMEMOVES = 2048;
export const MAXPOSITIONMOVES = 256;
export const MAXDEPTH = 64;
export const INFINITE = 100000;
export const MATE = 99000;
export const PVENTRIES = 10000;

export const FilesBrd = new Array(BRD_SQ_NUM);
export const RanksBrd = new Array(BRD_SQ_NUM);

export let START_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';
// export let START_FEN = fen;
// "rnbvkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBVKBNR w KQkq - 0 1";
export function updateStartFen(newFen) {
  START_FEN = newFen;
}

export let PceChar = '.PNBRQKpnbrqkXSHTMVshtmvZUzuWw';
export let RtyChar = '.'.repeat(30) + 'QTMVEYZA';
export let SideChar = 'wb-';
export let RankChar = '12345678';
export let FileChar = 'abcdefgh';

export function FR2SQ(f, r) {
  return 21 + f + r * 10;
}

export const PieceBig = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
];
export const PieceMaj = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
];
export const PieceMin = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceVal = [
  0, 100, 300, 300, 550, 1100, 150000, 100, 300, 300, 550, 1100, 150000, 0, 800,
  200, 1000, 900, 1400, 800, 250, 1000, 900, 1400, 300, 300, 300, 300, 800, 800,
];
export const PieceCol = [
  COLOURS.BOTH,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BOTH,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.WHITE,
  COLOURS.BLACK,
];

export const PiecePawn = [
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceSpectre = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceWraith = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
];
export const PieceHerring = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceKnight = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceKing = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceRookQueen = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceBishopQueen = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceExile = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceValkyrie = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceZebra = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceUnicorn = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
];
export const PieceSlides = [
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.TRUE,
  BOOL.TRUE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
  BOOL.FALSE,
];

export let SpDir = [-21, -19, -12, -10, -8, -1, 1, 8, 10, 12, 19, 21];
export let WrDir = [-22, -20, -18, -11, -9, -2, 2, 9, 11, 18, 20, 22];
export let HrDir = [-21, -19, -2, 2, 19, 21];
export let KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
export let RkDir = [-1, -10, 1, 10];
export let BiDir = [-9, -11, 11, 9];
export let KiDir = [-1, -10, 1, 10, -9, -11, 11, 9];
// prettier-ignore
export let VaDir = [
    -22, -21, -20, -19, -18,
    -12, -11, -10,  -9,  -8,
    -2, -1, 1, 2,
    12, 11, 10,  9,  8,
    22, 21, 20, 19, 18,
  ]
export let ZeDir = [-20, -11, -9, -2, 2, 9, 11, 20];
export let UnDir = [-22, -18, -10, -1, 1, 10, 18, 22];

export const DirNum = [
  0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8, 0, 12, 6, 4, 4, 24, 12, 6, 4, 4, 24, 8,
  8, 8, 8, 12, 12,
];
export const PceDir = [
  0,
  0,
  KnDir,
  BiDir,
  RkDir,
  KiDir,
  KiDir,
  0,
  KnDir,
  BiDir,
  RkDir,
  KiDir,
  KiDir,
  0,
  SpDir,
  HrDir,
  RkDir, // templar
  BiDir, // mystic
  VaDir,
  SpDir,
  HrDir,
  RkDir, // templar
  BiDir, // mystic
  VaDir,
  ZeDir,
  UnDir,
  ZeDir,
  UnDir,
  WrDir,
  WrDir,
];
export const LoopNonSlidePce = [
  PIECES.wN,
  PIECES.wK,
  PIECES.wS,
  PIECES.wH,
  PIECES.wT,
  PIECES.wM,
  PIECES.wV,
  PIECES.wZ,
  PIECES.wU,
  PIECES.wW,
  0,
  PIECES.bN,
  PIECES.bK,
  PIECES.bS,
  PIECES.bH,
  PIECES.bT,
  PIECES.bM,
  PIECES.bV,
  PIECES.bZ,
  PIECES.bU,
  PIECES.bW,
  0,
];
export const LoopNonSlideDyad = [
  16, 256, 4, 8, 512, 1024, 2048, 4096, 8192, 16384, 0, 16, 256, 4, 8, 512,
  1024, 2048, 4096, 8192, 16384, 0,
];
export const LoopNonSlideIndex = [0, 11];

export const LoopSlidePce = [
  PIECES.wB,
  PIECES.wR,
  PIECES.wQ,
  PIECES.wT,
  PIECES.wM,
  PIECES.wV,
  0,
  PIECES.bB,
  PIECES.bR,
  PIECES.bQ,
  PIECES.bT,
  PIECES.bM,
  PIECES.bV,
  0,
];
export const LoopSlideDyad = [
  32, 64, 128, 512, 1024, 2048, 0, 32, 64, 128, 512, 1024, 2048, 0,
];
// export const LoopSlideIndex = [0, 4];
export const LoopSlideIndex = [0, 7];

// no king
export const LoopPcePrime = [
  PIECES.wP,
  PIECES.wN,
  PIECES.wS,
  PIECES.wH,
  PIECES.wT,
  PIECES.wM,
  PIECES.wV,
  PIECES.wB,
  PIECES.wR,
  PIECES.wQ,
  PIECES.wZ,
  PIECES.wU,
  PIECES.wW,
  0,
  PIECES.bP,
  PIECES.bN,
  PIECES.bS,
  PIECES.bH,
  PIECES.bT,
  PIECES.bM,
  PIECES.bV,
  PIECES.bB,
  PIECES.bR,
  PIECES.bQ,
  PIECES.bZ,
  PIECES.bU,
  PIECES.bW,
  0,
];
export const LoopPcePrimeSymbols = [
  'P',
  'N',
  'S',
  'H',
  'T',
  'M',
  'V',
  'B',
  'R',
  'Q',
  'Z',
  'U',
  'W',
  '',
  'P',
  'N',
  'S',
  'H',
  'T',
  'M',
  'V',
  'B',
  'R',
  'Q',
  'Z',
  'U',
  'W',
  '',
];
export const LoopPcePrimeIndex = [0, 14];

export const LoopDyadPrime = [
  2, 16, 256, 4, 8, 512, 1024, 2048, 32, 64, 128, 4096, 8192, 16384, 0, 2, 16,
  256, 4, 8, 512, 1024, 2048, 32, 64, 128, 4096, 8192, 16384, 0,
];
export const LoopIndexPrime = [0, 15];

export const royaltySliderMap = ['royaltyM', 'royaltyT', 'royaltyQ'];
export const royaltyHopperMap = ['royaltyM', 'royaltyT', 'royaltyV'];
export const royaltySliders = [PIECES.wB, PIECES.wR, PIECES.wQ];
export const royaltyHoppers = [PIECES.wN, PIECES.wN, PIECES.wV];

export const loopSummon = [
  PIECES.wP,
  PIECES.wS,
  PIECES.wH,
  PIECES.wN,
  PIECES.wB,
  PIECES.wR,
  PIECES.wQ,
  PIECES.wT,
  PIECES.wM,
  PIECES.wV,
  PIECES.wZ,
  PIECES.wU,
  PIECES.wW,
  PIECES.EXILE,
  ARCANE_BIT_VALUES.RQ,
  ARCANE_BIT_VALUES.RT,
  ARCANE_BIT_VALUES.RM,
  ARCANE_BIT_VALUES.RV,
  ARCANE_BIT_VALUES.RE,
  ARCANE_BIT_VALUES.RY,
  ARCANE_BIT_VALUES.RZ,
  ARCANE_BIT_VALUES.RA,
  0,
  PIECES.bP,
  PIECES.bS,
  PIECES.bH,
  PIECES.bN,
  PIECES.bB,
  PIECES.bR,
  PIECES.bQ,
  PIECES.bT,
  PIECES.bM,
  PIECES.bV,
  PIECES.bZ,
  PIECES.bU,
  PIECES.bW,
  PIECES.EXILE,
  ARCANE_BIT_VALUES.RQ,
  ARCANE_BIT_VALUES.RT,
  ARCANE_BIT_VALUES.RM,
  ARCANE_BIT_VALUES.RV,
  ARCANE_BIT_VALUES.RE,
  ARCANE_BIT_VALUES.RY,
  ARCANE_BIT_VALUES.RZ,
  ARCANE_BIT_VALUES.RA,
  0,
];
export const loopSummonFlag = [
  1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536, 131072, 262144, 524288, 1048576, 2097152, 0, 1, 2, 4, 8, 16, 32, 64,
  128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144,
  524288, 1048576, 2097152, 0,
];
export const loopSummonIndex = [0, 23];

export const Mirror64 = [
  56, 57, 58, 59, 60, 61, 62, 63, 48, 49, 50, 51, 52, 53, 54, 55, 40, 41, 42,
  43, 44, 45, 46, 47, 32, 33, 34, 35, 36, 37, 38, 39, 24, 25, 26, 27, 28, 29,
  30, 31, 16, 17, 18, 19, 20, 21, 22, 23, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2,
  3, 4, 5, 6, 7,
];

export const PieceKeys = new Array(31 * 120);
export const CastleKeys = new Array(16);

export let SideKey;
export function updateSideKey(newKey) {
  SideKey = newKey;
}

export const Sq120ToSq64 = new Array(BRD_SQ_NUM);
export const Sq64ToSq120 = new Array(64);

export function RAND_32() {
  return (
    (Math.floor(Math.random() * 255 + 1) << 23) |
    (Math.floor(Math.random() * 255 + 1) << 16) |
    (Math.floor(Math.random() * 255 + 1) << 8) |
    Math.floor(Math.random() * 255 + 1)
  );
}

export function SQ64(sq120) {
  return Sq120ToSq64[sq120];
}

export function SQ120(sq64) {
  return Sq64ToSq120[sq64];
}

export function PCEINDEX(pce, pceNum) {
  return pce * 36 + pceNum;
}

export function MIRROR64(sq) {
  return Mirror64[sq];
}

export const Kings = [PIECES.wK, PIECES.bK];
export const CastlePerm = [
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 13, 15, 15, 15, 12, 15, 15, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 7, 15, 15, 15, 3,
  15, 15, 11, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15,
];

export const NOMOVE = 0;

export var GameController = {};
GameController.EngineSide = COLOURS.BOTH;
GameController.PlayerSide = COLOURS.BOTH;
GameController.GameOver = BOOL.FALSE;
