
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Layout from '@/components/layout/Layout';
import Index from './pages/Index'; // Changed from './pages' to './pages/Index'
import DraftPage from './pages/DraftPage';
import NotFound from './pages/NotFound';
import HeroModal from '@/components/HeroModal';
import GameStats from './pages/GameStats';
import { GalleryProvider } from '@/context/GalleryContext';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ThemeProvider defaultTheme="system" storageKey="goa-theme">
        <Toaster />
        <GalleryProvider>
          <HeroModal />
        </GalleryProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/draft" element={<DraftPage />} />
              <Route path="/game-stats" element={<GameStats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
