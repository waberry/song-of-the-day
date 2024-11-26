export interface GameState {
    id?: number;  // Optional because it's auto-generated
    anonymousUserId: string;
    pickedSongs: any[];
    dailySongFound: boolean;
    guessState: {
      guessedCorrectly: boolean;
      attempts: number;
    };
    lastResetDate: Date;
  }