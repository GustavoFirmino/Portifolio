import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { dicionario } from '../dicionario';

function LinkedInBadge() {
  useEffect(() => {
    const existing = document.getElementById('li-badge-script');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'li-badge-script';
    script.src = 'https://platform.linkedin.com/badges/js/profile.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.getElementById('li-badge-script')?.remove();
    };
  }, []);

  return (
    <div
      className="badge-base LI-profile-badge"
      data-locale="pt_BR"
      data-size="medium"
      data-theme="light"
      data-type="HORIZONTAL"
      data-vanity="gustavo-pessoa-205759239"
      data-version="v1"
    >
      <a
        className="badge-base__link LI-simple-link"
        href="https://br.linkedin.com/in/gustavo-pessoa-205759239?trk=profile-badge"
        target="_blank"
        rel="noreferrer"
      >
        Gustavo Pessoa
      </a>
    </div>
  );
}

interface ContatoProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

export function Contato({ voltar, idioma, toggleIdioma }: ContatoProps) {
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const t = dicionario[idioma];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    emailjs
      .send('service_qb3jail', 'template_sp9e5tu', formData, 'glAb3wFpmONFLHLAL')
      .then(() => {
        setEnviado(true);
        setCarregando(false);
        setFormData({ nome: '', email: '', mensagem: '' });
        setTimeout(() => setEnviado(false), 4000);
      })
      .catch(() => {
        setCarregando(false);
        alert(t.contato.erroMagia);
      });
  };

  const inputStyle = {
    width: '100%', padding: '8px 10px',
    background: 'rgba(232,208,160,0.3)',
    border: '1.5px solid rgba(28,16,8,0.3)',
    fontFamily: '"IM Fell English", serif',
    fontSize: '0.95rem', color: '#1c1008',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div className="flex w-full h-full">
      {/* ── Página esquerda ── */}
      <div className="w-1/2 border-r border-ink/15 p-7 md:p-10 flex flex-col relative">
        <motion.button
          onClick={voltar}
          whileHover={{ x: -4 }}
          className="self-start flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-ink/60 hover:text-rubric transition-colors cursor-pointer mb-5"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          ← {t.geral.voltarSumario.replace('← ', '')}
        </motion.button>

        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <h2
            className="text-2xl font-bold text-ink leading-tight"
            style={{ fontFamily: '"Cinzel Decorative", cursive' }}
          >
            {t.contato.titulo}
          </h2>
          <button
            onClick={toggleIdioma}
            className="px-2 py-1 border border-ink/30 hover:border-gold hover:text-gold font-cinzel text-xs tracking-widest uppercase transition-all cursor-pointer shrink-0 mt-1"
            style={{ fontFamily: '"Cinzel", serif', color: '#1c1008' }}
          >
            {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
          </button>
        </div>
        <div className="gold-divider mb-4" />

        <p
          className="text-sm md:text-base leading-relaxed text-justify text-ink/80 mb-5"
          style={{ fontFamily: '"IM Fell English", serif' }}
        >
          {t.contato.descricao}
        </p>

        {/* Links de contato */}
        <div className="flex flex-col gap-3 mb-6 text-sm">
          {[
            { href: 'mailto:gustavopessoa00719@gmail.com', emoji: '🦅', label: 'gustavopessoa00719@gmail.com' },
            { href: 'https://wa.me/5531985559698', emoji: '💬', label: 'WhatsApp: (31) 98555-9698' },
            { href: 'https://www.linkedin.com/in/gustavo-pessoa-205759239/', emoji: '📜', label: t.contato.linkedin },
            { href: 'https://github.com/GustavoFirmino', emoji: '🐙', label: t.contato.github },
          ].map(({ href, emoji, label }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ x: 5, color: '#8b0000' }}
              className="flex items-center gap-2 text-ink/80 transition-colors"
              style={{ fontFamily: '"IM Fell English", serif' }}
            >
              <span>{emoji}</span>
              <span className="hover:underline">{label}</span>
            </motion.a>
          ))}
        </div>

        {/* LinkedIn Badge */}
        <div className="mb-5">
          <LinkedInBadge />
        </div>

        {/* Download currículo */}
        <div className="mt-auto border-t border-ink/15 pt-4">
          <p
            className="text-xs uppercase tracking-widest text-ink/50 mb-3"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            {t.contato.baixarArquivos}
          </p>
          <div className="flex flex-col gap-2">
            <motion.a
              href={idioma === 'pt' ? '/Currículo_Gustavo_PF_2026.pdf' : '/Currículo_Gustavo_EN_2026.pdf'}
              download
              whileHover={{ backgroundColor: '#1c1008', color: '#f2e4c4' }}
              className="text-center px-4 py-2 border border-ink text-ink text-xs font-bold transition-all"
              style={{ fontFamily: '"Cinzel", serif', letterSpacing: '0.1em' }}
            >
              {t.contato.curriculo}
            </motion.a>
          </div>
        </div>
      </div>

      {/* ── Página direita ── */}
      <div className="w-1/2 p-7 md:p-10 flex flex-col justify-center relative">
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#8b0000' }}
        >
          {t.contato.formularioTitulo}
        </h3>
        <div className="gold-divider mb-5" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs uppercase tracking-widest text-ink/60 mb-1"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {t.contato.labelNome}
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#8b0000')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(28,16,8,0.3)')}
            />
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-widest text-ink/60 mb-1"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {t.contato.labelEmail}
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#8b0000')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(28,16,8,0.3)')}
            />
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-widest text-ink/60 mb-1"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {t.contato.labelMensagem}
            </label>
            <textarea
              rows={4}
              required
              value={formData.mensagem}
              onChange={e => setFormData({ ...formData, mensagem: e.target.value })}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#8b0000')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(28,16,8,0.3)')}
            />
          </div>

          <motion.button
            type="submit"
            disabled={carregando}
            whileHover={!carregando ? { backgroundColor: '#8b0000', color: '#f2e4c4' } : {}}
            whileTap={!carregando ? { scale: 0.98 } : {}}
            className="px-6 py-3 border-2 border-ink text-ink font-bold transition-all mt-1"
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              cursor: carregando ? 'wait' : 'pointer',
              opacity: carregando ? 0.65 : 1,
            }}
          >
            {carregando
              ? t.contato.btnEnviando
              : enviado
              ? t.contato.btnEnviado
              : t.contato.btnEnviar}
          </motion.button>
        </form>

        <div
          className="absolute bottom-5 right-8 text-sm text-ink/25"
          style={{ fontFamily: '"Cinzel Decorative", cursive' }}
        >
          — 4 —
        </div>
      </div>
    </div>
  );
}
