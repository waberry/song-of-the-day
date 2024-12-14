import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faTwitter } from "@fortawesome/free-solid-svg-icons";
// import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Twitter } from "lucide-react"


interface TwitterProps {
  gameState: any;
}

const ShareButton: React.FC<TwitterProps> = ({ gameState }) => {
  const handleShare = () => {
    const attemptCount = gameState.pickedSongs.length;
    const shareText = gameState.dailySongFound
      ? `I guessed today's Song of the Day in ${attemptCount} attempt${attemptCount !== 1 ? 's' : ''}! Can you beat my score?`
      : `I've made ${attemptCount} guess${attemptCount !== 1 ? 'es' : ''} on today's Song of the Day. Join me and see if you can solve it!`;

    const tweetText = encodeURIComponent(`${shareText}

🎧 Play now: ${window.location.origin}

#SongOfTheDay #MusicTrivia`);

    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-500
      rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 mt-4"
    >
      {/* <FontAwesomeIcon icon={faShare} className="mr-2" /> */}
      <FontAwesomeIcon icon={faTwitter} size="lg" />
       Share Progress
    </button>
  );
};

export default ShareButton;
