import React from 'react';
import "./Banner.css";

interface HeroProps {
//   title: string;
//   subtitle: string;
//   imageUrl: string;
}

const Hero: React.FC<HeroProps> = () => {
  return (
    <div className="banner">
      {/* <img src={"src/assets/banner.jpg"} alt="Hero" className="hero-image" /> */}
      <div className="hero-content">
        <h1 className="hero-title">{"Song Of The Day"}</h1>
        <h2 className="hero-subtitle">{"Ready?"}</h2>
      </div>
    </div>
  );
};

export default Hero;
