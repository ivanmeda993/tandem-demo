// The page: draws the shelf and turns the person's clicks into store calls. The rules live in store.js.
import { FILTERS, SORTS, addBook, filterBooks, removeBook, searchBooks, sortBooks, summary, toggleRead } from './store.js'
import { loadBooks, saveBooks } from './storage.js'

const state = { books: loadBooks(localStorage), filter: 'all', sort: 'added', query: '', error: '' }

function set(change) {
  Object.assign(state, change)
  saveBooks(localStorage, state.books)
  render()
}

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props)
  node.append(...children.filter(child => child !== null))
  return node
}

function form() {
  const title = el('input', { name: 'title', placeholder: 'Title', required: true })
  const author = el('input', { name: 'author', placeholder: 'Author' })
  return el(
    'form',
    {
      className: 'add',
      onsubmit: event => {
        event.preventDefault()
        try {
          set({ books: addBook(state.books, { title: title.value, author: author.value }), error: '' })
        } catch (error) {
          set({ error: error.message })
        }
      },
    },
    title,
    author,
    el('button', { type: 'submit' }, 'Add'),
  )
}

function controls() {
  const choose = (values, current, key) =>
    el(
      'div',
      { className: 'choices' },
      ...values.map(value =>
        el('button', { className: value === current ? 'on' : '', onclick: () => set({ [key]: value }) }, value),
      ),
    )
  const search = el('input', { type: 'search', placeholder: 'Search', value: state.query, oninput: event => set({ query: event.target.value }) })
  return el('div', { className: 'controls' }, search, choose(FILTERS, state.filter, 'filter'), choose(SORTS, state.sort, 'sort'))
}

function row(book) {
  return el(
    'li',
    { className: book.read ? 'read' : '' },
    el('input', { type: 'checkbox', checked: book.read, onchange: () => set({ books: toggleRead(state.books, book.id) }) }),
    el('span', { className: 'title' }, book.title),
    book.author ? el('span', { className: 'author' }, book.author) : null,
    el('button', { className: 'remove', title: 'Remove', onclick: () => set({ books: removeBook(state.books, book.id) }) }, '×'),
  )
}

function render() {
  const shown = sortBooks(searchBooks(filterBooks(state.books, state.filter), state.query), state.sort)
  const { total, read } = summary(state.books)
  document.querySelector('#app').replaceChildren(
    ...[
      el('h1', {}, 'Shelf'),
      el('p', { className: 'count' }, `${read} of ${total} read`),
      form(),
      state.error ? el('p', { className: 'error' }, state.error) : null,
      controls(),
      shown.length ? el('ul', {}, ...shown.map(row)) : el('p', { className: 'empty' }, 'Nothing here yet.'),
    ].filter(child => child !== null),
  )
}

render()
