import type { FC } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import PartnersSection from '../components/sections/PartnersSection';
import ContactSection from '../components/sections/ContactSection';

const HomePage: FC = () => {
  return (
    <div className="page">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PartnersSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;
