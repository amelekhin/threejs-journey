type DebounceCallback<T extends unknown[], U> = (...args: T) => U | void;

export function debounce<T extends unknown[], U>(callback: DebounceCallback<T, U>, ms: number): DebounceCallback<T, U> {
  let timeoutId: number;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), ms);
  };
}
