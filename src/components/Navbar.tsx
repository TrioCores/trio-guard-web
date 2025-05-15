
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 shadow-sm backdrop-blur-sm z-50">
      <div className="container-custom flex items-center justify-between py-4">
        <a href="#" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-trioguard-dark hover:text-trioguard transition-colors">Features</a>
          <a href="#how-it-works" className="text-trioguard-dark hover:text-trioguard transition-colors">How it works</a>
          <a href="#faq" className="text-trioguard-dark hover:text-trioguard transition-colors">FAQ</a>
          <a href="#changelog" className="text-trioguard-dark hover:text-trioguard transition-colors">Changelog</a>
          <a href="https://discord.gg/trioguard" target="_blank" rel="noopener noreferrer" className="btn-secondary">Support</a>
          <a href="#invite" className="btn-primary">
            Invite Bot
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-trioguard-dark" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <a href="#features" className="text-trioguard-dark hover:text-trioguard transition-colors py-2" onClick={toggleMenu}>Features</a>
            <a href="#how-it-works" className="text-trioguard-dark hover:text-trioguard transition-colors py-2" onClick={toggleMenu}>How it works</a>
            <a href="#faq" className="text-trioguard-dark hover:text-trioguard transition-colors py-2" onClick={toggleMenu}>FAQ</a>
            <a href="#changelog" className="text-trioguard-dark hover:text-trioguard transition-colors py-2" onClick={toggleMenu}>Changelog</a>
            <a href="https://discord.gg/trioguard" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full text-center" onClick={toggleMenu}>Support</a>
            <a href="#invite" className="btn-primary w-full text-center" onClick={toggleMenu}>Invite Bot</a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
