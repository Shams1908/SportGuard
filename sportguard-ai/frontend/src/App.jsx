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
  // 1. Initialize as 'null' so the terminal waits for a command
  const [strikeData, setStrikeData] = useState(null);

  const handleTriggerStrike = (data) => {
    setStrikeData(data);
    // Note: LegalSection also has an auto-scroll, but having it here acts as a great backup!
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

      {/* 2. Radar passes the URL up when STRIKE is clicked */}
      <RadarSection onTriggerStrike={handleTriggerStrike} />

      {/* 3. Pass it down using the 'target' prop to match LegalSection.jsx */}
      <LegalSection target={strikeData} />

      <ExplorerSection />
      <Footer />
    </div>
  );
}