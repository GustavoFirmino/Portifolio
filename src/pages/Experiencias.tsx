import { dicionario } from '../dicionario';

interface ExperienciasProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

// Mantivemos a lista de experiências igual, pois ela já estava estruturada com { pt: '', en: '' }
const listaExperiencias = [
  {
    id: 1,
    cargo: { pt: "Estagiário em Suporte Internacional", en: "International Support Intern" },
    instituicao: "ArcelorMittal Sistemas",
    periodo: { pt: "Fev 2024 - Fev 2026", en: "Feb 2024 - Feb 2026" },
    descricao: { 
      pt: "Atuação na linha de frente do suporte internacional de aplicações, realizando a comunicação com clientes globais. Responsável pela análise de incidentes, validação de sistemas e manutenção de documentações técnicas.",
      en: "Frontline international application support, communicating with global clients. Responsible for incident analysis, system validation, and maintenance of technical documentation."
    }
  },
  {
    id: 2,
    cargo: { pt: "Estagiário em TI", en: "IT Intern" },
    instituicao: { pt: "Câmara Mun. de Nova Lima", en: "Nova Lima City Council" },
    periodo: { pt: "Jul 2023 - Jan 2024", en: "Jul 2023 - Jan 2024" },
    descricao: {
      pt: "Prestação de suporte administrativo e técnico durante minha graduação em Ciência da Computação. Auxílio aos processos internos do órgão e organização de documentações.",
      en: "Administrative and technical support during my Computer Science degree. Assistance with internal processes and documentation organization."
    }
  },
  {
    id: 3,
    cargo: { pt: "Atendimento e Operações", en: "Customer Service & Operations" },
    instituicao: "Cacau Show",
    periodo: { pt: "Junho 2020", en: "June 2020" },
    descricao: {
      pt: "Uma breve jornada focada no atendimento ao público e organização comercial. Experiência essencial para desenvolver habilidades de comunicação e resolução rápida de problemas logo antes de ingressar no caminho acadêmico.",
      en: "A brief journey focused on customer service and commercial organization. Essential experience for developing communication and quick problem-solving skills right before entering academia."
    }
  }
];

export function Experiencias({ voltar, idioma, toggleIdioma }: ExperienciasProps) {
  // Puxamos as palavras do dicionário com base no idioma atual
  const t = dicionario[idioma];

  return (
    <div className="flex w-full h-full">
      {/* ===== PÁGINA ESQUERDA ===== */}
      <div className="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-[1px] border-[#2c1e16]/20 p-8 md:p-12 flex flex-col relative overflow-y-auto custom-scrollbar">
        <button onClick={voltar} className="self-start text-lg font-bold hover:text-[#7a0000] hover:-translate-x-2 transition-transform cursor-pointer mb-8 flex items-center gap-2">
          {t.geral.voltarSumario}
        </button>

        {/* CABEÇALHO RESOLVIDO: Título e botão alinhados lado a lado, sem position absolute */}
        <div className="flex justify-between items-start mb-8 gap-4 border-b-2 border-[#5c1616] pb-2">
          <h2 className="text-4xl font-medieval font-bold text-[#2c1e16] leading-none">
            {t.experiencias.titulo}
          </h2>
          <button onClick={toggleIdioma} className="px-3 py-1 border border-[#2c1e16] hover:bg-[#2c1e16] hover:text-[#f4e8d1] transition-all text-sm font-bold cursor-pointer rounded-sm shrink-0 mt-1">
            {t.geral.botaoIdioma}
          </button>
        </div>

        <div className="space-y-10">
          {listaExperiencias.slice(0, 2).map((exp) => (
            <div key={exp.id} className="relative pl-6 border-l-2 border-[#5c1616]/50">
              <div className="absolute w-3 h-3 bg-[#5c1616] rotate-45 -left-[7px] top-2"></div>
              <h3 className="text-2xl font-medieval font-bold text-[#5c1616] leading-tight">{exp.cargo[idioma]}</h3>
              <span className="text-sm italic font-bold text-[#2c1e16]/70 block mb-2">{exp.periodo[idioma]}</span>
              <h4 className="text-lg font-bold mb-2 text-[#2c1e16] flex items-center gap-2"><span>🏰</span> {typeof exp.instituicao === 'string' ? exp.instituicao : exp.instituicao[idioma]}</h4>
              <p className="text-lg leading-relaxed text-justify">{exp.descricao[idioma]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PÁGINA DIREITA ===== */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative pt-12 md:pt-24 overflow-y-auto custom-scrollbar">
        <div className="space-y-10">
          {listaExperiencias.slice(2).map((exp) => (
            <div key={exp.id} className="relative pl-6 border-l-2 border-[#5c1616]/50">
              <div className="absolute w-3 h-3 bg-[#5c1616] rotate-45 -left-[7px] top-2"></div>
              <h3 className="text-2xl font-medieval font-bold text-[#5c1616] leading-tight">{exp.cargo[idioma]}</h3>
              <span className="text-sm italic font-bold text-[#2c1e16]/70 block mb-2">{exp.periodo[idioma]}</span>
              <h4 className="text-lg font-bold mb-2 text-[#2c1e16] flex items-center gap-2"><span>🍫</span> {typeof exp.instituicao === 'string' ? exp.instituicao : exp.instituicao[idioma]}</h4>
              <p className="text-lg leading-relaxed text-justify">{exp.descricao[idioma]}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-auto pt-12 opacity-40 text-center font-medieval text-xl italic">
          {t.experiencias.rodape}
        </div>
      </div>
    </div>
  );
}