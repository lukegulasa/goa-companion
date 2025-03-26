
import React from 'react';

interface HeroModalAdditionalInfoProps {
  abilities?: string[];
  playstyle?: string;
  synergies?: string[];
}

export const HeroModalAdditionalInfo: React.FC<HeroModalAdditionalInfoProps> = ({ 
  abilities, 
  playstyle, 
  synergies 
}) => {
  if (!abilities && !playstyle && !synergies) return null;
  
  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Additional Information
      </h3>
      
      {abilities && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Abilities</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {abilities.map((ability, index) => (
              <li key={index}>{ability}</li>
            ))}
          </ul>
        </div>
      )}
      
      {playstyle && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Playstyle</h4>
          <p className="text-sm">{playstyle}</p>
        </div>
      )}
      
      {synergies && (
        <div>
          <h4 className="text-sm font-medium mb-1">Synergies</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {synergies.map((synergy, index) => (
              <li key={index}>{synergy}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
