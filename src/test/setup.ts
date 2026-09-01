import '@testing-library/jest-dom'

// Node 26 exposes a built-in `localStorage` global that throws unless the process
// was started with --localstorage-file, and it shadows the jsdom one — so
// `localStorage` reads as undefined inside tests. Give the suite a plain in-memory
// implementation when the environment doesn't supply a working one.
function hasWorkingLocalStorage(): boolean {
  try {
    return typeof globalThis.localStorage?.getItem === 'function'
  } catch {
    return false
  }
}

if (!hasWorkingLocalStorage()) {
  const store = new Map<string, string>()
  const memoryStorage: Storage = {
    get length() { return store.size },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => { store.delete(key) },
    setItem: (key: string, value: string) => { store.set(key, String(value)) },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: memoryStorage,
  })
}
