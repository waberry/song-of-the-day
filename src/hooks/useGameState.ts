import { useCallback } from 'react';
import { useGameStore } from '~/store/gameStore';
import type { GameMode, SpotifySong, Guess } from '~/types/game';

export function useGameState() {
  const store = useGameStore();
  
  const startGame = useCallback((mode: GameMode, songToGuess: SpotifySong) => {
    store.initializeGame(mode, songToGuess);
  }, []);
  
  const makeGuess = useCallback((guessData: Omit<Guess, 'timestamp'>) => {
    store.addGuess(guessData);
  }, []);

  return {
    // State
    currentMode: store.currentMode,
    progress: store.getCurrentProgress(),
    status: store.status,
    canGuess: store.canGuess(),
    
    // Actions
    startGame,
    makeGuess,
    setMode: store.setCurrentMode,
    resetDaily: store.resetDaily,
  };
}
