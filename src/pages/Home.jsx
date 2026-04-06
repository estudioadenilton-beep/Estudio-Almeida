import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, AudioLines, Mail, MapPin, ArrowRight } from 'lucide-react';
import SEO from '../components/shared/SEO';
import HeroSlider from '../components/shared/HeroSlider';
import ScrollReveal from '../components/shared/ScrollReveal';
import BentoCard from '../components/shared/BentoCard';

const Home = () => {
  return (
    <>
      <SEO
        title="Excelência em Voz e Produção Audiovisual"
        description="Transformamos ideias em voz com voice-overs premium e sound design de alto nível para marcas globais."
        canonical="/"
      />

      {/* Hero Section */}
      <HeroSlider />

      {/* Diferencial Section */}
      <section className="py-32 bg-surface text-on-surface overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <ScrollReveal direction="left">
              <span className="text-primary text-[0.6875rem] font-label font-bold tracking-[0.2em] mb-4 block uppercase">
                Por que nós?
              </span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 uppercase tracking-tighter">Nosso Diferencial</h2>
              <p className="text-secondary font-body leading-relaxed mb-12 max-w-lg">
                Na Estúdio Almeida, a qualidade não é negociável. Combinamos tecnologia de ponta com a sensibilidade
                artística necessária para capturar a essência de cada projeto.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-surface-container-high rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                    <Mic2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Voice-over Premium</h4>
                    <p className="text-sm text-secondary leading-relaxed">
                      Locutores profissionais selecionados para transmitir a autoridade e emoção da sua marca.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-surface-container-high rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                    <AudioLines size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Sound Design Imersivo</h4>
                    <p className="text-sm text-secondary leading-relaxed">
                      Tratamento acústico e paisagens sonoras desenhadas sob medida para narrativas cinematográficas.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <img
                  className="w-full aspect-[3/4] object-cover rounded shadow-2xl"
                  alt="Mixagem Profissional Estúdio Almeida"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJlYcLqGeGPN9pdZQraeZg7jwxR-Uo7DK9LYg86eZ6DHZtluUbguXLPU2KXFW_bjLYW6AYTZ4QWvj4tVkNLcuWCXXLF5HCNL4TlkbFy-JlDyktQ_5ZMnIj_XdpIk2LH2Hy3qc0DdlgCh6NkpgWeoggctMdzZVTeL44700B7qEso5kUrDV5IuZxDZ58660Sy4rUq6Ygo6T3yUkGhKS6TY16ldc6IshXKQ3_-EpfZc28rz_nBMalWuQKzfVbUpJmTthDtkUxyoDdBtU"
                />
                <div className="bg-primary-container p-8 rounded">
                  <span className="text-4xl font-serif font-bold text-on-primary-container block mb-2">15+</span>
                  <span className="text-[0.6875rem] font-label font-bold tracking-widest text-on-primary-container uppercase">
                    Anos de Experiência
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-container-highest p-8 rounded">
                  <span className="text-4xl font-serif font-bold text-primary block mb-2">500+</span>
                  <span className="text-[0.6875rem] font-label font-bold tracking-widest text-secondary uppercase">
                    Projetos Entregues
                  </span>
                </div>
                <img
                  className="w-full aspect-[3/4] object-cover rounded shadow-2xl"
                  alt="Sound Wave Visualizer Estúdio Almeida"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPxSo-4Ksf7IwGzOsy76Rjkce-CE1iJHwjaH8-SsfJYPOHDZRNk6bKE7M5bT8snNmJdAYg4UwkVqDV9sL6TJ7tZwqCd0W1k3xjNYSkqO5aOGJ7UeiA6YG3EYnyM9NPUWpmLiQcnxH4HLLfYA-F-oso3xo3DhDJUqkf-xT0pRovhu5_lFnc8WKkl5SW-hu23ZmPe_DewJLFnGBG-91MwX_I4T3XQqP_KaeFUXkiazMyFvqwkQ23A_-1IgnJKy0CjmHkHHZCWLiV-g0"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trabalhos Recentes (Bento Grid) */}
      <section className="py-32 bg-surface-container-low text-on-surface" id="portfolio">
        <div className="container mx-auto px-6 md:px-12">
          <ScrollReveal direction="up" className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary text-[0.6875rem] font-label font-bold tracking-[0.2em] mb-4 block uppercase font-bold">
                Excelência em Som
              </span>
              <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter">Trabalhos Recentes</h2>
            </div>
            <Link
              className="text-primary text-xs font-label font-bold tracking-widest hover:translate-x-2 transition-transform duration-300 flex items-center gap-2"
              to="/portfolio"
            >
              VER TODOS OS PROJETOS <ArrowRight size={16} />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
            <BentoCard
              colSpan="md:col-span-8"
              height="h-96 md:h-full"
              subtitle="Campanha Global"
              title="The Sound of Motion"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCo25yhSMBgm4-CS57U04vCHGI0ofPeYlBSXLA0rGsqAOjHKBDW6L1W24IkoAs9Tucwc4ankppX8SWL94lz4Z8g_lUWar-6UhOQsSVdCKz4MgedBJGAShADleoSvPP_BBQ900v-rdAEX3njQK28oyiNmSrpjeUaJbkNNkPmT9pKJxtVmok0XAbk1EtZCTaQh2E1A-Xm9qKuCmWcfoGghWWpUyDgwr01D6SMa1-6lnx5plNotpvmPZX0LAevuy9Nt-F2fbvzVy2eSRA"
              showPlay
              delay={0.1}
            />
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <BentoCard
                colSpan="md:col-span-full"
                height="h-full"
                subtitle="Podcast Production"
                title="Diálogos Criativos"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCrfHNXNGDS3QJ41FQwdVIgqR8OQt96xPKoDospYYtn27r48Litj5IauogTKDCK3j1IzJH-oaUsg1ihbZUS0mrSq8YMOnys551GUTls65pDB9pBgIIozpCJMP0ksao2RuweIYaXr5EVVyD701loDgzMjY_0T7vFMG_La1zdnybn2z4UHxRFzqGIHmeUCXC1727SHOHrCFwiT5EpDwoW1EhwdBFvsU9iJtIAZ4wTDDu-k32K1QFrFpiYmCuyKvd6boK21i27z99eWIU"
                delay={0.2}
              />
              <BentoCard
                colSpan="md:col-span-full"
                height="h-full"
                subtitle="Audio Branding"
                title="Sonic Identity System"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDsnnuCx_jWKWHpBCuljKDaPG57N6vdr4Z5nxDOnuTKUOfWZEDDNH-U4U0fGFuFGd9o-MWBfxmJ2293Ct11Z7dQULUNGwX05pS_3Zd3O4UWogNmqMYYflU9Iw9Dn7oKPg77WVQe0Y0xgiSTUt32pkEtfZE-0JRxqIdOdPScJ1iLl727GwekqwuP6Z79QiHIVUKGvqUIbxMSdem7AJpF442VGShkFPc9xRIELrzIvgWPeF9nCqpFxAVFpzlG90XOT1BowyQneDgZZv4"
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section className="py-24 md:py-32 bg-surface text-on-surface">
        <div className="container mx-auto px-6 md:px-12">
          <ScrollReveal direction="up" className="bg-surface-container-low border border-white/5 backdrop-blur-xl rounded-xl p-8 md:p-16 xl:p-20 grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 items-center shadow-2xl">
            <div className="text-center xl:text-left">
              <h2 className="text-responsive-h2 font-serif mb-8 italic uppercase tracking-tighter leading-tight">
                VAMOS CRIAR ALGO <br className="hidden xl:block" />
                <span className="text-primary not-italic font-bold">EXTRAORDINÁRIO?</span>
              </h2>
              <p className="text-secondary mb-12 max-w-sm mx-auto xl:mx-0">
                Entre em contato para discutir seu próximo projeto de voz ou produção criativa.
              </p>
              <div className="space-y-6 flex flex-col items-center xl:items-start">
                <div className="flex items-center gap-4 text-on-surface">
                  <Mail className="text-primary" />
                  <span className="text-base md:text-lg font-body">contato@estudioalmeida.com</span>
                </div>
                <div className="flex items-center gap-4 text-on-surface">
                  <MapPin className="text-primary" />
                  <span className="text-base md:text-lg font-body">São Paulo, Brasil</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-xs mx-auto">
              <Link
                to="/cadastro"
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 text-xs font-label font-extrabold tracking-widest rounded hover:shadow-xl hover:shadow-primary/20 transition-all uppercase block text-center"
              >
                Cadastre-se
              </Link>
              <Link
                to="/login"
                className="w-full bg-transparent text-white py-4 text-xs font-label font-extrabold tracking-widest rounded transition-all hover:text-primary uppercase block text-center"
              >
                Login
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default Home;
