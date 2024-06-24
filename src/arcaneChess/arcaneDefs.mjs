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

// 0000 0000 0000 0000 0000 0000 0000 0000 0000 1111 1111 1111 dyad
// 0000 0000 0000 0000 0000 0000 0000 0000 1111 0000 0000 0000 shft
// 0000 0000 0000 0000 0000 0000 0000 0111 0000 0000 0000 0000 swap
// 0000 0000 0000 1111 1111 1111 1111 1000 0000 0000 0000 0000 sumn
// 0011 1111 1111 0000 0000 0000 0000 0000 0000 0000 0000 0000 mods

export const POWERBIT = {
  // 15 active orange
  dyadA: 1,
  dyadP: 2,
  dyadS: 4,
  dyadH: 8,
  dyadN: 16,
  dyadB: 32,
  dyadR: 64,
  dyadQ: 128,
  dyadK: 256,
  dyadT: 512,
  dyadM: 1024,
  dyadV: 2048,
  dyadZ: 4096,
  dyadU: 8192,
  dyadW: 16384,
  // 19 active purple
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
  // 4 passive blue
  shftP: 1,
  shftN: 2,
  shftB: 4,
  shftR: 8,
  // 3 active green
  swapATK: 1,
  swapDEP: 2,
  swapADJ: 4,
  // 11 yellow
  modsCON: 1, // passive
  modsOFF: 2, // active // todo expand to it's own section
  modsFUG: 4, // inherent
  modsRAN: 8, // inherent
  modsINH: 16, // inherent
  modsSUS: 32, // active
  modsPHA: 64, // active
  modsFUT: 128, // active
  modsIMP: 256, // active
  modsORA: 512, // active
  modsTEM: 1024, // active
  modsPRE: 2048, // inherent
  // modsOFF: 512, add time, glitch (rand comp move), add random arcana / mana
};

export const varVars = {
  // insert things like 960, crazyhouse, summons vs freezes, koh, xcheck, horde,
};

export const POWERS = (config) => {
  return (
    config.dyad |
    (config.sumn << 12) |
    (config.shft << 28) |
    (config.swap << 32) |
    (config.mods << 35)
  );
};
