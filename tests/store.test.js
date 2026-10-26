import assert from 'node:assert/strict'
import { test } from 'node:test'

import { addBook, filterBooks, removeBook, sortBooks, summary, toggleRead } from '../src/store.js'
import { loadBooks, saveBooks } from '../src/storage.js'

const shelf = [
  { id: 'a', title: 'Dune', author: 'Frank Herbert', read: true, addedAt: 1 },
  { id: 'b', title: 'anathem', author: 'Neal Stephenson', read: false, addedAt: 2 },
  { id: 'c', title: 'Circe', author: '', read: false, addedAt: 3 },
]

test('a book needs a title, and its text is trimmed', () => {
  assert.throws(() => addBook([], { title: '   ' }), /needs a title/)
  const [book] = addBook([], { title: '  Piranesi ', author: ' Susanna Clarke ' }, 10)
  assert.deepEqual([book.title, book.author, book.read, book.addedAt], ['Piranesi', 'Susanna Clarke', false, 10])
})

test('the same book is not added twice, whatever its case', () => {
  assert.equal(addBook(shelf, { title: 'DUNE', author: 'frank herbert' }), shelf)
  assert.equal(addBook(shelf, { title: 'Dune', author: 'Someone Else' }).length, 4)
})

test('removing and toggling change only the book named', () => {
  assert.deepEqual(removeBook(shelf, 'b').map(book => book.id), ['a', 'c'])
  assert.deepEqual(toggleRead(shelf, 'b').map(book => book.read), [true, true, false])
  assert.equal(shelf[1].read, false) // the list it was given stays as it was
})

test('filters show read, unread or all books', () => {
  assert.deepEqual(filterBooks(shelf, 'read').map(book => book.id), ['a'])
  assert.deepEqual(filterBooks(shelf, 'unread').map(book => book.id), ['b', 'c'])
  assert.equal(filterBooks(shelf, 'all').length, 3)
})

test('sorting by title or author ignores case, and empty authors come first', () => {
  assert.deepEqual(sortBooks(shelf, 'title').map(book => book.id), ['b', 'c', 'a'])
  assert.deepEqual(sortBooks(shelf, 'author').map(book => book.id), ['c', 'a', 'b'])
  assert.deepEqual(sortBooks(shelf, 'added').map(book => book.id), ['a', 'b', 'c'])
})

test('the summary counts read books', () => {
  assert.deepEqual(summary(shelf), { total: 3, read: 1 })
})

test('a broken or missing saved shelf loads as empty', () => {
  const storage = (value => ({ getItem: () => value, setItem: () => undefined }))('{not json')
  assert.deepEqual(loadBooks(storage), [])
  assert.deepEqual(loadBooks({ getItem: () => null }), [])
  assert.doesNotThrow(() => saveBooks({ setItem: () => { throw new Error('full') } }, shelf))
})
