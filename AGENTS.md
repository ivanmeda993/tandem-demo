# Rules for agents in this project

Shelf is a reading-list web app in plain HTML, CSS and JavaScript modules.

- No dependencies: nothing to install, no build step. Tests use Node's own runner: `npm test` (`node --test`).
- Logic goes in `src/store.js` as pure functions that return new lists; every rule there has a test in `tests/`.
- `src/app.js` only draws the page and calls the store; `src/storage.js` only reads and writes localStorage.
- Colors and sizes come from the tokens in `:root` of `styles.css`; a theme changes tokens, not rules.
- Keep each change small and in the files the task names. Add tests for logic, not for how the page looks.
- Run the page with `npm start` and open http://localhost:8000.
