import _ from 'lodash';

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
  lessonsCompleted = [] as string[],
  inventory = {},
  nodeId = '',
  chapterEnd = false,
} = {}) => {
  const username = auth.user.username;

  // If there is no username, you might not want to proceed
  if (username === '') {
    console.warn('No user ID provided for setLocalStorage');
    return;
  }

  // Retrieve existing data or initialize if not present
  const existingData = JSON.parse(localStorage.getItem(username) || '{}');

  // Ensure existingData[username] is initialized properly
  if (!existingData[username]) {
    existingData[username] = {
      auth: {},
      chapter: 0,
      config: {},
      nodeScores: {},
      lessonsCompleted: [],
      inventory: {},
      nodeId: '',
      chapterEnd: false,
    };
  }

  if (Object.keys(nodeScores).length === 0) {
    existingData[username].nodeScores = {};
  }

  // Merge and update the lessonsCompleted by checking each lesson individually
  lessonsCompleted.forEach((lesson) => {
    if (!_.includes(existingData[username].lessonsCompleted, lesson)) {
      existingData[username].lessonsCompleted.push(lesson);
    }
  });

  // Merge existing data with new data
  const newData = {
    [username]: {
      ...existingData[username],
      auth: { ...existingData[username].auth, ...auth },
      chapter: chapter,
      config: { ...existingData[username].config, ...config },
      nodeScores: { ...existingData[username].nodeScores, ...nodeScores },
      lessonsCompleted: [...existingData[username].lessonsCompleted],
      inventory: { ...existingData[username].inventory, ...inventory },
      nodeId: nodeId,
      chapterEnd: chapterEnd,
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
