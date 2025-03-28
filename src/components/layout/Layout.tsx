
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Decorative header with modern style */}
      <header className="w-full border-b border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container max-w-6xl mx-auto py-4 px-4 sm:px-6">
          <Navigation />
        </div>
      </header>
      
      <main className="flex-1 pt-6 sm:pt-8 relative z-10 container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5 z-0"></div>
        
        {children}
      </main>
      
      {/* Footer with modern pattern */}
      <footer className="mt-8 py-6 border-t border-primary/20 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <div className="flex justify-center space-x-2 mb-2">
            <div className="w-8 h-0.5 bg-primary/50"></div>
            <div className="w-2 h-0.5 bg-primary/50"></div>
            <div className="w-4 h-0.5 bg-primary/50"></div>
          </div>
          <p className="font-heading text-sm">GoA Companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
