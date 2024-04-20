export const setLocalStorage = ({
  auth = {
    user: {
      id: '',
      username: '',
      campaign: { topScores: [] as number[] },
    },
  },
  chapter = 0,
  config = {},
  nodeScores = {},
  lessonsCompleted = [],
  inventory = {},
  nodeId = '',
  chapterEnd = false,
} = {}) => {
  const username = auth.user.username; // Replace 'defaultId' with a suitable default

  // If there is no username, you might not want to proceed
  if (username === '') {
    console.warn('No user ID provided for setLocalStorage');
    return;
  }

  // You might want to handle the case where some properties are not provided
  const existingData = JSON.parse(localStorage.getItem(username) || '{}');

  existingData.lessonsCompleted = Array.isArray(existingData.lessonsCompleted)
    ? [...existingData.lessonsCompleted]
    : [];

  // Merge existing data with new data
  const newData = {
    [username]: {
      ...existingData[username],
      auth: { ...existingData.auth, ...auth },
      chapter: existingData.chapter || chapter,
      config: { ...existingData.config, ...config },
      nodeScores: { ...existingData.nodeScores, ...nodeScores },
      lessonsCompleted: [...existingData.lessonsCompleted, ...lessonsCompleted],
      inventory: { ...existingData.inventory, ...inventory },
      nodeId: nodeId || existingData.nodeId,
      chapterEnd: chapterEnd || existingData.chapterEnd,
    },
  };
  localStorage.setItem(username, JSON.stringify(newData));
};

export const getLocalStorage = (username: string) => {
  const storedData = localStorage.getItem(username);

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const userData = parsedData[`${username}`];

    if (userData) {
      return userData;
    } else {
      console.error('User data not found for the provided ID');
      return null;
    }
  } else {
    // console.error('No data found in localStorage');
    return null;
  }
};
