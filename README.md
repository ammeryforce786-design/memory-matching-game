# Memory Match

A responsive React memory game built around ten numbered pairs. Reveal two cards at a time, keep every successful match, and find all 10 pairs before your 10 lives run out.

**Live game:** https://ammeryforce786-design.github.io/memory-matching-game/

## Game rules

- The deck contains 20 shuffled cards: two copies of each number from 1–10.
- A matching pair stays visible and increases the match score by one.
- A missed pair costs one life and remains visible until the player's next interaction.
- Finding all 10 pairs wins the round; reaching zero lives loses it.

## Run locally

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run lint
npm test
```

Every push to `main` builds the static production version and publishes it with GitHub Pages.
