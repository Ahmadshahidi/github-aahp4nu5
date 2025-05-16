import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeatureSection from '../components/home/FeatureSection';
import CTASection from '../components/home/CTASection';

const Home: React.FC = () => {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeatureSection />
      <CTASection />
    </main>
  );
};

export default Home;