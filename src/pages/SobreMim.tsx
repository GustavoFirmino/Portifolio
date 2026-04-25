import { motion } from 'framer-motion';
import { dicionario } from '../dicionario';

interface SobreMimProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

export function SobreMim({ voltar, idioma, toggleIdioma }: SobreMimProps) {
  const t = dicionario[idioma];

  return (
    <div className="flex w-full h-full">
      {/* ── Página esquerda ── */}
      <div
        className="w-1/2 border-r border-ink/15 p-7 md:p-10 flex flex-col relative overflow-hidden"
        style={{ fontFamily: '"IM Fell English", serif' }}
      >
        {/* Botão voltar */}
        <motion.button
          onClick={voltar}
          whileHover={{ x: -4 }}
          className="self-start flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-ink/60 hover:text-rubric transition-colors cursor-pointer mb-6"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          ← {t.geral.voltarSumario.replace('← ', '')}
        </motion.button>

        {/* Título do capítulo */}
        <div className="mb-5">
          <h2
            className="text-2xl md:text-3xl font-bold text-ink leading-tight"
            style={{ fontFamily: '"Cinzel Decorative", cursive' }}
          >
            {t.sobreMim.titulo}
          </h2>
          <div className="gold-divider mt-2" />
        </div>

        {/* Texto com drop cap */}
        <div
          className="drop-cap flex-1 text-lg md:text-xl leading-relaxed text-justify text-ink/90 overflow-y-auto scrollbar-parchment pr-1"
          style={{ fontFamily: '"IM Fell English", serif' }}
        >
          <p>
            {t.sobreMim.p1_1}
            <strong style={{ fontFamily: '"Cinzel", serif' }}>Gustavo Firmino</strong>
            {t.sobreMim.p1_2}
            <strong style={{ color: '#8b0000' }}>React</strong>
            {t.sobreMim.p1_3}
          </p>
        </div>

        {/* Ornamento de rodapé */}
        <div className="mt-4 flex items-center gap-2 opacity-30">
          <div className="flex-1 h-px bg-ink" />
          <span className="text-gold text-sm">◆</span>
          <div className="flex-1 h-px bg-ink" />
        </div>
      </div>

      {/* ── Página direita ── */}
      <div
        className="w-1/2 p-7 md:p-10 flex flex-col relative"
        style={{ fontFamily: '"IM Fell English", serif' }}
      >
        {/* Botão de idioma */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleIdioma}
            className="px-3 py-1 border border-ink/30 hover:border-gold hover:text-gold font-cinzel text-xs tracking-widest uppercase transition-all cursor-pointer"
            style={{ fontFamily: '"Cinzel", serif', color: '#1c1008' }}
          >
            {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
          </button>
        </div>

        {/* Texto continuação */}
        <div
          className="flex-1 text-lg md:text-xl leading-relaxed text-justify text-ink/90 space-y-5 overflow-y-auto scrollbar-parchment pr-1"
        >
          <p>
            {t.sobreMim.p2_1}
            <strong style={{ color: '#8b0000' }}>Node.js</strong>
            {t.sobreMim.p2_2}
          </p>
          <p>{t.sobreMim.p3}</p>

          {/* Bloco de habilidades */}
          <div className="mt-4 border-t border-ink/15 pt-4">
            <p
              className="text-xs tracking-widest uppercase mb-3 opacity-60"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              Arsenal
            </p>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Tailwind', 'Framer Motion', 'Prisma', 'SQL'].map(skill => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 border border-ink/25 text-ink/80 hover:border-gold hover:text-gold transition-all"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Número de página */}
        <div
          className="absolute bottom-5 right-8 text-sm text-ink/25"
          style={{ fontFamily: '"Cinzel Decorative", cursive' }}
        >
          — 1 —
        </div>
      </div>
    </div>
  );
}
