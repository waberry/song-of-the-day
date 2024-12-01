import React from 'react';
import { GameState } from "~/types/types";
import { FlipBoard } from './animatedText';
import { Twitter } from "lucide-react"

interface HeaderProps {
  gameState: GameState | null;
}

const HeaderProps: React.FC<HeaderProps> = ({ gameState }) => {
  return (
    <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white dark:from-purple-800 dark:to-purple-900">
      <CardContent className="flex flex-col items-center space-y-6 p-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight sm:text-5xl text-center">
          What is the <span className="flex justify-center gap-1 py-2">
            <span className="inline-block rounded bg-sky-400 px-3 py-1 dark:bg-sky-600">S</span>
            <span className="inline-block rounded bg-sky-400 px-3 py-1 dark:bg-sky-600">O</span>
            <span className="inline-block rounded bg-sky-400 px-3 py-1 dark:bg-sky-600">N</span>
            <span className="inline-block rounded bg-sky-400 px-3 py-1 dark:bg-sky-600">G</span>
          </span> of the day?
        </h1>
        <p className="text-xl">The song of the day is hidden. Can you guess it?</p>
        <p className="text-lg">Attempts: {gameState.remainingGuesses}</p>
        <p>Use the search box below to make your guess!</p>
        <Button variant="secondary" className="flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          Share Progress
        </Button>
      </CardContent>
    </Card>
  )
}
