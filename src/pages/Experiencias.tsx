import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dicionario } from '../dicionario';
import { experiencias } from '../data/content';

interface ExperienciasProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
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
  const [pagina, setPagina] = useState(0);
  const t = dicionario[idioma];

  const ITENS_POR_PAGINA = 4;
  const totalPaginas = Math.ceil(experiencias.length / ITENS_POR_PAGINA);
  const inicio = pagina * ITENS_POR_PAGINA;
  const destaPagina = experiencias.slice(inicio, inicio + ITENS_POR_PAGINA);

  const esquerda = destaPagina.slice(0, 2);
  const direita = destaPagina.slice(2, 4);

  return (
    <div className="flex w-full h-full">
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

        <div className="mb-5">
          <h2
            className="text-2xl md:text-3xl font-bold text-ink leading-tight"
            style={{ fontFamily: '"Cinzel Decorative", cursive' }}
          >
            {t.experiencias.titulo}
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
            className="flex-1 flex flex-col gap-7 overflow-y-auto scrollbar-parchment pr-1"
          >
            {esquerda.map(exp => (
              <ExperienciaItem key={exp.id} exp={exp} idioma={idioma} />
            ))}
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
            className="flex-1 flex flex-col gap-7 overflow-y-auto scrollbar-parchment pr-1"
          >
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
          </motion.div>
        </AnimatePresence>

        {/* Rodapé */}
        <div className="mt-auto pt-4 flex flex-col gap-3 shrink-0">
          {totalPaginas > 1 && (
            <div className="border-t border-ink/15 pt-3 flex justify-between items-center">
              <button
                onClick={() => setPagina(p => p - 1)}
                disabled={pagina === 0}
                className={`font-cinzel text-sm transition-all ${pagina === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:text-rubric hover:-translate-x-1 cursor-pointer'}`}
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                ← Anterior
              </button>
              <span className="text-ink/35 text-sm" style={{ fontFamily: '"Cinzel Decorative", cursive' }}>
                {pagina + 1} / {totalPaginas}
              </span>
              <button
                onClick={() => setPagina(p => p + 1)}
                disabled={pagina === totalPaginas - 1}
                className={`font-cinzel text-sm transition-all ${pagina === totalPaginas - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:text-rubric hover:translate-x-1 cursor-pointer'}`}
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
    </div>
  );
}
