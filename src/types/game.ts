import type { SpotifySong } from "./spotify";

export type GameStatus = 'idle' | 'playing' | 'won';

export type GameMode = {
  id: number;
  name: string;
  playlistId: string;
};

export type Guess = {
  songId: string;
  songName: string;
  artistName: string;
  isCorrect: boolean;
  diff?: {
    artist: boolean;
    title: boolean;
  };
  timestamp: number;
};

export type DailyProgress = {
  date: string;
  modeId: number;
  attempts: number;
  guesses: Guess[];
  songToGuess: SpotifySong;
  status: GameStatus;
};