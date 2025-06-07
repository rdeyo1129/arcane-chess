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
  // 6 active
  dyadA: 1, // all
  dyadB: 2, // p h
  dyadC: 4, // b n z u r
  dyadD: 8, // s w
  dyadE: 16, // m t q
  dyadF: 32, // v k
  // 22 active
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
  // sumnRB hexweavers cross to converge on both diagonals?
  // 7 active
  offrA: 1,
  offrB: 2,
  offrC: 4,
  offrD: 8,
  offrE: 16,
  offrF: 32,
  offrG: 64,
  offrH: 128,
  offrI: 256,
  // 5 passive
  shftP: 1,
  shftN: 2,
  shftB: 4,
  shftR: 8,
  shftT: 16, // active
  // 2 active
  swapDEP: 1,
  swapADJ: 2,
  // 12
  modsCON: 1, // passive
  modsAET: 2, // inherent
  modsFUG: 4, // inherent
  modsSIL: 8, // inherent
  modsINH: 16, // inherent
  modsSUS: 32, // active
  modsGLU: 64, // inherent
  modsFUT: 128, // active
  modsREA: 2048, // inherent
  modsEXT: 4096, // inherent
  modsSKI: 16384, // active
  modsTRO: 32768, // inherent
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
