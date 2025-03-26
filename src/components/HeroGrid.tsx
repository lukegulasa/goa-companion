
import React, { useEffect, useRef } from 'react';
import { useGallery } from '@/context/GalleryContext';
import HeroCard from './HeroCard';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroGrid: React.FC = () => {
  const { filteredHeroes, selectHero } = useGallery();
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Apply staggered animation to cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div ref={gridRef} className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {filteredHeroes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
            No heroes match your filters
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your filter criteria
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredHeroes.map((hero) => (
            <motion.div key={hero.id} variants={item}>
              <HeroCard 
                hero={hero} 
                onClick={() => selectHero(hero)} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default HeroGrid;
