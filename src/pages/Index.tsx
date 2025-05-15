
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import FaqSection from "../components/FaqSection";
import ChangelogSection from "../components/ChangelogSection";
import InviteSection from "../components/InviteSection";
import Footer from "../components/Footer";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Smooth scroll functionality for navigation links
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash && target.hash.startsWith('#')) {
        const element = document.querySelector(target.hash);
        if (element) {
          e.preventDefault();
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    // Track scroll position for animation triggers
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    document.addEventListener('click', handleNavClick);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('click', handleNavClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add animation class to elements when they come into view
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-in-up');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run on initial load
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqSection />
        <ChangelogSection />
        <InviteSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
