import React from 'react';

const SongComparisonTable = ({ selectedSong, dailySong }) => {
  const compareSongs = (selectedSong, dailySong) => {
    const feedback = [];

    // Compare artists
    const artistMatch = selectedSong.artists.some(artist =>
      dailySong.artists.some(dailyArtist => dailyArtist.name.toLowerCase() === artist.name.toLowerCase())
    );
    feedback.push({
      attribute: 'Artist',
      comparison: artistMatch ? 'Same Artist' : 'Different Artist',
    });

    // Compare album names
    feedback.push({
      attribute: 'Album',
      comparison: selectedSong.album.name.toLowerCase() === dailySong.album.name.toLowerCase()
        ? 'Same Album'
        : 'Different Album',
    });

    // Compare release years
    const releaseYearMatch = new Date(selectedSong.album.release_date).getFullYear() ===
                             new Date(dailySong.album.release_date).getFullYear();
    feedback.push({
      attribute: 'Year',
      comparison: releaseYearMatch ? 'Same Year' : 'Different Year',
    });

    // Compare genres
    const genreMatch = selectedSong.genres && dailySong.genres
      ? selectedSong.genres.some(genre =>
          dailySong.genres.some(dailyGenre =>
            dailyGenre.toLowerCase().includes(genre.toLowerCase()) ||
            genre.toLowerCase().includes(dailyGenre.toLowerCase())
          )
        )
      : false;
    feedback.push({
      attribute: 'Genre',
      comparison: genreMatch ? 'Same Genre' : 'Different Genre',
    });

    // Compare release decades
    const decadeMatch = Math.floor(new Date(selectedSong.album.release_date).getFullYear() / 10) ===
                         Math.floor(new Date(dailySong.album.release_date).getFullYear() / 10);
    feedback.push({
      attribute: 'Decade',
      comparison: decadeMatch ? 'Same Decade' : 'Different Decade',
    });

    // Compare popularity
    const popularityDifference = Math.abs(selectedSong.popularity - dailySong.popularity);
    feedback.push({
      attribute: 'Popularity',
      comparison: popularityDifference <= 10
        ? 'Similar Popularity'
        : 'Different Popularity',
    });

    // Compare duration
    const durationDifference = Math.abs(selectedSong.duration_ms - dailySong.duration_ms);
    feedback.push({
      attribute: 'Duration',
      comparison: durationDifference <= 10000
        ? 'Similar Duration'
        : 'Different Duration',
    });

    return feedback;
  };

  const feedback = compareSongs(selectedSong, dailySong);

  return (
    <div className="container mx-auto mt-8 w-full overflow-x-auto">
      <div className="max-h-[400px] overflow-y-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-indigo-200">
          <thead className="sticky top-0 bg-indigo-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Attribute</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-indigo-700">Comparison</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-200 bg-white">
            {feedback.map((item, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-700">{item.attribute}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.comparison}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongComparisonTable;
