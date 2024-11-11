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

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

const unpaddedCharacters = [
  {
    name: 'The Politician',
    inventory: [arcana.modsSKI, arcana.modsINH, arcana.offrC],
    setup: 'RNBVKBNR',
    imagePath: '/assets/characters/politician',
    color: 'red',
    description: '',
  },
];

export const modes = {
  newClassic: {
    name: 'The New Classic',
    white: {
      arcana: [arcana.offrH, arcana.sumnX, arcana.sumnRQ],
      setup: 'RNBQKBNR',
    },
    black: {
      arcana: [arcana.offrH, arcana.sumnX, arcana.sumnRQ],
      setup: 'rnbqkbnr',
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
};

const emptyArcane = {
  id: 'empty',
  name: '',
  description: 'No arcane selected here. Click to choose one!',
  type: '',
  imagePath: '/assets/arcanaImages/empty',
};

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
