
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    number: "01",
    title: "Invite TrioGuard",
    description: "Add TrioGuard to your Discord server using our invite link with pre-configured permissions.",
  },
  {
    number: "02",
    title: "Configure Settings",
    description: "Receive a DM with a link to the dashboard where you can customize TrioGuard for your server's needs.",
  },
  {
    number: "03",
    title: "Let TrioGuard Work",
    description: "Once configured, TrioGuard will automatically moderate your server and keep it safe for all members.",
  }
];

const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  
  return (
    <section id="how-it-works" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-trioguard-dark/80">
            Getting started with TrioGuard is simple and takes just a few minutes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-1/2 w-3/4 h-0.5 bg-gradient-to-r from-trioguard/20 via-trioguard to-trioguard/20 -translate-x-1/2"></div>
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10 transition-all duration-300 transform ${
                hoveredStep === index ? 'scale-105 shadow-lg border-trioguard/30' : ''
              } animate-fade-in-up`}
              style={{ animationDelay: `${0.1 * index}s` }}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className={`transition-colors duration-300 ${
                hoveredStep === index ? 'bg-trioguard-dark' : 'bg-trioguard'
              } text-white text-xl font-bold w-12 h-12 flex items-center justify-center rounded-full mb-6`}>
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-trioguard-dark/80">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a href="#invite" className="btn-primary inline-flex items-center hover:scale-105 transition-transform duration-300">
            <span>Get Started Now</span>
            <ArrowRight size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
