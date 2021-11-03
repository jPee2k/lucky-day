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

export const hasData = (data = []) => {
  if (!isStorageAvailable()) {
    return false;
  }
  return data.every((key) => localStorage.getItem(key));
};

export const saveToState = (data, userData) => {
  data.forEach((key) => {
    userData[key] = localStorage.getItem(key);
  });
};

export const compareDate = () => {
  if (!isStorageAvailable()) {
    return false;
  }
  return localStorage.getItem('today') === new Date().toLocaleDateString();
};
