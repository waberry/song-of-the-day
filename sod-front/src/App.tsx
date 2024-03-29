import Banner from "./components/Banner";
import SearchBar from "./components/SearchBar";
import { useState, useEffect } from "react";
import { SpotifyTrack } from "./utils/interfaces";
import _ from "lodash";

import "./App.css";

function App() {
  const [data, setData] = useState<any>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [queryString, setQueryString] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null);
  const [selectedList, setSelectedList] = useState<SpotifyTrack[]>([]);

  useEffect(() => {
    debouncedFetchData(queryString); // Call debounced function on query change
  }, [queryString]);

  useEffect(() => {
    const cachedSong = localStorage.getItem("selectedSong");
    if (cachedSong) {
      try {
        setSelectedSong(JSON.parse(cachedSong));
      } catch (error) {
        console.error("Error parsing cached song:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedSong) {
      localStorage.setItem("selectedSong", JSON.stringify(selectedSong));
    } else {
      localStorage.removeItem("selectedSong");
    }
  }, [selectedSong]);

  useEffect(() => {
    // Update selected songs list on selection change
    if (!selectedSong) return;
    if (selectedList.includes(selectedSong)) return;
    setSelectedList([...selectedList, selectedSong]);
  }, [selectedSong]); // Update on selectedSong change

  const handleSelection = (song: SpotifyTrack) => {
    console.log(song);
    setSelectedSong(song);
    // ... (Optional: persist selection to local storage or similar)
  };
  // Debounced fetch function using lodash
  const debouncedFetchData = _.debounce(async (querySearch: string) => {
    if (querySearch === "") {
      setData([]);
      setTracks([]);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/spotify/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery: querySearch }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const searchData = await response.json();
      setData(searchData);
      setTracks(searchData.tracks.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Clear loading state after fetch completes
    }
  }, 500); // Delay by 500ms

  const handleNewQueryString = (query: string) => {
    console.log("received query: ", query);
    setQueryString(query);
    debouncedFetchData(queryString);
    setIsLoading(true);
  };

  return (
    <>
      <Banner />
      <SearchBar
        items={tracks}
        itemSelection={handleSelection}
        sendQueryString={handleNewQueryString}
        isLoading={isLoading}
      />
      {/* Display loading indicator (optional) */}
      {isLoading && <div className="loading">Loading...</div>}
      {/* Display list of selected songs */}
      {selectedList && selectedList.length > 0 && (
        <div className="selected-songs">
          <h2>Selected Songs</h2>
          <ul>
            {selectedList &&
              selectedList.length &&
              selectedList.map((song) => (
                <li key={song.id}>
                  {song.name} - {song.artists && song.artists[0].name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
