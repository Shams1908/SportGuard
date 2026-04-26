import { useState } from 'react';
import HeroSection from './components/sections/HeroSection';
import StickyNav from './components/layout/StickyNav';
import StatsSection from './components/sections/StatsSection';
import IngestionSection from './components/sections/IngestionSection';
import RadarSection from './components/sections/RadarSection';
import LegalSection from './components/sections/LegalSection';
import ExplorerSection from './components/sections/ExplorerSection';
import Footer from './components/layout/Footer';

export default function App() {
  const [strikeURL, setStrikeURL] = useState("https://illegalstream.io/sports/clips/ufc_r45");

  const handleTriggerStrike = (url) => {
    setStrikeURL(url);
    document.getElementById("legal")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative">
      {/* THE NEW CRT SCAN BAR */}
      <div className="scan-bar" />

      <StickyNav />
      <HeroSection />
      <StatsSection />
      <IngestionSection />
      <RadarSection onTriggerStrike={handleTriggerStrike} />
      <LegalSection externalTarget={strikeURL} />
      <ExplorerSection />
      <Footer />
    </div>
  );
}