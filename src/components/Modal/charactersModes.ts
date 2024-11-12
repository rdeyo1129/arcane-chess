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
// const O = '#c77c35';
const Y = '#d9b800';
// const G = '#34aa48';
// const B = '#3f48cc';
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
    imagePath: `${path}warlord`,
    color: Y,
    description:
      'Look for the double attacks, escape a threat against your King.',
  },
  {
    name: 'The Banshee',
    inventory: [arcana.dyadW, arcana.dyadW, arcana.sumnW, arcana.sumnW],
    setup: 'RNWQKWNR',
    imagePath: `${path}banshee`,
    color: V,
    description: '',
  },
  {
    name: 'The Ghoul',
    inventory: [arcana.sumnS, arcana.sumnS, arcana.dyadS, arcana.dyadS],
    setup: 'RSBQKBSR',
    imagePath: `${path}ghoul`,
    color: V,
    description: '',
  },
  {
    name: 'The Politician',
    inventory: [arcana.modsSKI, arcana.modsINH, arcana.offrC],
    setup: 'RNBVKBNR',
    imagePath: `${path}politician`,
    color: R,
    description: 'Play for the endgame and use your resources.',
  },
];

export const startingInventory = Array(6).fill(emptyArcane);

export const padInventory = (characters: Character[]) => {
  return characters.map((character) => ({
    ...character,
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
  newClassic: {
    name: 'The New Classic',
    white: {
      arcana: [arcana.offrH, arcana.sumnX, arcana.sumnRQ],
      setup: 'RNBTKBNR',
    },
    black: {
      arcana: [arcana.offrH, arcana.sumnX, arcana.sumnRQ],
      setup: 'rnbtkbnr',
    },
  },
  theoretical: {
    name: 'A Theoretical Balance',
    white: {
      arcana: [],
      setup: 'RNBQKBNR',
    },
    black: {
      arcana: [arcana.modsFUG],
      setup: 'rnbqkbnr',
    },
  },
  evenMoreTheoretical: {
    name: 'An Even More Theoretical Balance',
    white: {
      arcana: [arcana.modsFUG],
      setup: 'RNBQKBNR',
    },
    black: {
      arcana: [arcana.modsINH],
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
});
