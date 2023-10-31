export const setLocalStorage = (
  auth: { user: { id: string } },
  chapter: number = 0,
  config: { [key: string]: boolean | string | number | null },
  nodeScores: number[],
  inventory: { [key: string]: boolean | string | number | null }
) => {
  const id = auth.user.id;
  const obj = {
    [id]: { auth, chapter, config, nodeScores, inventory },
  };
  localStorage.setItem(id, JSON.stringify(obj));
};

export const getLocalStorage = (id: string) => {
  const storedData = localStorage.getItem(id);

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const userData = parsedData[id];

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
