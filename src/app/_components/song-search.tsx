"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Song = {
  id: string;
  name: string;
  artist: string;
};

interface SongSearchProps {
  onSelect: (songId: string) => void;
  disabled?: boolean;
}

export function SongSearch({ onSelect, disabled }: SongSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const searchSongs = async (query: string) => {
    // TODO: Implement Spotify search
    setLoading(true);
    try {
      // Mock data for now
      setSongs([
        { id: "1", name: "Song 1", artist: "Artist 1" },
        { id: "2", name: "Song 2", artist: "Artist 2" },
      ]);
    } catch (error) {
      console.error("Failed to search songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {value ? `${value}` : "Search for a song..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput 
            placeholder="Type to search..." 
            onValueChange={(search) => {
              if (search.length >= 3) {
                searchSongs(search);
              }
            }}
          />
          <CommandEmpty>No songs found.</CommandEmpty>
          <CommandGroup>
            {songs.map((song) => (
              <CommandItem
                key={song.id}
                value={song.id}
                onSelect={() => {
                  onSelect(song.id);
                  setValue(`${song.name} - ${song.artist}`);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span>{song.name}</span>
                  <span className="text-sm text-muted-foreground">{song.artist}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}