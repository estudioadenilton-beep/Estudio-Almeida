import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#131313] w-full py-16 px-6 md:px-12 border-t border-[#e5e2e1]/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-screen-2xl mx-auto">
        <div className="sm:col-span-1">
          <Link
            to="/"
            className="text-xl font-serif text-[#e5e2e1] mb-4 flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
          >
            <img
              alt="Estúdio Almeida Logo"
              className="h-10 w-10 object-contain"
              loading="lazy"
              src="/minha-logo.png"
            />
            <span>Estúdio Almeida</span>
          </Link>
          <p className="text-[#e5e2e1]/60 text-xs font-body font-light leading-relaxed mb-6">
            Elevando o padrão da produção criativa através da excelência sonora.
          </p>
          <div className="flex gap-4">
            <a className="text-[#e5e2e1]/60 hover:text-[#f2ca50] transition-colors" href="#">
              <span className="material-symbols-outlined">brand_awareness</span>
            </a>
            <a className="text-[#e5e2e1]/60 hover:text-[#f2ca50] transition-colors" href="#">
              <span className="material-symbols-outlined">podcasts</span>
            </a>
            <a className="text-[#e5e2e1]/60 hover:text-[#f2ca50] transition-colors" href="#">
              <span className="material-symbols-outlined">music_note</span>
            </a>
          </div>
        </div>

        <div className="sm:col-span-1">
          <span className="text-xs font-label font-bold text-[#f2ca50] tracking-widest mb-6 block uppercase font-bold">
            Navegação
          </span>
          <ul className="space-y-4 text-xs font-body text-[#e5e2e1]/60 uppercase tracking-widest font-bold">
            <li>
              <Link className="hover:text-[#f2ca50] transition-all" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2ca50] transition-all" to="/portfolio">
                Portfolio
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2ca50] transition-all" to="/servicos">
                Serviços
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2ca50] transition-all" to="/sobre-contato">
                Sobre
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#f2ca50] transition-all" to="/sobre-contato">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-1">
          <span className="text-xs font-label font-bold text-[#f2ca50] tracking-widest mb-6 block uppercase font-bold">
            Legal
          </span>
          <ul className="space-y-4 text-xs font-body text-[#e5e2e1]/60 uppercase tracking-widest font-bold">
            <li>
              <a className="hover:text-[#f2ca50] transition-all" href="#">
                Termos de Uso
              </a>
            </li>
            <li>
              <a className="hover:text-[#f2ca50] transition-all" href="#">
                Privacidade
              </a>
            </li>
            <li>
              <a className="hover:text-[#f2ca50] transition-all" href="#">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-1">
          <span className="text-xs font-label font-bold text-[#f2ca50] tracking-widest mb-6 block uppercase font-bold">
            Newsletter
          </span>
          <p className="text-[#e5e2e1]/60 text-xs mb-4 uppercase tracking-widest font-bold">Receba insights sobre áudio e produção.</p>
          <div className="flex border-b border-white/10 pb-2">
            <input
              className="bg-transparent border-none text-xs focus:ring-0 p-0 w-full text-on-surface uppercase tracking-widest"
              placeholder="SEU E-MAIL"
              type="email"
            />
            <button className="text-primary">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6">
        <span className="text-[10px] font-body text-[#e5e2e1]/40 uppercase tracking-widest text-center lg:text-left">
          © 2024 Estúdio Almeida. Creative Excellence in Voice &amp; Sound.
        </span>
        <div className="flex flex-wrap justify-center gap-8 text-[10px] font-label font-bold tracking-widest text-[#e5e2e1]/40">
          <span>MADE IN SÃO PAULO</span>
          <span>GLOBAL DELIVERY</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
