export function loadState<T>(key: string, defaultValue: T): T {
  const str = localStorage.getItem(key);
  if (str === null) return defaultValue;
  return JSON.parse(str) as T;
}
