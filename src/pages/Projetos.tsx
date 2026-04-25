import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { dicionario } from '../dicionario';
import { projetos } from '../data/content';

function ProjectFlipOverlay({ direction }: { direction: 'forward' | 'backward' }) {
  const isForward = direction === 'forward';
  const controls = useAnimation();
  useEffect(() => {
    controls.start({ rotateY: isForward ? -180 : 180, transition: { duration: 0.78, ease: [0.4, 0, 0.25, 1] } });
  }, []);
  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: isForward ? '50%' : 0, right: isForward ? 0 : '50%', perspective: '2200px', perspectiveOrigin: isForward ? '0% 50%' : '100% 50%', zIndex: 20, pointerEvents: 'none' }}>
      <motion.div animate={controls} style={{ transformOrigin: isForward ? 'left center' : 'right center', transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}>
        <div className="page-texture backface-hidden" style={{ position: 'absolute', inset: 0, boxShadow: isForward ? 'inset -8px 0 20px rgba(0,0,0,0.18)' : 'inset 8px 0 20px rgba(0,0,0,0.18)' }}>
          <div style={{ position: 'absolute', inset: 0, background: isForward ? 'linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 35%)' : 'linear-gradient(to left, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 35%)' }} />
        </div>
        <div className="page-texture backface-hidden" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backgroundColor: '#ede0bc', boxShadow: isForward ? 'inset 8px 0 20px rgba(0,0,0,0.14)' : 'inset -8px 0 20px rgba(0,0,0,0.14)' }}>
          <div style={{ position: 'absolute', inset: 0, background: isForward ? 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%)' : 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%)' }} />
        </div>
      </motion.div>
    </div>
  );
}

interface ProjetosProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

export function Projetos({ voltar, idioma, toggleIdioma }: ProjetosProps) {
  const [pagina, setPagina] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'forward' | 'backward'>('forward');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const projeto = projetos[pagina];
  const t = dicionario[idioma];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const avancar = () => {
    if (pagina < projetos.length - 1 && !flipping) {
      setFlipDir('forward');
      setFlipping(true);
      const t1 = setTimeout(() => setPagina(p => p + 1), 390);
      const t2 = setTimeout(() => setFlipping(false), 820);
      timers.current.push(t1, t2);
    }
  };
  const voltar2 = () => {
    if (pagina > 0 && !flipping) {
      setFlipDir('backward');
      setFlipping(true);
      const t1 = setTimeout(() => setPagina(p => p - 1), 390);
      const t2 = setTimeout(() => setFlipping(false), 820);
      timers.current.push(t1, t2);
    }
  };

  return (
    <div className="flex w-full h-full relative">
      {/* ── Página esquerda ── */}
      <div className="w-1/2 border-r border-ink/15 p-7 md:p-10 flex flex-col relative">
        <motion.button
          onClick={voltar}
          whileHover={{ x: -4 }}
          className="self-start flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-ink/60 hover:text-rubric transition-colors cursor-pointer mb-6"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          ← {t.geral.voltarSumario.replace('← ', '')}
        </motion.button>

        <div className="mb-4">
          <h2
            className="text-2xl md:text-3xl font-bold text-ink leading-tight"
            style={{ fontFamily: '"Cinzel Decorative", cursive' }}
          >
            {t.projetos.titulo}
          </h2>
          <div className="gold-divider mt-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pagina}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Badge data */}
            <span
              className="self-start text-xs font-bold px-3 py-1 mb-3"
              style={{
                background: '#8b0000',
                color: '#f2e4c4',
                fontFamily: '"Cinzel", serif',
                letterSpacing: '0.1em',
              }}
            >
              {projeto.data[idioma]}
            </span>

            {/* Título do projeto */}
            <h3
              className="text-xl md:text-2xl font-bold text-ink leading-tight mb-4"
              style={{ fontFamily: '"Cinzel Decorative", cursive' }}
            >
              {projeto.titulo[idioma]}
            </h3>

            {/* Imagem */}
            <div
              className="border-2 border-ink/30 overflow-hidden mb-4 shrink-0"
              style={{ background: '#e8d0a0', maxHeight: '180px' }}
            >
              <img
                src={projeto.imagem}
                alt={projeto.titulo[idioma]}
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: 'sepia(0.25)', maxHeight: '180px' }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'sepia(0)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'sepia(0.25)')}
              />
            </div>

            {/* Tecnologias */}
            <div className="flex flex-wrap gap-1.5">
              {projeto.tecnologias.map(tech => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 border border-ink/25 text-ink/75"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Página direita ── */}
      <div className="w-1/2 p-7 md:p-10 flex flex-col relative">
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleIdioma}
            className="px-3 py-1 border border-ink/30 hover:border-gold hover:text-gold font-cinzel text-xs tracking-widest uppercase transition-all cursor-pointer"
            style={{ fontFamily: '"Cinzel", serif', color: '#1c1008' }}
          >
            {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pagina}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center min-h-0"
          >
            <h4
              className="text-base font-bold mb-3 text-rubric uppercase tracking-widest"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {t.projetos.sobreArtefato}
            </h4>
            <div className="gold-divider mb-4" />
            <p
              className="text-lg md:text-xl text-justify leading-relaxed text-ink/90 mb-8 flex-1 overflow-y-auto scrollbar-parchment"
              style={{ fontFamily: '"IM Fell English", serif' }}
            >
              {projeto.descricao[idioma]}
            </p>

            <motion.a
              href={projeto.github}
              target="_blank"
              rel="noreferrer"
              whileHover={{ backgroundColor: '#8b0000', color: '#f2e4c4' }}
              className="block text-center px-5 py-3 border-2 border-ink text-ink font-bold transition-all"
              style={{ fontFamily: '"Cinzel", serif', fontSize: '0.78rem', letterSpacing: '0.1em' }}
            >
              {t.projetos.btnGithub}
            </motion.a>
          </motion.div>
        </AnimatePresence>

        {/* Paginação */}
        <div className="mt-auto pt-4 border-t border-ink/15 flex justify-between items-center shrink-0">
          <button
            onClick={voltar2}
            disabled={pagina === 0}
            className={`font-cinzel text-sm transition-all ${pagina === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:text-rubric hover:-translate-x-1 cursor-pointer'}`}
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            {t.projetos.btnAnterior}
          </button>
          <span
            className="text-ink/40 text-sm"
            style={{ fontFamily: '"Cinzel Decorative", cursive' }}
          >
            {pagina + 1} / {projetos.length}
          </span>
          <button
            onClick={avancar}
            disabled={pagina === projetos.length - 1}
            className={`font-cinzel text-sm transition-all ${pagina === projetos.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:text-rubric hover:translate-x-1 cursor-pointer'}`}
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            {t.projetos.btnProximo}
          </button>
        </div>

        <div
          className="absolute bottom-5 right-8 text-sm text-ink/25"
          style={{ fontFamily: '"Cinzel Decorative", cursive' }}
        >
          — 2 —
        </div>
      </div>

      {flipping && <ProjectFlipOverlay direction={flipDir} />}
    </div>
  );
}
