import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { dicionario } from '../dicionario';
import { experiencias } from '../data/content';

interface ExperienciasProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

// ─── Page-turn leaf (matches the book's flip) ───
function LeafOverlay({ direction }: { direction: 'forward' | 'backward' }) {
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

function ExperienciaItem({ exp, idioma }: { exp: typeof experiencias[0]; idioma: 'pt' | 'en' }) {
  return (
    <div className="relative pl-5 border-l-2 border-rubric/35">
      <div
        className="absolute w-2.5 h-2.5 bg-rubric -left-[7px] top-1.5"
        style={{ transform: 'rotate(45deg)' }}
      />
      <h3
        className="text-lg md:text-xl font-bold leading-tight mb-0.5"
        style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#8b0000' }}
      >
        {exp.cargo[idioma]}
      </h3>
      <span
        className="text-sm italic text-ink/55 block mb-1"
        style={{ fontFamily: '"IM Fell English", serif' }}
      >
        {exp.periodo[idioma]}
      </span>
      <h4
        className="text-base font-bold mb-1.5 flex items-center gap-1.5 text-ink/80"
        style={{ fontFamily: '"Cinzel", serif' }}
      >
        <span>{exp.emoji}</span>
        {typeof exp.instituicao === 'string' ? exp.instituicao : exp.instituicao[idioma]}
      </h4>
      <p
        className="text-base md:text-lg leading-relaxed text-justify text-ink/80"
        style={{ fontFamily: '"IM Fell English", serif' }}
      >
        {exp.descricao[idioma]}
      </p>
    </div>
  );
}

export function Experiencias({ voltar, idioma, toggleIdioma }: ExperienciasProps) {
  const [pagina, setPagina] = useState(0);   // target page (drives button state)
  const [shown, setShown] = useState(0);      // page whose content is on screen
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'forward' | 'backward'>('forward');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = dicionario[idioma];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const ITENS_POR_PAGINA = 4;
  const totalPaginas = Math.ceil(experiencias.length / ITENS_POR_PAGINA);
  const inicio = shown * ITENS_POR_PAGINA;
  const destaPagina = experiencias.slice(inicio, inicio + ITENS_POR_PAGINA);
  const esquerda = destaPagina.slice(0, 2);
  const direita = destaPagina.slice(2, 4);

  const irPara = (destino: number) => {
    if (destino < 0 || destino >= totalPaginas || flipping) return;
    const instant = typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    setPagina(destino);
    if (instant) { setShown(destino); return; }
    setFlipDir(destino > shown ? 'forward' : 'backward');
    setFlipping(true);
    // Swap the content only near the end of the turn, so no words flash mid-flip.
    const t1 = setTimeout(() => setShown(destino), 660);
    const t2 = setTimeout(() => setFlipping(false), 820);
    timers.current.push(t1, t2);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full relative">
      {/* ── Página esquerda ── */}
      <div className="w-full md:w-1/2 md:border-r border-ink/15 p-7 md:p-10 flex flex-col relative">
        <motion.button
          onClick={voltar}
          whileHover={{ x: -4 }}
          className="self-start flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-ink/60 hover:text-rubric transition-colors cursor-pointer mb-6"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          ← {t.geral.voltarSumario.replace('← ', '')}
        </motion.button>

        <div className="mb-5">
          <h2
            className="text-2xl md:text-3xl font-bold text-ink leading-tight"
            style={{ fontFamily: '"Cinzel Decorative", cursive' }}
          >
            {t.experiencias.titulo}
          </h2>
          <div className="gold-divider mt-2" />
        </div>

        <div className="flex-1 flex flex-col gap-7 md:overflow-y-auto scrollbar-parchment pr-1">
          {esquerda.map(exp => (
            <ExperienciaItem key={exp.id} exp={exp} idioma={idioma} />
          ))}
        </div>
      </div>

      {/* ── Página direita ── */}
      <div className="w-full md:w-1/2 p-7 md:p-10 flex flex-col relative">
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleIdioma}
            className="px-3 py-1 border border-ink/30 hover:border-gold hover:text-gold font-cinzel text-xs tracking-widest uppercase transition-all cursor-pointer"
            style={{ fontFamily: '"Cinzel", serif', color: '#1c1008' }}
          >
            {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-7 md:overflow-y-auto scrollbar-parchment pr-1">
          {direita.length > 0
            ? direita.map(exp => (
                <ExperienciaItem key={exp.id} exp={exp} idioma={idioma} />
              ))
            : (
              <div className="flex-1 flex items-center justify-center opacity-20">
                <span style={{ fontFamily: '"Cinzel Decorative", cursive', fontSize: '3rem' }}>◆</span>
              </div>
            )
          }
        </div>

        {/* Rodapé */}
        <div className="mt-auto pt-4 flex flex-col gap-3 shrink-0">
          {totalPaginas > 1 && (
            <div className="border-t border-ink/15 pt-3 flex justify-between items-center">
              <button
                onClick={() => irPara(pagina - 1)}
                disabled={pagina === 0 || flipping}
                className={`font-cinzel text-sm transition-all ${pagina === 0 || flipping ? 'opacity-20 cursor-not-allowed' : 'hover:text-rubric hover:-translate-x-1 cursor-pointer'}`}
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                ← Anterior
              </button>
              <span className="text-ink/35 text-sm" style={{ fontFamily: '"Cinzel Decorative", cursive' }}>
                {pagina + 1} / {totalPaginas}
              </span>
              <button
                onClick={() => irPara(pagina + 1)}
                disabled={pagina === totalPaginas - 1 || flipping}
                className={`font-cinzel text-sm transition-all ${pagina === totalPaginas - 1 || flipping ? 'opacity-20 cursor-not-allowed' : 'hover:text-rubric hover:translate-x-1 cursor-pointer'}`}
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                Próximo →
              </button>
            </div>
          )}

          <p
            className="text-center text-xs italic text-ink/35 border-t border-ink/10 pt-3"
            style={{ fontFamily: '"IM Fell English", serif' }}
          >
            {t.experiencias.rodape}
          </p>
        </div>

        <div
          className="absolute bottom-5 right-8 text-sm text-ink/25"
          style={{ fontFamily: '"Cinzel Decorative", cursive' }}
        >
          — 3 —
        </div>
      </div>

      {flipping && <LeafOverlay direction={flipDir} />}
    </div>
  );
}
