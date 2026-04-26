import HeroSection from './components/sections/HeroSection';
import StickyNav from './components/layout/StickyNav';
import StatsSection from './components/sections/StatsSection';
import IngestionSection from './components/sections/IngestionSection';
import RadarSection from './components/sections/RadarSection';
import LegalSection from './components/sections/LegalSection';
import ExplorerSection from './components/sections/ExplorerSection';
// MAKE SURE THIS IMPORT IS HERE
import Footer from './components/layout/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <StickyNav />
      <HeroSection />
      <StatsSection />
      <IngestionSection />
      <RadarSection />
      <LegalSection />
      <ExplorerSection />
      {/* MAKE SURE THIS COMPONENT IS MOUNTED HERE */}
      <Footer />
    </div>
  );
}