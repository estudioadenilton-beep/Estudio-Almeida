import React from 'react';
import { Phone, Mail, MapPin, Camera, Play, Music2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/shared/SEO';
import ScrollReveal from '../components/shared/ScrollReveal';

const AboutContact = () => {
  return (
    <>
      <SEO
        title="Sobre e Contato"
        description="Conheça nossa história e entre em contato para dar voz ao seu próximo grande projeto extraordinário. Excelência criativa baseada no Brasil para o mundo."
        canonical="/sobre-contato"
      />

      <main className="pt-24 bg-background overflow-hidden">
        {/* Hero Section */}
        <header className="px-6 md:px-12 py-32 max-w-screen-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row items-baseline gap-4 mb-12">
              <span className="font-label text-[0.6875rem] text-primary tracking-[0.2em] uppercase font-bold">
                Excelência Criativa
              </span>
              <h1 className="font-headline text-5xl md:text-8xl tracking-tight leading-none text-white uppercase tracking-tighter">
                SOBRE NÓS & <br className="md:hidden" /> CONTATO
              </h1>
            </div>
            <div className="w-24 h-1 bg-primary" />
          </ScrollReveal>
        </header>

        {/* Section: SOBRE NÓS (Light Contrast Style) */}
        <section className="bg-secondary-fixed text-inverse-on-surface py-32 px-6 md:px-12 relative">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal direction="left">
                <div className="aspect-[4/5] overflow-hidden rounded-sm editorial-shadow">
                  <img
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                    alt="Editorial Estúdio Almeida - Nossa História"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYZA14C8Yp1e3CcqJRBiaZcB8uKxWuWoDGKlT8BxOZdYQUxJ2yRTrRDBDKE1qc1sycqVtaZDO8_5ZK8uAEeRXJ7ay8ppgXu1cVhO-wMe9026nYPKKrTbAaCe9kXd-UCwoOEeZ07nP9ylZJMZAZKQ0-hmMuOuKgyYQjRZgIjNHOPnTRk7mPF5avRDk92QG_paqpXeVRtS6EeJpmjeFHEaoWBmG7UFOiMuOyRbkBp9ZjZWO34yzgg2239tm1GxnjFJUatJdE7EJfBRA"
                  />
                </div>
                {/* Asymmetric Numbering */}
                <div className="absolute -bottom-12 -right-8 pointer-events-none">
                  <span className="font-headline text-[12rem] leading-none text-primary/20 select-none">01</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 lg:pl-16">
              <ScrollReveal direction="right">
                <span className="font-label text-[0.6875rem] text-primary-container tracking-widest uppercase mb-4 block font-bold">
                  Nossa História
                </span>
                <h2 className="font-headline text-4xl md:text-5xl mb-8 leading-tight uppercase tracking-tighter">
                  Onde a voz encontra sua forma mais pura.
                </h2>
                <div className="font-body text-lg leading-relaxed space-y-6 opacity-90 max-w-2xl">
                  <p>
                    No Estúdio Almeida, acreditamos que cada palavra carrega um universo de intenções. Fundado com o propósito de elevar a produção de áudio ao status de arte, nossa jornada começou na intersecção entre a técnica rigorosa e a sensibilidade artística.
                  </p>
                  <p>
                    Nossa missão é transformar roteiros em experiências auditivas imersivas. Seja para grandes marcas globais ou narrativas independentes, aplicamos a mesma filosofia: a busca incessante pela clareza, emoção e autoridade sonora.
                  </p>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-12">
                  <div>
                    <h4 className="font-label font-bold text-primary-container mb-2 uppercase text-xs tracking-widest">A Equipe</h4>
                    <p className="font-body text-sm text-on-surface/70">
                      Um coletivo de engenheiros de som, diretores criativos e locutores premiados unidos pela excelência.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-label font-bold text-primary-container mb-2 uppercase text-xs tracking-widest">O Espaço</h4>
                    <p className="font-body text-sm text-on-surface/70">
                      Acústica de classe mundial projetada para capturar as nuances mais sutis da performance humana.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Section: CONTATO (Dark Contrast) */}
        <section className="bg-surface py-32 px-6 md:px-12" id="contato">
          <div className="max-w-screen-2xl mx-auto">
            <ScrollReveal direction="up" className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
              <span className="font-label text-[0.6875rem] text-primary tracking-widest uppercase mb-6 block font-bold">
                Fale Conosco
              </span>
              <h2 className="font-headline text-4xl md:text-5xl mb-8 uppercase tracking-tighter text-white">
                Vamos criar algo extraordinário.
              </h2>
              <p className="font-body text-secondary mb-12 max-w-xl">
                Estamos prontos para ouvir o seu projeto e dar vida à sua visão criativa através da excelência sonora.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:max-w-md mt-8">
                <Link
                  to="/cadastro"
                  className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 text-xs font-label font-extrabold tracking-widest rounded hover:shadow-xl hover:shadow-primary/20 transition-all uppercase block text-center"
                >
                  CADASTRE-SE
                </Link>
                <Link
                  to="/login"
                  className="flex-1 bg-transparent text-white py-4 text-xs font-label font-extrabold tracking-widest rounded transition-all hover:text-primary uppercase border border-white/5 block text-center"
                >
                  LOGIN
                </Link>
              </div>
            </ScrollReveal>

            {/* Horizontal Contact Info */}
            <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
              <ScrollReveal direction="up" delay={0.1} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <Phone size={20} />
                </div>
                <div className="text-left">
                  <span className="font-label text-[0.6rem] uppercase tracking-widest text-primary/60 block mb-1">Telefone</span>
                  <p className="font-body text-lg text-white">+55 (11) 98765-4321</p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <Mail size={20} />
                </div>
                <div className="text-left">
                  <span className="font-label text-[0.6rem] uppercase tracking-widest text-primary/60 block mb-1">E-mail</span>
                  <p className="font-body text-lg text-white">contato@estudioalmeida.com</p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <span className="font-label text-[0.6rem] uppercase tracking-widest text-primary/60 block mb-1">Localização</span>
                  <p className="font-body text-sm text-white">Rua Leonildes Zacarias de Oliveira, Sergipe - SE</p>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutContact;
