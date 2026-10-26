// Keeps the shelf in the browser's localStorage. A missing or broken entry starts an empty shelf instead of failing.

const KEY = 'shelf.books'

/** @param {Storage} storage @returns {import('./store.js').Book[]} */
export function loadBooks(storage) {
  try {
    const value = JSON.parse(storage.getItem(KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

/** @param {Storage} storage @param {import('./store.js').Book[]} books */
export function saveBooks(storage, books) {
  try {
    storage.setItem(KEY, JSON.stringify(books))
  } catch {
    // A full or blocked storage keeps the shelf for this visit only.
  }
}
