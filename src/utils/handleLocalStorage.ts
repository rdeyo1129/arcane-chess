export const setLocalStorage = ({
  auth = { user: { id: '' } },
  chapter = 0,
  config = {},
  nodeScores = {},
  inventory = {},
  nodeId = '',
} = {}) => {
  const id = auth.user.id; // Replace 'defaultId' with a suitable default

  // If there is no id, you might not want to proceed
  if (id === '') {
    console.warn('No user ID provided for setLocalStorage');
    return;
  }

  // You might want to handle the case where some properties are not provided
  const existingData = JSON.parse(localStorage.getItem(id) || '{}');

  // Merge existing data with new data
  const newData = {
    [id]: {
      // ...existingData,
      auth: { ...existingData.auth, ...auth },
      chapter: existingData.chapter || chapter,
      config: { ...existingData.config, ...config },
      nodeScores: { ...existingData.nodeScores, ...nodeScores },
      inventory: { ...existingData.inventory, ...inventory },
      nodeId: nodeId || existingData.nodeId,
    },
  };

  localStorage.setItem(id, JSON.stringify(newData));
};

export const getLocalStorage = (id: string) => {
  const storedData = localStorage.getItem(id);

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const userData = parsedData[`${id}`];

    if (userData) {
      return userData;
    } else {
      console.error('User data not found for the provided ID');
      return null;
    }
  } else {
    console.error('No data found in localStorage');
    return null;
  }
};
