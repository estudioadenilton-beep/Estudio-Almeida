import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS8j8mQkpkUdoH6ElRavZE-C5Q74wG12jCKR5lD0Jbhcdyh5RykP3FEelXYgnRZpkytF7VZ7ubra_GqbOS4FWcfxPTxSXXlz_Ixb8SM1Q-3gk1X0zkA7BfqL9LvsgLyj0RsFCL7S0sgmJnC7NdQGwIKKF-BcBexxAcDDv4mEzdyHccfG6nzYBZTfSJAZiRLncXw26iylbQ3S3hoOyCK1fo5AwiWj2U_BplCSvOo9bHrPI3-untyKn6WX8VHPqhMYK3GUjTtiGSJkQ',
    label: 'CREATIVE PRODUCTION & VOICE-OVER',
    title: 'IDEIAS QUE',
    titleAccent: 'GANHAM VOZ',
    description: 'Seu parceiro de excelência em produção criativa e voice-over de alto nível. Transformamos narrativas em experiências sonoras memoráveis.'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJlYcLqGeGPN9pdZQraeZg7jwxR-Uo7DK9LYg86eZ6DHZtluUbguXLPU2KXFW_bjLYW6AYTZ4QWvj4tVkNLcuWCXXLF5HCNL4TlkbFy-JlDyktQ_5ZMnIj_XdpIk2LH2Hy3qc0DdlgCh6NkpgWeoggctMdzZVTeL44700B7qEso5kUrDV5IuZxDZ58660Sy4rUq6Ygo6T3yUkGhKS6TY16ldc6IshXKQ3_-EpfZc28rz_nBMalWuQKzfVbUpJmTthDtkUxyoDdBtU',
    label: 'HIGH-END AUDIO GEAR',
    title: 'SOM QUE',
    titleAccent: 'IMPULSIONA',
    description: 'Equipamentos de ponta e sound design imersivo para narrativas cinematográficas de alto impacto.'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPxSo-4Ksf7IwGzOsy76Rjkce-CE1iJHwjaH8-SsfJYPOHDZRNk6bKE7M5bT8snNmJdAYg4UwkVqDV9sL6TJ7tZwqCd0W1k3xjNYSkqO5aOGJ7UeiA6YG3EYnyM9NPUWpmLiQcnxH4HLLfYA-F-oso3xo3DhDJUqkf-xT0pRovhu5_lFnc8WKkl5SW-hu23ZmPe_DewJLFnGBG-91MwX_I4T3XQqP_KaeFUXkiazMyFvqwkQ23A_-1IgnJKy0CjmHkHHZCWLiV-g0',
    label: 'GLOBAL CREATIVE SERVICES',
    title: 'EXCELÊNCIA',
    titleAccent: 'EM CADA BIT',
    description: 'Transformamos conceitos abstratos em experiências auditivas memoráveis e de prestígio global.'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-screen min-h-[100svh] overflow-hidden bg-black group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Ken Burns */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-ken-burns will-change-transform"
            style={{ backgroundImage: `url('${slides[current].image}')` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="container mx-auto px-6 lg:px-12 relative min-h-screen min-h-[100svh] flex flex-col justify-center items-center lg:items-start text-center lg:text-left z-20">
            <div className="max-w-4xl pt-12 md:pt-20">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block text-[#f2ca50] text-[0.6875rem] font-label font-bold tracking-[0.2em] mb-6 border-l-2 lg:border-l-0 lg:border-b-2 border-[#f2ca50] pl-4 lg:pl-0 lg:pb-2 text-shadow-premium"
              >
                {slides[current].label}
              </motion.span>
              
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-8xl font-serif font-bold leading-tight tracking-tight mb-8 text-white text-shadow-premium"
              >
                {slides[current].title} <br /> 
                <span className="italic text-[#f2ca50]">{slides[current].titleAccent}</span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-300 text-base md:text-lg lg:text-xl font-body font-light max-w-xl mb-12 leading-relaxed text-shadow-premium"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
              >
                <Link
                  to="/servicos"
                  className="bg-[#f2ca50] text-black px-8 py-4 text-xs font-label font-extrabold tracking-widest rounded flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                >
                  EXPLORE NOSSOS SERVIÇOS <ArrowRight size={16} />
                </Link>
                <Link
                  to="/portfolio"
                  className="border border-white/20 text-white px-8 py-4 text-xs font-label font-extrabold tracking-widest rounded hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  PORTFÓLIO
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#f2ca50] hover:text-black hover:border-[#f2ca50] transition-all pointer-events-auto cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#f2ca50] hover:text-black hover:border-[#f2ca50] transition-all pointer-events-auto cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators (Dots) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-12 h-1 rounded-full transition-all duration-500 cursor-pointer ${
              current === index ? 'bg-[#f2ca50]' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
