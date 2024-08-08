"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [pickedSongs, setPickedSongs] = useState([]); // State for picked songs
  const [showPopup, setShowPopup] = useState(false); // State for popup message

  const {
    data: filteredSongs = [],
    isFetching,
    isLoading,
    error,
  } = api.spotify.searchTracks.useQuery(
    { searchTerm: submittedSearchTerm },
    { enabled: !!submittedSearchTerm },
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmittedSearchTerm("");
    setSearchTerm(e.target.value.toLowerCase());
    setDropdownVisible(false);
  };

  const handleFocus = () => {
    if (submittedSearchTerm.trim() !== "") {
      setDropdownVisible(true);
    }
  };

  const handleBlur = () => {
    setDropdownVisible(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    if (submittedSearchTerm.trim() === searchTerm.trim()) return;
    setSubmittedSearchTerm(searchTerm);
    setDropdownVisible(true);
  };

  const handleDDSelect = (song: any) => {
    setPickedSongs((prevSongs) => {
      if (prevSongs.some((pickedSong) => pickedSong.id === song.id)) {
        // Show popup if song is already picked
        setShowPopup(true);
        return prevSongs; // Return the current state if the song is already picked
      }
      return [...prevSongs, song];
    });
    setDropdownVisible(false); // Hide dropdown after selection
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000); // Hide popup after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="rounded bg-red-500 px-4 py-2 text-white shadow-lg">
            Song already added!
          </div>
        </div>
      )}
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          What is the <span className="text-[hsl(280,100%,70%)]">song</span> of
          the day
        </h1>
      </div>
      <div className="container mx-auto mb-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by artist or title"
              onChange={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full rounded-md border border-gray-300 bg-[#202030] px-4 py-2 pl-10 text-white focus:border-[#2e026d] focus:outline-none"
              aria-expanded={dropdownVisible}
              aria-haspopup="listbox"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            {dropdownVisible && (
              <ul
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#202030] shadow-lg"
                role="listbox"
                aria-activedescendant=""
              >
                {isLoading || isFetching ? (
                  <li className="p-2 text-center">
                    <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                  </li>
                ) : error ? (
                  <li className="p-2 text-center text-red-500">
                    Error fetching data
                  </li>
                ) : filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <li
                      key={song.id}
                      id={song.id}
                      className="flex cursor-pointer items-center border-b border-gray-700 p-2 hover:bg-[#2e026d] hover:text-white"
                      onMouseDown={() => handleDDSelect(song)} // Use onMouseDown to prevent blur before click
                      role="option"
                    >
                      <img
                        src={song.album.images[0].url}
                        width={50}
                        height={50}
                        alt=""
                        className="mr-3 rounded-md"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">{song.name}</h3>
                        <p className="text-xs text-gray-400">
                          {song.artists[0].name}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-center">No results found</li>
                )}
              </ul>
            )}
          </div>
        </form>
      </div>
      <div className="container mx-auto">
        {pickedSongs.length > 0 && (
          <div className="mt-8 w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#202030]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                  >
                    Cover
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                  >
                    Artist
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-[#2e026d]">
                {pickedSongs.map((song) => (
                  <tr key={song.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <img
                        src={song.album.images[0].url}
                        width={50}
                        height={50}
                        alt=""
                        className="rounded-md"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-300">
                        {song.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {song.artists[0].name}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
