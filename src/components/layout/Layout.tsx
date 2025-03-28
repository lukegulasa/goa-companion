
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Decorative header with ancient/tribal style */}
      <header className="w-full border-b border-amber-800/30 bg-gradient-to-r from-amber-900/10 via-amber-800/5 to-amber-900/10">
        <div className="container max-w-6xl mx-auto py-4 px-4 sm:px-6">
          <Navigation />
        </div>
      </header>
      
      <main className="flex-1 pt-6 sm:pt-8 relative z-10 container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Tribal pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5 z-0"></div>
        
        {children}
      </main>
      
      {/* Footer with tribal pattern */}
      <footer className="mt-8 py-6 border-t border-amber-800/20 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-8 h-0.5 bg-amber-700/50"></div>
            <div className="w-2 h-0.5 bg-amber-700/50"></div>
            <div className="w-4 h-0.5 bg-amber-700/50"></div>
          </div>
          <p>GoA Companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
