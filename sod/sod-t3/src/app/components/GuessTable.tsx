"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function GuessTable({ pickedSongs }) {
  const [expandedRow, setExpandedRow] = useState(null);

  if (pickedSongs.length === 0) return null;

  return (
    <div className="mt-8 w-full overflow-x-auto">
      <div className="max-h-[400px] overflow-y-auto overscroll-contain rounded-lg pr-2 shadow">
        <table className="min-w-full divide-y divide-indigo-200">
          <thead className="sticky top-0 bg-indigo-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">
                Song
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">
                Artist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">
                Hints
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-200 bg-white">
            {pickedSongs.map((song, index) => (
              <motion.tr
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpandedRow(expandedRow === song.id ? null : song.id)
                }
              >
                <td className="flex items-center whitespace-nowrap px-6 py-4">
                  <img
                    src={song.album.images[0].url}
                    width={50}
                    height={50}
                    alt=""
                    className="mr-4 rounded-md"
                  />
                  <div className="text-sm font-medium text-gray-900">
                    {song.name}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {song.artists[0].name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {song.isCorrectGuess ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Correct Guess!
                    </span>
                  ) : (
                    song.commonMetadata && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(song.commonMetadata).map(
                          ([key, value]) =>
                            value && (
                              <span
                                key={key}
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getHintColor(key)}`}
                              >
                                {formatHintText(key)}
                              </span>
                            ),
                        )}
                      </div>
                    )
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getHintColor(hint) {
  const colors = {
    sameArtist: "bg-green-100 text-green-800",
    sameAlbum: "bg-blue-100 text-blue-800",
    sameYear: "bg-yellow-100 text-yellow-800",
    sameGenre: "bg-purple-100 text-purple-800",
    sameDecade: "bg-pink-100 text-pink-800",
    popularityDifference: "bg-indigo-100 text-indigo-800",
    sameDuration: "bg-teal-100 text-teal-800",
  };
  return colors[hint] || "bg-gray-100 text-gray-800";
}

function formatHintText(hint) {
  return hint
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
