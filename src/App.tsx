import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Showroom from './components/Showroom';
import SpecsBento from './components/SpecsBento';
import TyreTransmission from './components/TyreTransmission';
import AcousticExperience from './components/AcousticExperience';
import BespokeStudio from './components/BespokeStudio';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

// Define the exact generated high-quality assets
import HERO_CAR_IMAGE from './assets/images/superwheel_profile_1779331446532.png';
import INTERIOR_IMAGE from './assets/images/superwheel_interior_1779329709108.png';
import WHEEL_DETAIL_IMAGE from './assets/images/superwheel_wheel_detail_1779329729121.png';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPreselectedCar, setModalPreselectedCar] = useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync body theme classes for smooth full-page light/dark mode transition overrides
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Trigger modal overlay with corresponding active model context
  const triggerAllocationRequest = (carName?: string) => {
    setModalPreselectedCar(carName);
    setIsModalOpen(true);
  };

  const handleBespokeSubmission = (selectedOptionNames: string[], totalPrice: number) => {
    console.log('Bespoke allocation filed with items:', selectedOptionNames, 'Total price:', totalPrice);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen antialiased selection:bg-orange-500 selection:text-white transition-colors duration-500 ${
      isDarkMode ? 'text-neutral-100 bg-[#030303]' : 'text-neutral-900 bg-[#f4f5f7]'
    }`}>
      {/* Structural Headers */}
      <Header 
        onContactClick={() => triggerAllocationRequest()} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Core View Modules */}
      <main>
        {/* Module 1: Hero view with stagger typography */}
        <HeroSection 
          onExploreClick={() => scrollToSection('showroom')}
          onAcousticClick={() => scrollToSection('acoustic')}
          heroImg={HERO_CAR_IMAGE}
          isDarkMode={isDarkMode}
        />

        {/* Module 2: Interactive Showcase Showroom list */}
        <Showroom 
          onContactClick={(carName) => triggerAllocationRequest(carName)} 
          heroImg={HERO_CAR_IMAGE}
          interiorImg={INTERIOR_IMAGE}
          wheelImg={WHEEL_DETAIL_IMAGE}
          isDarkMode={isDarkMode}
        />

        {/* Module 3: Micro-detailed telemetry metrics bento layout */}
        <SpecsBento 
          interiorImg={INTERIOR_IMAGE}
          wheelImg={WHEEL_DETAIL_IMAGE}
          isDarkMode={isDarkMode}
        />

        {/* Module 4: Live Scrolling Tyre & Transmission physics simulation */}
        <TyreTransmission isDarkMode={isDarkMode} />

        {/* Module 5: Live V12 audio acoustic synthesizer workbench */}
        <AcousticExperience />

        {/* Module 5: Custom carbon chassis builder form summary */}
        <BespokeStudio onFormSubmit={handleBespokeSubmission} />
      </main>

      {/* Modern footer with specs metadata coordinates */}
      <Footer />

      {/* Pop-up secure application overlays */}
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedCar={modalPreselectedCar}
      />
    </div>
  );
}
