// Note: Shout-out to CQL/Benchmark which was referenced while writing this

/**
 * Get value from localStorage
 * @param key id for localStorage
 * @returns item with "key"
 */
export const loadLocal = <T>(key: string) => {
  const item: string | null = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : undefined;
};

/**
 * Save item to localStorage
 * @param key id for localStorage
 * @param item value for key
 */
export const saveLocal = <T>(key: string, item: T | undefined) => {
  if (item === undefined) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Delete item from localStorage
 * @param key id for localStorage
 */
export const removeLocal = (key: string) => {
  localStorage.removeItem(key);
};

/** Hook provides callback functions to load, remove, and save
 *   values in localStorage.
 */
export const useLocal = <T>(key: string) => {
  const load = () => {
    return loadLocal<T>(key);
  };
  const save = (item: T) => {
    saveLocal(key, item);
  };
  const remove = () => {
    removeLocal(key);
  };
  return { load, remove, save };
};
