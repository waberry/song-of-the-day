"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function SongList({
  visible,
  songs,
  isLoading,
  error,
  onSelect,
}) {
  if (!visible) return null;

  return (
    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg">
      {isLoading ? (
        <li className="p-2 text-center">
          <FontAwesomeIcon icon={faSpinner} spin /> Loading...
        </li>
      ) : error ? (
        <li className="p-2 text-center text-red-500">Error fetching data</li>
      ) : songs.length > 0 ? (
        songs.map((song) => (
          <li
            key={song.id}
            className="flex cursor-pointer items-center border-b border-gray-700 p-2 hover:bg-[#2e026d] hover:text-white"
            onMouseDown={() => onSelect(song)}
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
              <p className="text-xs text-gray-400">{song.artists[0].name}</p>
            </div>
          </li>
        ))
      ) : (
        <li className="p-2 text-center">No results found</li>
      )}
    </ul>
  );
}
