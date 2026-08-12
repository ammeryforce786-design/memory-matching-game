import type { Metadata } from "next";
import { MemoryGame } from "./memory-game";

export const metadata: Metadata = {
  title: "Memory Match",
  description: "A bright, focused number-matching game with ten pairs to find.",
};

export default function Home() {
  return <MemoryGame />;
}
