export const characters = {
  viking: {
    sumnX: 1,
    dyadA: 1,
    sumnR: 1,
  },
};

export const modes = {
  newClassic: {
    name: 'The New Classic',
    white: { offrH: 1, sumnX: 1, sumnRQ: 1 },
    black: { offrH: 1, sumnX: 1, sumnRQ: 1 },
  },
  theoretical: {
    name: 'The Theoretical Balance',
    white: {},
    black: { modsFUG: 1 },
  },
  evenMoreTheoretical: {
    name: 'The Even More Theoretical Balance',
    white: { modsFUG: 1 },
    black: { modsINH: 1 },
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
