import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/shared/SEO';
import ScrollReveal from '../components/shared/ScrollReveal';
import BentoCard from '../components/shared/BentoCard';

const projects = [
  {
    id: 1,
    title: 'Narrativas de Inverno',
    subtitle: 'Voice-Over Principal',
    client: 'National Geographic',
    category: 'VOICE-OVER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWKvvqHhLz_kQACNRlZN6mN2llVmAHjGqw5xFKgF3L5kWx2Y1ujG4_Z__WrxMlrOW8tKW6X8Fy6coj5bdOrGPauWlGAGY7c9qfgSbQXhHRzZImEyzCyDoicZVMAmlUhWCPGqDg5vvsGo61n2Pjn7eFB73jdzh6Xugmufre51-CYcYO_D5Oljl9aw1IUPLo0H_LJup3cHpmWrqnAczVKLxfIBGi687ADRssVnCYgqvLWw-PBeAOKK7vWGlIrFxR5EtNBOLpTXChw-0',
    colSpan: 'md:col-span-8',
    height: 'h-[600px]',
    showPlay: true
  },
  {
    id: 2,
    title: 'O Som da Pureza',
    subtitle: 'Comercial TV',
    client: 'Lexus Brasil',
    category: 'COMERCIAIS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANWu67aE94xzMzxbnt0-BISUH3zIWE52hkAzTcHwFSQpYpMWwXhrRUQ2rSGS6jcgfKBWDSFDvR4NlpdfrJvvAGQBJW9ko2_38Op11NCsTSWT5Tpb45WZHO-FMT_K3g6XgQxzW1F9mAX8yhLx7TmX4M42bjXG5JdgxsRWIdDEa-egPybc5YIzF4CQcA6_NkupuO8FU1jWOr3w5yY0M0tNt6M9RcqHyvWOLPNlFR5yEua2A3HGiHfz3jKqSPegtJA__Khsts7Rlqi4I',
    colSpan: 'md:col-span-4',
    height: 'h-[600px]'
  },
  {
    id: 3,
    title: 'Amazônia Viva',
    subtitle: 'Documentário',
    client: 'Greenpeace',
    category: 'DOCUMENTÁRIOS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ9s9ip3udFYahVoSveyasCNVor4XGVZMTupivTuqqCTZKG7oHBqfZqtW_G9XNtbqsor9m_ScDYxrD7Q2bekH6ppR-2Poy2wlzWYwzf5ONsLRQIGCsxeYQdP_urQe8fmlTXA5zI-p87GPvEz_OADDO9CDLuDu9MqxckhLC2Wl8XbYA591QZhuBhfxfz73lZNZfUXo2K2uy2o0iZ7UnN6howF3BYEjVjHKQQfYgQez1AaRmRkLc56DGhBvlomhSBjhHgcgATtUPP4Y',
    colSpan: 'md:col-span-4'
  },
  {
    id: 4,
    title: 'Heritage Symphony',
    subtitle: 'Identidade Sonora',
    client: 'Steinway & Sons',
    category: 'COMERCIAIS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDKek0kqtPhs3vaFzFxiN2A01V5l0mL0Abti6Hfn4I2AsfZ8t6dVwenxXigPKlHr42JEvDX-EKnW7zz8MVLLtSSjZGmkbsdhI-hMt_EuGy9GxfgSAlvToePpOY9K4jtSjkE9v8mv4leq6r3Wh_uGjjysTP7A8Y5q-3HHyk33cLAqOzEmxlej2GHsBJabj4m2Gkunzm7QRa1PcpCyEtrhaykkpTEPc7d0psjMFG2RbikkD5z2pzJLV1dAaqPYVjtGpoyvVxRgdK2Tw',
    colSpan: 'md:col-span-4'
  },
  {
    id: 5,
    title: 'Mentes Criativas',
    subtitle: 'Podcast',
    client: 'Spotify Studios',
    category: 'VOICE-OVER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjDe9SZtQC-8S2UxoHhkXIkV-pVyGQWmP3nKTD4nf85T4QrALALjNuSMTEU-JM1E_hXc7FvwHvOWTNpGIfKJKZ6YOyWjY9DjqhQatcAxUdcu4Or-OI3c351IuZP0BB018KUE_tcu6KpT1x5iUDhg2Pv78Wy-jSHqmsTXhno9JeSgJ26xmZrUwI3Q1n9hfXmwe5MlWayo7jMtxMAh-UDnwaws0gYQ-UqEH-VTJo6KxMqPTFYTdxc9n8nEyyAeSaSfH8RwW8vFWdivs',
    colSpan: 'md:col-span-4'
  }
];

const Portfolio = () => {
  const [filter, setFilter] = useState('TODOS');
  const categories = ['TODOS', 'VOICE-OVER', 'DOCUMENTÁRIOS', 'COMERCIAIS'];

  const filteredProjects = filter === 'TODOS' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      <SEO 
        title="Nosso Portfólio" 
        description="Confira nossos trabalhos recentes em voice-over, documentários e comerciais para marcas visionárias. Excelência sonora que transforma produções."
        canonical="/portfolio"
      />

      <main className="pt-32 pb-24 bg-background">
        {/* Header Section */}
        <header className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-20">
          <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-primary font-label text-[0.6875rem] uppercase tracking-[0.2em] mb-4 block font-bold">
                EXCELÊNCIA EM VOZ & SOM
              </span>
              <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight text-white uppercase tracking-tighter">
                NOSSOS TRABALHOS
              </h1>
            </div>
            {/* Audio Wave Visualizer Placeholder */}
            <div className="flex items-end gap-1.5 h-12 mb-2">
              {[...Array(6)].map((_, i) => (
                <motion.span 
                  key={i}
                  animate={{ height: [10, 40, 15, 35, 20] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1 + i * 0.2, 
                    ease: "easeInOut" 
                  }}
                  className="w-1.5 bg-primary rounded-full"
                />
              ))}
            </div>
          </ScrollReveal>
        </header>

        {/* Categories Filter */}
        <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16">
          <ScrollReveal direction="up" delay={0.2} className="flex flex-wrap gap-8 items-center border-b border-white/5 pb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-label text-xs font-bold tracking-widest transition-all pb-1 border-b-2 uppercase ${
                  filter === cat ? 'text-primary border-primary' : 'text-secondary border-transparent hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </ScrollReveal>
        </section>

        {/* Portfolio Bento Grid */}
        <section className="px-6 md:px-12 max-w-screen-2xl mx-auto min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <BentoCard 
                  key={project.id}
                  title={project.title}
                  subtitle={project.subtitle}
                  image={project.image}
                  colSpan={project.colSpan}
                  height={project.height || 'h-[400px]'}
                  showPlay={project.showPlay}
                  delay={index * 0.1}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mt-32 py-24 mb-24 border-y border-white/5 text-center">
          <ScrollReveal direction="up">
            <span className="text-primary font-label text-xs uppercase tracking-[0.3em] mb-6 block font-bold">
              VAMOS CRIAR ALGO ÚNICO?
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-12 max-w-3xl mx-auto leading-tight text-white uppercase tracking-tighter">
              Dê voz à sua visão com a nossa excelência criativa.
            </h2>
            <Link 
              to="/sobre-contato"
              className="inline-flex items-center gap-4 border border-primary text-primary px-10 py-4 rounded-md font-label text-xs font-bold tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-500 mx-auto w-fit uppercase"
            >
              FALE COM UM PRODUTOR
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
};

export default Portfolio;
