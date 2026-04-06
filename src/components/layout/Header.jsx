import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PORTFOLIO', path: '/portfolio' },
    { name: 'SERVIÇOS', path: '/servicos' },
    { name: 'SOBRE', path: '/sobre-contato' },
    { name: 'CONTATO', path: '/sobre-contato' },
  ];

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl shadow-2xl shadow-black/40">
        <div className="flex justify-between items-center px-6 xl:px-12 py-6 max-w-screen-2xl mx-auto">
          <Link
            to="/"
            className="text-xl font-serif tracking-tighter text-[#e5e2e1] flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
          >
            <img
              alt="Estúdio Almeida Logo"
              className="h-8 w-8 object-contain"
              src="/minha-logo.png"
            />
            <span className="hidden sm:inline">Estúdio Almeida</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-8 nav-link-gap">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`transition-colors text-[0.7rem] font-label font-bold tracking-widest ${
                  location.pathname === link.path ? 'text-[#f2ca50]' : 'text-[#e5e2e1] hover:text-[#f2ca50]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            <Link
              to="/login"
              className="bg-transparent text-white px-4 py-2.5 text-[0.7rem] font-label font-extrabold tracking-widest hover:text-primary transition-colors duration-300 uppercase"
            >
              LOGIN
            </Link>
            <Link
              to="/cadastro"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2.5 text-[0.7rem] font-label font-extrabold tracking-widest rounded-md hover:scale-105 transition-transform duration-300 uppercase"
            >
              CADASTRO
            </Link>
          </div>

          {/* Hamburger Button (Mobile & Small Laptops) */}
          <button
            onClick={() => setIsOpen(true)}
            className="xl:hidden text-[#f2ca50] hover:text-white transition-colors cursor-pointer"
          >
            <Menu size={32} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#131313]/95 backdrop-blur-2xl flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-[#e5e2e1] hover:text-[#f2ca50] transition-colors cursor-pointer pt-2 pr-2"
            >
              <X size={40} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={handleLinkClick}
                  className="mobile-link text-2xl font-label font-bold tracking-widest text-[#e5e2e1] hover:text-[#f2ca50] uppercase"
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px w-24 bg-white/20 my-4"></div>

              <Link
                to="/login"
                onClick={handleLinkClick}
                className="mobile-link text-lg font-label font-bold tracking-widest text-white hover:text-[#f2ca50] uppercase"
              >
                Login
              </Link>
              <Link
                to="/cadastro"
                onClick={handleLinkClick}
                className="mobile-link bg-gradient-to-r from-[#f2ca50] to-[#d4af37] text-[#3c2f00] px-8 py-3 rounded text-lg font-label font-bold tracking-widest uppercase"
              >
                Cadastro
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
