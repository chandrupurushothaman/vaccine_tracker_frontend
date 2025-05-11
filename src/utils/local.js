const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}
const getLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    const value = window.localStorage.getItem(key);
    return value ? value : null;
  }
}
const removeLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}
const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
}

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage
}