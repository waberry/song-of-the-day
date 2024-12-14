"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const genres = [
  { id: "pop", name: "Pop", icon: "🎵" },
  { id: "rock", name: "Rock", icon: "🎸" },
  { id: "hiphop", name: "Hip Hop", icon: "🎤" },
  { id: "electronic", name: "Electronic", icon: "💿" },
  { id: "jazz", name: "Jazz", icon: "🎷" },
  { id: "classical", name: "Classical", icon: "🎻" },
]

interface GenreSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function GenreSelector({ isOpen, onClose }: GenreSelectorProps) {
  const router = useRouter()

  const handleGenreSelect = (genreId: string) => {
    router.push(`/play/genre/${genreId}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Genre</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent"
              onClick={() => handleGenreSelect(genre.id)}
            >
              <span className="text-2xl">{genre.icon}</span>
              <span>{genre.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 