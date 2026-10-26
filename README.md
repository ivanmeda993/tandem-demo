# Shelf: a demo project for Tandem

Shelf is a tiny reading-list web app (plain HTML, CSS and JavaScript, no dependencies). It is here so you can try [Tandem](https://github.com/ivanmeda993/tandem), which lets Claude Code and OpenAI Codex work together, on a project where nothing is at stake.

```bash
npm test     # 7 logic tests, Node's own runner
npm start    # then open http://localhost:8000
```

## Why Tandem

- **Two vendors check each other.** Claude and Codex are trained differently and miss different things. Tandem has one write and the other review, so a bug one model is blind to has a second chance to be caught.
- **Each agent in the app you already use.** Claude's messages run in your Codex thread as new turns, so you watch them live in the Codex app, and Codex's answers come straight back into Claude's conversation. There is nothing new to open and no copying between windows.
- **Parallel work without collisions.** In an orchestrated run, every task gets its own git worktree, branch and Codex thread. Tasks that would change the same files wait for each other, so workers never overwrite one another.
- **You stay in charge.** Workers start only after you approve the plan, and nothing reaches your branch until you click Merge. Tandem never pushes, and every worker turn counts against a budget only you raise.
- **Reviews that hold up.** Codex reviews a pull request, a branch or your uncommitted changes, read-only, against the project's own rules (`AGENTS.md`). Claude checks each finding in the code before you hear of it, and only the findings you pick are posted to GitHub.
- **It survives long runs.** A run lives on disk, so a Mac restart, a killed process or Claude compacting its conversation does not lose it, and the orchestrator gets the run's state and its own notes back.
- **Local and on your own plans.** There is no server and no extra account. Everything runs through the official `claude` and `codex` command-line tools, signed in with your own subscriptions.

## Try it

Install Tandem first (see its README), open this folder in Claude Code and in the Codex app, and run `/tandem` in Claude to open the panel. Every scenario below uses your Codex usage limit; the first two are cheap.

### 1. Talk: Claude and Codex discuss a design (a few turns)

Ask Claude:

> Start a Codex thread and discuss with it how Shelf should store tags on books, then tell me what you agreed on.

Claude starts a thread named "tandem-demo · …", which you can watch in the Codex app, and the two talk until they agree. You can join in from the panel's Codex chat tab. When Claude and Codex have used 20 messages, they stop and wait for you.

### 2. Review: Codex reviews a branch with real bugs (one turn)

The `feature/search` branch adds a search box, and it has problems a good review should catch. Run:

```
/tandem review feature/search
```

Codex reads the branch in a read-only worktree, Claude checks each finding, and the panel shows them with their priorities.

<details>
<summary>What the review should find (spoilers)</summary>

- A book with no author breaks the search (`book.author` is `undefined` for books saved before authors existed).
- The search is case-sensitive, so "dune" does not find "Dune", unlike the rest of the app.
- The new test only covers the happy path, so it would pass with both bugs in place.
- The search query is not trimmed, so a trailing space finds nothing.

</details>

### 3. Orchestrate: a small run (about 3 to 6 worker turns)

Run:

```
/tandem orchestrate Add a "Clear read books" button that removes every book marked as read, with a test.
```

Answer Claude's setup questions (for a cheap first run: 1 worker, medium effort, workers in the Codex app, simplifier off), review the plan in the panel, approve it, and merge the task when Claude has reviewed it. The work lands on the run's branch `tandem/<run>`; merge that into `main` yourself.

### 4. Orchestrate: a parallel run (more worker turns)

```
/tandem orchestrate Add tags to books with a filter by tag, a dark theme that follows the system, and export and import of the shelf as a JSON file.
```

This one splits into several tasks. Watch the plan put tasks that touch the same files one after another, several Codex workers build in parallel in their own worktrees, Claude send work back with notes, and the simplifier propose what to cut.

## License

MIT
