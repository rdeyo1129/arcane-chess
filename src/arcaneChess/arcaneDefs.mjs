import _ from 'lodash';

import { GameBoard } from './board';

export const whiteArcaneConfig = {
  // dyadP: 3,
  // dyadZ: 5,
  // sumnR: 4,
  // sumnRE: 4,
  // sumnRZ: 1,
  // sumnRU: 1,
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
  swapADJ: 3,
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
export const whiteArcane = () => {
  const config = {};
  _.forOwn(whiteArcaneConfig, (value, key) => {
    config[key] = value;
  });
  return config;
};

export const blackArcane = () => {
  const config = {};
  _.forOwn(blackArcaneConfig, (value, key) => {
    config[key] = value;
  });
  return config;
};

export const activateDyad = (type) => {
  // GameBoard.dyad = type;
};

// todo convert from obj to bitwise to check for presence of a power
// todo inc and dec

// 0000 0000 0000 0000 0000 0000 0000 0000 0000 1111 1111 1111 dyad
// 0000 0000 0000 0000 0000 0000 0000 0000 1111 0000 0000 0000 shft
// 0000 0000 0000 0000 0000 0000 0000 0111 0000 0000 0000 0000 swap
// 0000 0000 0000 0111 1111 1111 1111 1000 0000 0000 0000 0000 sumn
// 0001 1111 1111 1000 0000 0000 0000 0000 0000 0000 0000 0000 mods

// 0000 0000 0000 0000 0000 0000 0000 0000 1111 dyad
// 0000 0000 0000 0000 0000 0000 0000 0111 0000 shft
// 0000 0000 0000 0000 0000 0000 0011 1000 0000 swap
// 0000 0000 0000 0000 0000 0111 1100 0000 0000

// todo should be represented as array of arrays of ints?

export const POWERBIT = {
  // 12
  dyadA: 1,
  dyadP: 2,
  dyadS: 4,
  dyadH: 8,
  dyadN: 16,
  dyadB: 32,
  dyadR: 64,
  dyadQ: 128,
  dyadK: 256,
  dyadZ: 512,
  dyadU: 1024,
  dyadV: 2048,
  // 16
  sumnP: 1,
  sumnS: 2,
  sumnH: 4,
  sumnN: 8,
  sumnB: 16,
  sumnR: 32,
  sumnQ: 64,
  sumnZ: 128,
  sumnU: 256,
  sumnV: 512,
  sumnX: 1024,
  sumnRQ: 2048,
  sumnRZ: 4096,
  sumnRU: 8192,
  sumnRV: 16384,
  sumnRE: 32768,
  // 4
  shftP: 1,
  shftN: 2,
  shftB: 4,
  shftR: 8,
  // 3
  swapATK: 1,
  swapDEP: 2,
  swapADJ: 4,
  // note entangle, not to be confused with exile (X)

  // 10
  modsCON: 1,
  modsOFF: 2,
  modsFUG: 4,
  modsRAN: 8,
  modsINH: 16,
  modsSUS: 32,
  modsINV: 64,
  modsSIG: 128,
  modsIMP: 256,
  // modsOFF: 512, add time, glitch (rand comp move), add random arcana / mana
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
