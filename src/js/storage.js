export const isStorageAvailable = () => {
  try {
    localStorage.setItem('key', 'value');
    localStorage.getItem('key');
    return true;
  } catch (err) {
    return false;
  }
};

export const saveData = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    switch (key) {
      case 'birthday':
        localStorage.setItem(key, value.toLocaleDateString());
        break;
      default:
        localStorage.setItem(key, value.toString());
    }
  });
};

export const hasData = () => !!localStorage.getItem('birthday');
