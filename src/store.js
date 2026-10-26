// The shelf's logic: plain functions over a list of books, each returning a new list. No DOM, no storage, so every
// rule here has a test in tests/store.test.js.

/** @typedef {{ id: string, title: string, author: string, read: boolean, addedAt: number }} Book */

export const FILTERS = ['all', 'unread', 'read']
export const SORTS = ['added', 'title', 'author']

/**
 * Adds a book; a title is required, the author may be empty. Titles are trimmed, and the same title by the same author
 * is not added twice.
 * @param {Book[]} books
 * @param {{ title: string, author?: string }} input
 * @param {number} now
 * @returns {Book[]}
 */
export function addBook(books, input, now = Date.now()) {
  const title = (input.title ?? '').trim()
  const author = (input.author ?? '').trim()
  if (!title) throw new Error('A book needs a title.')
  const same = books.some(book => book.title.toLowerCase() === title.toLowerCase() && book.author.toLowerCase() === author.toLowerCase())
  if (same) return books
  return [...books, { id: `${now.toString(36)}-${books.length}`, title, author, read: false, addedAt: now }]
}

/** @param {Book[]} books @param {string} id @returns {Book[]} */
export function removeBook(books, id) {
  return books.filter(book => book.id !== id)
}

/** @param {Book[]} books @param {string} id @returns {Book[]} */
export function toggleRead(books, id) {
  return books.map(book => (book.id === id ? { ...book, read: !book.read } : book))
}

/** @param {Book[]} books @param {string} filter @returns {Book[]} */
export function filterBooks(books, filter) {
  if (filter === 'read') return books.filter(book => book.read)
  if (filter === 'unread') return books.filter(book => !book.read)
  return books
}

/** @param {Book[]} books @param {string} by @returns {Book[]} */
export function sortBooks(books, by) {
  const sorted = [...books]
  if (by === 'title' || by === 'author') {
    sorted.sort((a, b) => a[by].localeCompare(b[by], undefined, { sensitivity: 'base' }) || a.addedAt - b.addedAt)
  } else {
    sorted.sort((a, b) => a.addedAt - b.addedAt)
  }
  return sorted
}

/**
 * The books whose title or author contains the query.
 * @param {Book[]} books
 * @param {string} query
 * @returns {Book[]}
 */
export function searchBooks(books, query) {
  if (!query) return books
  return books.filter(book => book.title.includes(query) || book.author.includes(query))
}

/** @param {Book[]} books @returns {{ total: number, read: number }} */
export function summary(books) {
  return { total: books.length, read: books.filter(book => book.read).length }
}
