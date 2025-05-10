import arcanaJson from 'src/data/arcana.json';

interface ArcanaDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  imagePath: string;
}
interface ArcanaMap {
  [key: string]: ArcanaDetail;
}
interface Character {
  name: string;
  inventory: ArcanaDetail[];
  setup: string;
  imagePath: string;
  color: string;
  description: string;
}

interface GameModeType {
  name: string;
  white: {
    arcana: ArcanaDetail[];
    setup: string;
  };
  black: {
    arcana: ArcanaDetail[];
    setup: string;
  };
}

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

const R = '#c53939';
const O = '#c77c35';
const Y = '#d9b800';
const G = '#34aa48';
const B = '#3f48cc';
const V = '#a043a2';

const path = '/assets/characters/';

const emptyArcane = {
  id: 'empty',
  name: '',
  description: 'No arcane selected here. Click to choose one!',
  type: '',
  imagePath: '/assets/arcanaImages/empty',
};

// CHARACTERS
const unpaddedCharacters = [
  {
    name: 'The Warlord',
    inventory: [arcana.dyadK, arcana.dyadQ, arcana.dyadR],
    setup: 'RNBQKBNR',
    imagePath: 'warlord',
    color: Y,
    description:
      'Look for the double attacks, escape a threat against your King.',
  },
  {
    name: 'The Banshee',
    inventory: [arcana.dyadW, arcana.dyadW, arcana.sumnW, arcana.sumnW],
    setup: 'RNWQKWNR',
    imagePath: 'banshee',
    color: V,
    description:
      'More predictable than The Ghoul, stronger control over choice color complexes.',
  },
  {
    name: 'The Ghoul',
    inventory: [arcana.sumnS, arcana.sumnS, arcana.dyadS, arcana.dyadS],
    setup: 'RSBQKBSR',
    imagePath: 'ghoul',
    color: V,
    description: 'Chaotic control over both color complexes.',
  },
  // {
  //   name: 'The Politician',
  //   inventory: [arcana.modsSKI, arcana.modsINH, arcana.offrC],
  //   setup: 'RNBVKBNR',
  //   imagePath: 'politician',
  //   color: R,
  //   description: 'Play for the endgame and use your resources.',
  // },
  {
    name: 'The Phoenix',
    inventory: [arcana.dyadA, arcana.modsTEM, arcana.sumnRA, arcana.sumnRQ],
    setup: 'RNBQKBNR',
    imagePath: 'phoenix',
    color: O,
    description: 'Dazzle your opponent with high-end spells.',
  },
  {
    name: 'The Anarchist',
    inventory: [arcana.modsTRO, arcana.offrE, arcana.sumnX],
    setup: 'RNBTKBNR',
    imagePath: 'anarchist',
    color: R,
    description: 'No rules, but still rules.',
  },
  {
    name: 'The Solider',
    inventory: [arcana.shftP, arcana.shftN, arcana.shftB, arcana.shftR],
    setup: 'RNBQKBNR',
    imagePath: 'soldier',
    color: B,
    description: 'Mobility is your friend.',
  },
  {
    name: 'The Prophet',
    inventory: [
      arcana.modsIMP,
      arcana.modsIMP,
      arcana.modsORA,
      arcana.modsORA,
      arcana.modsTEM,
      arcana.modsFUT,
    ],
    setup: 'RNBMKBNR',
    imagePath: 'prophet',
    color: G,
    description: 'See like the engine does.',
  },
  {
    name: 'The Barbarian',
    inventory: [arcana.sumnX, arcana.sumnR, arcana.dyadA],
    setup: 'RNBQKBNR',
    imagePath: 'barbarian',
    color: R,
    description: 'Brute force strategy.',
  },
  {
    name: 'The Transcendent',
    inventory: [arcana.sumnRV, arcana.dyadV, arcana.modsTEM, arcana.modsEXT],
    setup: 'RNMVKTNR',
    imagePath: 'transcendent',
    color: Y,
    description: 'Power from a higher entity.',
  },
  {
    name: 'The Demon',
    inventory: [arcana.sumnX, arcana.modsCON, arcana.sumnRE, arcana.sumnRY],
    setup: 'RSWTKWSR',
    imagePath: 'demon',
    color: R,
    description: 'A dangerous and deadly spellcaster.',
  },
  {
    name: 'The Hexweaver',
    inventory: [arcana.sumnH, arcana.sumnRY, arcana.sumnRZ, arcana.sumnRA],
    setup: 'RNBQKBNR',
    imagePath: 'wizard',
    color: V,
    description: 'Freeze and deflect opposing pieces.',
  },
];

export const startingInventory = Array(6).fill(emptyArcane);

export const padInventory = (characters: Character[]) => {
  return characters.map((character) => ({
    ...character,
    imagePath: `${path}${character.imagePath}`,
    inventory: [
      ...character.inventory,
      ...Array(6 - character.inventory.length).fill(arcana.empty),
    ],
  }));
};

export const characters = padInventory(unpaddedCharacters);

// MODES
const padArcana = (arcana: ArcanaDetail[]) => {
  const paddedArcana = [...arcana];
  while (paddedArcana.length < 6) {
    paddedArcana.push(emptyArcane);
  }
  return paddedArcana;
};

const padModes = (modes: Record<string, GameModeType>) => {
  return Object.entries(modes).reduce(
    (acc, [key, mode]) => {
      acc[key] = {
        ...mode,
        white: {
          ...mode.white,
          arcana: padArcana(mode.white.arcana),
        },
        black: {
          ...mode.black,
          arcana: padArcana(mode.black.arcana),
        },
      };
      return acc;
    },
    {} as Record<string, GameModeType>
  );
};

export const modes: Record<string, GameModeType> = padModes({
  goliaths: {
    name: 'Clash of Goliaths',
    white: {
      arcana: [
        arcana.dyadA,
        arcana.sumnRA,
        arcana.sumnV,
        arcana.swapDEP,
        arcana.modsEXT,
        arcana.modsGLU,
      ],
      setup: 'TMQVKQMT',
    },
    black: {
      arcana: [
        arcana.dyadA,
        arcana.sumnRA,
        arcana.sumnV,
        arcana.swapDEP,
        arcana.modsEXT,
        arcana.modsGLU,
      ],
      setup: 'tmqvkqmt',
    },
  },
  newClassic: {
    name: 'The New Classic',
    white: {
      arcana: [arcana.dyadA, arcana.offrH, arcana.sumnRQ, arcana.sumnX],
      setup: 'RNBTKBNR',
    },
    black: {
      arcana: [arcana.dyadA, arcana.offrH, arcana.sumnRQ, arcana.sumnX],
      setup: 'rnbtkbnr',
    },
  },
  sacsAndSwaps: {
    name: 'Sacs and Swaps',
    white: {
      arcana: [arcana.offrA, arcana.swapDEP, arcana.modsEXT],
      setup: 'RNBMKBNR',
    },
    black: {
      arcana: [arcana.offrA, arcana.swapDEP, arcana.modsEXT],
      setup: 'rnbmkbnr',
    },
  },
  // sequel: {
  //   name: 'The Sequel',
  //   white: {
  //     arcana: [arcana.offrA, arcana.sumnRE, arcana.shftN],
  //     setup: 'RNMQKBNR',
  //   },
  //   black: {
  //     arcana: [arcana.offrA, arcana.sumnRE, arcana.shftN],
  //     setup: 'rnmqkbnr',
  //   },
  // },
  // chronicles: {
  //   name: 'Chronicles',
  //   white: {
  //     arcana: [arcana.modsSUS, arcana.offrS, arcana.modsEXT, arcana.sumnRQ],
  //     setup: 'RNMQKMNR',
  //   },
  //   black: {
  //     arcana: [arcana.modsSUS, arcana.offrS, arcana.modsEXT, arcana.sumnRQ],
  //     setup: 'rnmqkmnr',
  //   },
  // },
  // alternateTimeline: {
  //   name: 'Alternate Timeline',
  //   white: {
  //     arcana: [arcana.dyadA, arcana.swapDEP, arcana.shftP, arcana.shftB],
  //     setup: 'RNBQKBTR',
  //   },
  //   black: {
  //     arcana: [arcana.dyadA, arcana.swapDEP, arcana.shftP, arcana.shftB],
  //     setup: 'rnbqkbtr',
  //   },
  // },
  senario2: {
    name: 'Scenario 2',
    white: {
      arcana: [],
      setup: 'RNBQKBNR',
    },
    black: {
      arcana: [arcana.modsAET],
      setup: 'rnbqkbnr',
    },
  },
  secnario6: {
    name: 'Scenario 6',
    white: {
      arcana: [arcana.modsAET],
      setup: 'RNBQKBNR',
    },
    black: {
      arcana: [arcana.dyadP],
      setup: 'rnbqkbnr',
    },
  },
  // somewhatMoreTheoretical: {
  //   name: 'Theoretical Balance 3',
  //   white: {
  //     arcana: [arcana.modsAET],
  //     setup: 'RNBQKBNR',
  //   },
  //   black: {
  //     arcana: [arcana.modsFUG],
  //     setup: 'rnbqkbnr',
  //   },
  // },
  seconds: {
    name: 'Seconds',
    white: {
      arcana: [arcana.dyadB, arcana.modsGLU],
      setup: 'RNBQKBNR',
    },
    black: {
      arcana: [arcana.dyadN, arcana.modsGLU],
      setup: 'rnbqkbnr',
    },
  },
  rockAndHardPlace: {
    name: 'A Rock and a Hard Place',
    white: {
      arcana: [arcana.sumnR, arcana.modsREA],
      setup: 'RNBVKBNR',
    },
    black: {
      arcana: [arcana.sumnR, arcana.modsEXT],
      setup: 'rnbvkbnr',
    },
  },
  suddenDeath: {
    name: 'Sudden Death',
    white: {
      arcana: [arcana.dyadA, arcana.modsREA, arcana.modsINH, arcana.modsGLU],
      setup: 'TMQVKQMT',
    },
    black: {
      arcana: [arcana.dyadA, arcana.modsREA, arcana.modsINH, arcana.modsGLU],
      setup: 'tmqvkqmt',
    },
  },
  stampede: {
    name: 'Stampede!',
    white: {
      arcana: [],
      setup: 'ZNUVKUNZ',
    },
    black: {
      arcana: [],
      setup: 'znuvkunz',
    },
  },
});
