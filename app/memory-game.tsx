"use client";

import { useEffect, useState } from "react";

type Card = {
  id: string;
  value: number;
};

const PAIR_COUNT = 10;
const STARTING_LIVES = 10;

function createDeck(seed = 8132026): Card[] {
  const cards = Array.from({ length: PAIR_COUNT }, (_, index) => index + 1)
    .flatMap((value) => [
      { id: `${value}-a`, value },
      { id: `${value}-b`, value },
    ]);

  let currentSeed = seed;
  for (let index = cards.length - 1; index > 0; index -= 1) {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    const swapIndex = Math.floor((currentSeed / 4294967296) * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return cards;
}

export function MemoryGame() {
  const [deck, setDeck] = useState<Card[]>(() => createDeck());
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [hasMismatch, setHasMismatch] = useState(false);

  const matches = matchedIds.length / 2;
  const won = matches === PAIR_COUNT;
  const lost = lives === 0 && !won;
  const gameOver = won || lost;

  useEffect(() => {
    if (!hasMismatch) return;

    const hideUnmatched = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-memory-card]")) {
        return;
      }
      setOpenIds([]);
      setHasMismatch(false);
    };

    document.addEventListener("pointerdown", hideUnmatched);
    return () => document.removeEventListener("pointerdown", hideUnmatched);
  }, [hasMismatch]);

  function restartGame() {
    setOpenIds([]);
    setMatchedIds([]);
    setLives(STARTING_LIVES);
    setHasMismatch(false);
    setDeck(createDeck(Date.now()));
  }

  function chooseCard(card: Card) {
    if (gameOver || matchedIds.includes(card.id)) return;

    let currentOpenIds = openIds;

    if (hasMismatch) {
      currentOpenIds = [];
      setOpenIds([]);
      setHasMismatch(false);
    }

    if (currentOpenIds.includes(card.id)) return;

    if (currentOpenIds.length === 0) {
      setOpenIds([card.id]);
      return;
    }

    const firstCard = deck.find(({ id }) => id === currentOpenIds[0]);
    const nextOpenIds = [currentOpenIds[0], card.id];
    setOpenIds(nextOpenIds);

    if (firstCard?.value === card.value) {
      setMatchedIds((currentMatches) => [...currentMatches, ...nextOpenIds]);
      setOpenIds([]);
    } else {
      setLives((currentLives) => Math.max(0, currentLives - 1));
      setHasMismatch(true);
    }
  }

  const statusMessage = won
    ? "You found every pair — brilliant memory!"
    : lost
      ? "No lives left. Give the deck another go."
      : hasMismatch
        ? "Not a match. Choose another card to continue."
        : openIds.length === 1
          ? "One card revealed. Find its match."
          : "Choose two cards with the same number.";

  return (
    <main className="game-shell" onPointerDown={() => undefined}>
      <section className="game" aria-labelledby="game-title">
        <header className="game-header">
          <div>
            <p className="eyebrow">Number pairs</p>
            <h1 id="game-title">Memory Match</h1>
          </div>
          <button className="restart-button restart-button--top" onClick={restartGame}>
            New game
          </button>
        </header>

        <div className="scoreboard" aria-label="Game score">
          <div className="score-item">
            <span className="score-label">Matches</span>
            <strong>{matches}<span> / {PAIR_COUNT}</span></strong>
          </div>
          <div className="score-divider" aria-hidden="true" />
          <div className="score-item score-item--lives">
            <span className="score-label">Lives</span>
            <strong>{lives}<span> / {STARTING_LIVES}</span></strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${matches * 10}%` }} />
          </div>
        </div>

        <p className="game-status" aria-live="polite">
          <span className={`status-dot${hasMismatch ? " status-dot--warning" : ""}`} aria-hidden="true" />
          {statusMessage}
        </p>

        <div className="card-grid" aria-label="Memory cards">
          {deck.map((card, index) => {
            const isOpen = openIds.includes(card.id);
            const isMatched = matchedIds.includes(card.id);
            const isVisible = isOpen || isMatched;

            return (
              <button
                className={`memory-card${isVisible ? " memory-card--visible" : ""}${isMatched ? " memory-card--matched" : ""}`}
                data-memory-card
                disabled={gameOver || isMatched}
                key={card.id}
                onClick={() => chooseCard(card)}
                aria-label={
                  isMatched
                    ? `Card ${index + 1}: matched number ${card.value}`
                    : isOpen
                      ? `Card ${index + 1}: number ${card.value}`
                      : `Reveal card ${index + 1}`
                }
                aria-pressed={isVisible}
              >
                <span className="card-inner" aria-hidden="true">
                  <span className="card-face card-back">
                    <span className="card-mark">✦</span>
                  </span>
                  <span className="card-face card-front">
                    <span>{card.value}</span>
                    {isMatched && <small>Matched</small>}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {gameOver && (
          <div className={`result-panel${won ? " result-panel--won" : ""}`} role="status">
            <div>
              <p className="result-kicker">{won ? "All ten pairs found" : "Round complete"}</p>
              <h2>{won ? "You won!" : "You’re out of lives"}</h2>
            </div>
            <button className="restart-button" onClick={restartGame}>
              Play again
            </button>
          </div>
        )}

        <footer className="game-footer">
          Reveal two cards at a time. A missed match costs one life.
        </footer>
      </section>
    </main>
  );
}
