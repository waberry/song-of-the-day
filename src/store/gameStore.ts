import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStatus, DailyProgress, Guess, GameMode } from '~/types/game';
import type { SpotifySong } from '~/types/spotify';

interface GameState {
  currentMode: GameMode | null;
  dailyProgress: Record<string, DailyProgress>;
  status: GameStatus;
  
  setCurrentMode: (mode: GameMode) => void;
  addGuess: (guess: Omit<Guess, 'timestamp'>) => void;
  resetDaily: () => void;
  initializeGame: (mode: GameMode, songToGuess: SpotifySong) => void;
  getCurrentProgress: () => DailyProgress | null;
  canGuess: () => boolean;
}

const getCurrentDate = (): string => {
    const date = new Date().toISOString().split('T')[0];
    if (!date) {
      // Fallback in case something goes wrong with the ISO string
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    return date;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentMode: null,
      dailyProgress: {},
      status: 'idle',

      setCurrentMode: (mode) => {
        set({ currentMode: mode });
      },

      addGuess: (guess) => {
        if (!get().currentMode) return;
        
        const currentDate = getCurrentDate();
        const modeId = get().currentMode!.id;
        const key = `${modeId}-${currentDate}`;
        const progress = get().dailyProgress[key];

        if (!progress) return;

        const newGuess: Guess = {
          ...guess,
          timestamp: Date.now(),
        };

        const newProgress: DailyProgress = {
          ...progress,
          attempts: progress.attempts + 1,
          guesses: [...progress.guesses, newGuess],
          status: guess.isCorrect ? 'won' : 'playing',
        };

        set({
          dailyProgress: {
            ...get().dailyProgress,
            [key]: newProgress,
          },
          status: newProgress.status,
        });
      },

      resetDaily: () => {
        const currentDate = getCurrentDate();
        const newProgress = Object.entries(get().dailyProgress).reduce(
          (acc, [key, value]) => {
            const [modeId, date] = key.split('-');
            if (date === currentDate) return acc;
            return { ...acc, [key]: value };
          },
          {} as Record<string, DailyProgress>
        );
        
        set({
          dailyProgress: newProgress,
          status: 'idle',
        });
      },

      initializeGame: (mode: GameMode, songToGuess: SpotifySong) => {
        const currentDate = getCurrentDate();
        const key = `${mode.id}-${currentDate}`;
        
        if (!get().dailyProgress[key]) {
          const newProgress: DailyProgress = {
            date: currentDate,
            modeId: mode.id,
            attempts: 0,
            guesses: [],
            songToGuess,
            status: 'playing',
          };
      
          set({
            currentMode: mode,
            dailyProgress: {
              ...get().dailyProgress,
              [key]: newProgress,
            },
            status: 'playing',
          });
        }
      },
      getCurrentProgress: () => {
        if (!get().currentMode) return null;
        const currentDate = getCurrentDate();
        const key = `${get().currentMode?.id}-${currentDate}`;
        return get().dailyProgress[key] || null;
      },

      canGuess: () => {
        const progress = get().getCurrentProgress();
        if (!progress) return false;
        return progress.status !== 'won';
      },
    }),
    {
      name: 'music-game-storage',
      partialize: (state) => ({
        dailyProgress: state.dailyProgress,
      }),
    }
  )
);