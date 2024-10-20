// import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface GuessState {
  date: string;
  guessedCorrectly: boolean;
  attempts: number;
}

// const STORAGE_KEY = "songOfTheDay_guessState";

// export function useGuessState() {
//   const [guessState, setGuessState] = useState<GuessState | null>(null);

//   useEffect(() => {
//     const storedState = localStorage.getItem(STORAGE_KEY);
//     if (storedState) {
//       const parsedState: GuessState = JSON.parse(storedState);
//       if (parsedState.date === new Date().toISOString().split("T")[0]) {
//         setGuessState(parsedState);
//       } else {
//         // If it's a new day, reset the state
//         localStorage.removeItem(STORAGE_KEY);
//       }
//     }
//   }, []);

//   const updateGuessState = (correctGuess: boolean) => {
//     const newState: GuessState = guessState
//       ? {
//           ...guessState,
//           guessedCorrectly: guessState.guessedCorrectly || correctGuess,
//           attempts: guessState.attempts + 1,
//         }
//       : {
//           date: new Date().toISOString().split("T")[0],
//           guessedCorrectly: correctGuess,
//           attempts: 1,
//         };

//     setGuessState(newState);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
//   };

//   return { guessState, updateGuessState };
// }

export function useGuessState() {
  const [guessState, setGuessState] = useLocalStorage("guessState", {
    guessedCorrectly: false,
    attempts: 0,
  });

  const updateGuessState = (isCorrect) => {
    setGuessState((prevState) => ({
      guessedCorrectly: isCorrect || prevState.guessedCorrectly,
      attempts: prevState.attempts + 1,
    }));
  };

  return { guessState, updateGuessState };
}
