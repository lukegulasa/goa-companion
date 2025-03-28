
import React from 'react';

interface HeroModalImageProps {
  heroName: string;
}

export const HeroModalImage: React.FC<HeroModalImageProps> = ({ heroName }) => {
  // Create hero image path with special cases
  const getHeroImagePath = (heroName: string) => {
    // Handle special cases - ensure we're using lowercase for path construction
    if (heroName === "Widget and Pyro") return "/heroes/widget.jpg";
    if (heroName === "Widget And Pyro") return "/heroes/widget.jpg"; // Handle capitalization variation
    if (heroName === "Ignatia") return "/heroes/ignatia.jpg";
    
    // Default case
    return `/heroes/${heroName.toLowerCase()}.jpg`;
  };
  
  const heroImagePath = getHeroImagePath(heroName);
  
  return (
    <div className="w-24 h-24 bg-amber-800/20 border border-amber-700/30 rounded-lg overflow-hidden flex-shrink-0">
      <img 
        src={heroImagePath}
        alt={heroName}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.log(`Error loading image for hero: ${heroName}, tried path: ${heroImagePath}`);
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML += '<div class="flex items-center justify-center w-full h-full text-amber-600/60 font-rune text-lg">No Image</div>';
        }}
      />
    </div>
  );
};
