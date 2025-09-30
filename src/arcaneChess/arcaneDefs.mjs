import _ from 'lodash';

export const whiteArcaneConfig = {
  // dyadP: 3,
  // dyadZ: 5,
  // sumnR: 4,
  // sumnRE: 4,
  // sumnRT: 1,
  // sumnRM: 1,
  // sumnRV: 7,
  // sumnP: 2,
  // sumnX: 1,
  // shftR: 4,
  // shftN: 4,
  // shftB: 4,
  // shftR: 4,
  // modsSIG: 2,
  // modsCON: 4,
  // swapADJ: 1,
  // swapATK: 4,
  // swapDEP: 1,
  // modsRAN: 1,
  // modsFUG: 1,
  // modsINH: 1,
  // note showEngineRating handicap (not recommended move? different from implant) for campaign power (for 3 turns?)
};

export const blackArcaneConfig = {
  // dyadP: 3,
  // dyadZ: 5,
  // sumnP: 2,
  // sumnRV: 7,
  // shftN: 4,
  // modsSIG: 2,
  // modsCON: 4,
  // swapADJ: 1,
  // sumnRM: 1,
  // swapATK: 1,
  // swapDEP: 1,
  // modsCON: 4,
  // modsFUG: 1,
  // modsRAN: 1,
  // modsQTY: 1,
  // sumnRE: 1,
  // sumnX: 1,
};

// tactorius: needs external defs in order to generate moves with
// get status for each player from configs
export const setWhiteArcana = (config) => {
  // const config = {};
  _.forOwn(config, (value, key) => {
    whiteArcaneConfig[key] = value;
  });
  return whiteArcaneConfig;
};

export const setBlackArcana = (config) => {
  // const config = {};
  _.forOwn(config, (value, key) => {
    blackArcaneConfig[key] = value;
  });
  return blackArcaneConfig;
};

export const clearArcanaConfig = () => {
  Object.keys(whiteArcaneConfig).forEach(
    (key) => delete whiteArcaneConfig[key]
  );
  Object.keys(blackArcaneConfig).forEach(
    (key) => delete blackArcaneConfig[key]
  );
};

export const activateDyad = () => {
  // GameBoard.dyad = type;
};

// needs update 10/1/24
// 0000 0000 0000 0000 0000 0000 0000 0000 0000 1111 1111 1111 dyad
// 0000 0000 0000 0000 0000 0000 0000 0000 1111 0000 0000 0000 shft
// 0000 0000 0000 0000 0000 0000 0000 0111 0000 0000 0000 0000 swap
// 0000 0000 0000 1111 1111 1111 1111 1000 0000 0000 0000 0000 sumn
// 0011 1111 11411 0000 0000 0000 0000 0000 0000 0000 0000 0000 mods

export const POWERBIT = {
  // 0 dyad active 6
  dyadA: 1, // all
  dyadB: 2, // p h x
  dyadC: 4, // b n z u r
  dyadD: 8, // s w
  dyadE: 16, // m t q
  dyadF: 32, // v k

  // 3 summons active 26
  sumnP: 1,
  sumnS: 2,
  sumnH: 4,
  sumnN: 8,
  sumnB: 16,
  sumnR: 32,
  sumnQ: 64,
  sumnT: 128,
  sumnM: 256,
  sumnV: 512,
  sumnZ: 1024,
  sumnU: 2048,
  sumnW: 4096,
  sumnX: 8192,
  sumnRQ: 16384,
  sumnRT: 32768,
  sumnRM: 65536,
  sumnRV: 131072,
  sumnRE: 262144,
  sumnRY: 524288,
  sumnRZ: 1048576,
  sumnRA: 2097152,
  sumnRF: 4194304,
  sumnRG: 8388608,
  sumnRH: 16777216,
  sumnRI: 33554432,

  // 5 active 18
  offrA: 1,
  offrB: 2,
  offrC: 4,
  offrD: 8,
  offrE: 16,
  offrF: 32,
  offrG: 64,
  offrH: 128,
  offrI: 256,
  offrJ: 512,
  offrK: 1024,
  offrL: 2048,
  offrM: 4096,
  offrN: 8192,
  offrO: 16384,
  // don't use P, it gets replaced in chessground UI
  offrZ: 32768,
  offrQ: 65536,
  offrR: 131072,

  // 1 passive 9
  shftP: 1,
  shftN: 2,
  shftB: 4,
  shftR: 8,
  shftT: 16, // active
  shftG: 32,
  shftH: 64,
  shftI: 128,
  shftA: 256,

  // 2 active 2
  swapDEP: 1,
  swapADJ: 2,

  // 4 mods 25
  modsCON: 1, // passive
  modsAET: 2, // inherent
  modsFUG: 4, // inherent
  modsSIL: 8, // inherent
  modsINH: 16, // inherent
  modsSUS: 32, // active
  modsGLU: 64, // inherent
  modsFUT: 128, // active
  modsREA: 256, // inherent
  modsEXT: 512, // inherent
  // modsSKI: 1024, // DEPRECATED
  modsTRO: 2048, // inherent
  modsREI: 4096, // inherent
  modsSOV: 8192, // passive
  modsDOP: 16384, // passive
  modsMAG: 32768, // active
  modsBLA: 65536, // active
  modsSUR: 131072, // passive
  modsDIM: 262144, // passive
  modsRES: 524288, // passive
  modsHER: 1048576, // inherent
  modsBAN: 2097152, // inherent
  modsFOG: 4194304, // passive
  modsMIS: 8388608, // passive
  modsHUR: 16777216, // passive

  // 6 on your piece death 4
  moriDYA: 1, // inherent
  moriROY: 2, // inherent
  moriPAW: 4, // inherent
  moriNOR: 8, // inherent

  // 7 on opponent piece death 4
  moraDYA: 1, // inherent
  moraROY: 2, // inherent
  moraPAW: 4, // inherent
  moraNOR: 8, // inherent

  // 8 area inherent 4
  areaC: 1,
  areaM: 2,
  areaT: 4,
  areaQ: 8,

  // 9 gain passive 3
  gainDYA: 1,
  gainVAL: 2,
  gainPAW: 4,
};

export const varVars = {
  // insert things like 960, crazyhouse, summons vs freezes, koh, xcheck, horde,
};

// unneeded / depoerecated
export const POWERS = (config) => {
  return (
    config.dyad |
    (config.sumn << 15) |
    (config.shft << 37) |
    (config.swap << 42) |
    (config.mods << 44) |
    (config.offr << 56)
  );
};
