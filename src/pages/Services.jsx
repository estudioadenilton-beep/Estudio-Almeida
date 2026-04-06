import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, PenTool, AudioLines, MessageSquare, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/shared/SEO';
import ScrollReveal from '../components/shared/ScrollReveal';

const ServiceItem = ({ title, description, image, index, icon: Icon, reversed = false }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-16 items-center ${reversed ? 'md:flex-row-reverse' : ''}`}>
      <div className={`md:col-span-7 relative group ${reversed ? 'md:order-2' : ''}`}>
        <ScrollReveal direction={reversed ? 'right' : 'left'}>
          <div className="aspect-[16/9] overflow-hidden rounded-sm relative">
            <img 
              alt={title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
              src={image} 
            />
          </div>
          <div className={`absolute -bottom-8 ${reversed ? '-left-8' : '-right-8'} w-48 h-48 bg-surface-container-high p-8 flex flex-col justify-center items-center shadow-2xl transition-transform duration-500 group-hover:scale-105`}>
            <Icon className="text-primary w-12 h-12 mb-2" />
            <span className="font-headline text-3xl text-on-surface">0{index + 1}</span>
          </div>
        </ScrollReveal>
      </div>
      <div className={`md:col-span-5 flex flex-col items-start ${reversed ? 'md:order-1' : ''}`}>
        <ScrollReveal direction={reversed ? 'left' : 'right'}>
          <h2 className="font-headline text-[1.75rem] text-white mb-6 uppercase tracking-tighter transition-colors group-hover:text-primary">
            {title}
          </h2>
          <p className="text-secondary body-md mb-8 leading-relaxed">
            {description}
          </p>
          <Link
            to="/sobre-contato"
            className="border border-primary/40 text-primary hover:bg-primary hover:text-on-primary px-8 py-4 text-xs font-label font-bold tracking-widest transition-all duration-300 uppercase"
          >
            Solicitar Orçamento
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
};

const ProcessStep = ({ phase, title, description, icon: Icon, delay }) => {
  return (
    <ScrollReveal direction="up" delay={delay} className="relative bg-surface-container-low p-10 border border-white/5 bento-card flex flex-col items-start group">
      <div className="w-16 h-16 premium-gradient flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110">
        <Icon className="text-on-primary w-8 h-8" />
      </div>
      <span className="font-headline text-primary/40 text-xl block mb-4">{phase}</span>
      <h3 className="font-headline text-2xl text-white mb-4 uppercase tracking-tighter">{title}</h3>
      <p className="text-secondary body-md">
        {description}
      </p>
    </ScrollReveal>
  );
};

const Services = () => {
  const services = [
    {
      title: 'VOICE-OVER PREMIUM',
      description: 'A voz certa não apenas comunica; ela convence. Oferecemos narrações profissionais para comerciais de alto padrão, documentários, treinamentos corporativos e manifestos de marca. Versatilidade tonal com precisão emocional.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg6inCEPL8XpfUXi3PRq91yZKLn42d_px4wLHWchVy0FzAjt-QvQeKC18sJX3xAYRAvRMURpP5oNOlyM7DhExkBu2_jqDixH2p4DCiXJNcnU5MaTvxKqnB-cs25KL_3WkJIw0qSOXJprxZlVWuJT_16xrcrDsRfcNbPYAJ6iepTnmUzej77EkntTnldsLwzrOVTVwbFij_qHOdxrUQUXUHUlM4aSuoa_HzGxm4G3EzXyMoVTfKxRc3CjY-CaxnhxGUysctLrk2Hwg',
      icon: Mic2
    },
    {
      title: 'PRODUÇÃO CRIATIVA',
      description: 'Da folha em branco à direção final. Desenvolvemos roteiros estratégicos, direção de voz especializada e curadoria de talentos. Nossa equipe atua como um braço criativo para agências e marcas que buscam narrativa de impacto.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6VdhDKTofx83XeLDXYrlfJmMq0_oKlBvXBVe-8WBTBI2LJ4_VI6H_18g60MgPNH4MXWZCEScD9wMJeES2MIJSOr-WKJv2wAYGDBvH4_44SXb1uKIBSZ-QgrLkI3W8qr00cyIhwq-WWMQUVqLYROn-evnjBBTqNCPRrTdJCyYoZO7zrctij9GYbvYj5iEYcaorJ7Tysw2dcM_LJbDZ-dLB7UKYVkFLCB1CZHFehueupmMUMUr_CHGxszaF4C3Gyx0-slteLhPyPlo',
      icon: PenTool
    },
    {
      title: 'SOUND DESIGN & TRILHAS',
      description: 'Criação de identidades sonoras únicas. Editamos, mixamos e masterizamos cada detalhe. De trilhas originais exclusivas a efeitos sonoros foley que trazem realismo e profundidade para qualquer peça audiovisual.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKFFsb9wVenuZsnTSCewT1WIsfYFMsvS28Ewy0j_mm2JYgwG9NQ_19y2rv5RXu9OI6Oqy-oygY2cyXGF61R-FgIcAc9p4bsecbGKYHicAlRez7KRoPWyYj5p_HJwSGfNuntK6V4P5E5-g3GoolhGJd8nqtG3YEJSniDdWXavY7bfXQPLElxZuyjm8AKWMshCEx8EcC64dk1VtG_5-WznDkLVMH6CuVh_rVtgM578VCuWQkW3aMiLFxQwPlalhgaxAPMvqP5_u1Sfk',
      icon: AudioLines
    }
  ];

  const steps = [
    {
      phase: 'FASE 01',
      title: 'Briefing',
      description: 'Imersão completa no DNA da sua marca. Entendemos o objetivo, o tom de voz e o público-alvo para traçar a estratégia sonora perfeita.',
      icon: MessageSquare
    },
    {
      phase: 'FASE 02',
      title: 'Conceito',
      description: 'Transformação das ideias em roteiros e testes de voz. Aqui, a estrutura toma forma e validamos a direção artística do projeto.',
      icon: Lightbulb
    },
    {
      phase: 'FASE 03',
      title: 'Entrega',
      description: 'Produção final, mixagem e masterização com os mais altos padrões da indústria. Arquivos otimizados para cada plataforma.',
      icon: CheckCircle2
    }
  ];

  return (
    <>
      <SEO 
        title="Serviços de Produção Sonora" 
        description="Voice-over premium, sound design imersivo e produção criativa para elevar o padrão sonoro do seu projeto. Metodologia rigorosa e resultados de elite."
        canonical="/servicos"
      />

      <main className="pt-32 pb-24 bg-background overflow-hidden">
        {/* Header Section */}
        <header className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32">
          <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <span className="text-primary font-label text-[0.6875rem] uppercase tracking-[0.2em] mb-4 block font-bold">
                EXCELÊNCIA AUDITIVA
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tight text-white uppercase tracking-tighter">
                SERVIÇOS & PROCESSOS
              </h1>
            </div>
            <div className="md:col-span-4 pb-4">
              <p className="text-secondary font-body text-sm leading-relaxed border-l border-white/10 pl-6">
                Transformamos conceitos abstratos em experiências sonoras imersivas. Nossa abordagem combina rigor técnico com sensibilidade artística.
              </p>
            </div>
          </ScrollReveal>
        </header>

        {/* Services List */}
        <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-48">
          <div className="space-y-48">
            {services.map((service, index) => (
              <ServiceItem 
                key={index}
                index={index}
                title={service.title}
                description={service.description}
                image={service.image}
                icon={service.icon}
                reversed={index % 2 !== 0}
              />
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-surface-container-lowest py-32 px-6 md:px-12 border-y border-white/5 relative">
          <div className="max-w-screen-2xl mx-auto">
            <ScrollReveal direction="up" className="text-center mb-24">
              <span className="text-primary font-label text-[0.6875rem] uppercase tracking-[0.2em] mb-4 block font-bold">
                METODOLOGIA
              </span>
              <h2 className="font-headline text-4xl md:text-5xl text-white uppercase tracking-tighter">NOSSO PROCESSO</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Progress Line (Desktop only) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2" />
              
              {steps.map((step, index) => (
                <ProcessStep 
                  key={index}
                  phase={step.phase}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 md:px-12 py-32 max-w-screen-2xl mx-auto">
          <ScrollReveal direction="up" className="bg-surface-container-high p-16 md:p-24 text-center border border-white/5 backdrop-blur-xl rounded-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="font-headline text-4xl md:text-5xl text-white mb-8 max-w-3xl mx-auto leading-tight uppercase tracking-tighter font-bold">
              Pronto para dar voz ao seu próximo grande projeto?
            </h2>
            <p className="text-secondary body-md mb-12 max-w-2xl mx-auto">
              Nossa curadoria garante que cada som ressoe com a autoridade e o prestígio que sua marca merece.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link 
                to="/cadastro"
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-12 py-5 font-label text-xs font-bold tracking-widest rounded-md hover:scale-105 transition-all text-center uppercase"
              >
                CADASTRE-SE
              </Link>
              <Link 
                to="/login"
                className="border border-white/20 text-white px-12 py-5 font-label text-xs font-bold tracking-widest hover:bg-white/5 transition-all text-center uppercase"
              >
                LOGIN
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
};

export default Services;
