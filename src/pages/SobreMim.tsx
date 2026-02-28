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
      <div className="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-[1px] border-[#2c1e16]/20 p-8 md:p-12 flex flex-col relative">
        <button onClick={voltar} className="self-start text-lg font-bold hover:text-[#7a0000] hover:-translate-x-2 transition-transform cursor-pointer mb-8 flex items-center gap-2">
          {t.geral.voltarSumario}
        </button>

        <div className="flex justify-between items-start mb-6 gap-4 border-b-2 border-[#5c1616] pb-2">
          <h2 className="text-4xl font-medieval font-bold text-[#2c1e16] leading-none">
            {t.sobreMim.titulo}
          </h2>
        </div>

        <div className="text-xl leading-relaxed text-justify flex-1">
          <p className="first-letter:text-7xl first-letter:font-medieval first-letter:font-bold first-letter:text-[#7a0000] first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px] first-letter:leading-none">
            {t.sobreMim.p1_1}<strong>Gustavo Firmino</strong>{t.sobreMim.p1_2}<strong>React</strong>{t.sobreMim.p1_3}
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative">
        <div className="flex justify-end mb-6 w-full shrink-0">
          <button onClick={toggleIdioma} className="px-3 py-1 border border-[#2c1e16] hover:bg-[#2c1e16] hover:text-[#f4e8d1] transition-all text-sm font-bold cursor-pointer rounded-sm">
            {t.geral.botaoIdioma}
          </button>
        </div>

        <div className="text-xl leading-relaxed space-y-6 text-justify flex-1">
          <p>{t.sobreMim.p2_1}<strong>Node.js</strong>{t.sobreMim.p2_2}</p>
          <p>{t.sobreMim.p3}</p>
        </div>
        <div className="absolute bottom-6 right-12 text-[#2c1e16]/50 font-medieval font-bold text-xl">- 1 -</div>
      </div>
    </div>
  );
}