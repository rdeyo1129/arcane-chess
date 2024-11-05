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

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

export const characters = {};

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
