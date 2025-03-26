
import React from 'react';

interface HeroModalImageProps {
  heroName: string;
}

export const HeroModalImage: React.FC<HeroModalImageProps> = ({ heroName }) => {
  // Create hero image path with special cases
  const getHeroImagePath = (heroName: string) => {
    // Handle special cases
    if (heroName === "Widget and Pyro") return "/heroes/widget.jpg";
    if (heroName === "Ignatia") return "/heroes/ignatia.jpg";
    
    // Default case
    return `/heroes/${heroName.toLowerCase()}.jpg`;
  };
  
  const heroImagePath = getHeroImagePath(heroName);
  
  return (
    <div className="mb-6 flex justify-center">
      <div className="w-48 h-48 bg-amber-800/20 border border-amber-700/30 rounded-lg overflow-hidden">
        <img 
          src={heroImagePath}
          alt={heroName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML += '<div class="flex items-center justify-center w-full h-full text-amber-600/60 font-rune text-lg">No Image</div>';
          }}
        />
      </div>
    </div>
  );
};
