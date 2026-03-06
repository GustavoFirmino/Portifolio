import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dicionario } from '../dicionario';

interface ExperienciasProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

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
  const [pagina, setPagina] = useState(0);
  const t = dicionario[idioma];

  // ================= LÓGICA DE PAGINAÇÃO =================
  const itensPorLado = 2; // Quantas experiências cabem de cada lado
  const itensPorPaginaDupla = itensPorLado * 2; // Total de 4 experiências por vez
  const totalPaginas = Math.ceil(listaExperiencias.length / itensPorPaginaDupla);

  const inicio = pagina * itensPorPaginaDupla;
  const fim = inicio + itensPorPaginaDupla;
  
  // Corta a lista gigante para mostrar só as 4 experiências desta folha
  const experienciasDestaPagina = listaExperiencias.slice(inicio, fim);
  
  // Divide as 4 experiências: metade para a esquerda, metade para a direita
  const experienciasEsquerda = experienciasDestaPagina.slice(0, itensPorLado);
  const experienciasDireita = experienciasDestaPagina.slice(itensPorLado, itensPorLado * 2);

  const proximaPagina = () => { if (pagina < totalPaginas - 1) setPagina(pagina + 1); };
  const paginaAnterior = () => { if (pagina > 0) setPagina(pagina - 1); };

  return (
    <div className="flex w-full h-full">
      {/* ===== PÁGINA ESQUERDA ===== */}
      <div className="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-[1px] border-[#2c1e16]/20 p-8 md:p-12 flex flex-col relative">
        <button onClick={voltar} className="self-start text-lg font-bold hover:text-[#7a0000] hover:-translate-x-2 transition-transform cursor-pointer mb-8 flex items-center gap-2 shrink-0">
          {t.geral.voltarSumario}
        </button>

        <div className="flex justify-between items-start mb-8 gap-4 border-b-2 border-[#5c1616] pb-2 shrink-0">
          <h2 className="text-4xl font-medieval font-bold text-[#2c1e16] leading-none">
            {t.experiencias.titulo}
          </h2>
        </div>

        {/* Lista de Experiências (Esquerda) com Animação */}
        <AnimatePresence mode="wait">
          <motion.div key={pagina} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-10 flex-1">
            {experienciasEsquerda.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-[#5c1616]/50">
                <div className="absolute w-3 h-3 bg-[#5c1616] rotate-45 -left-[7px] top-2"></div>
                <h3 className="text-2xl font-medieval font-bold text-[#5c1616] leading-tight">{exp.cargo[idioma]}</h3>
                <span className="text-sm italic font-bold text-[#2c1e16]/70 block mb-2">{exp.periodo[idioma]}</span>
                <h4 className="text-lg font-bold mb-2 text-[#2c1e16] flex items-center gap-2"><span>🏰</span> {typeof exp.instituicao === 'string' ? exp.instituicao : exp.instituicao[idioma]}</h4>
                <p className="text-lg leading-relaxed text-justify">{exp.descricao[idioma]}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ===== PÁGINA DIREITA ===== */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative pt-12 md:pt-12">
        <div className="flex justify-end mb-8 w-full shrink-0">
          <button onClick={toggleIdioma} className="px-3 py-1 border border-[#2c1e16] hover:bg-[#2c1e16] hover:text-[#f4e8d1] transition-all text-sm font-bold cursor-pointer rounded-sm">
            {t.geral.botaoIdioma}
          </button>
        </div>

        {/* Lista de Experiências (Direita) com Animação */}
        <AnimatePresence mode="wait">
          <motion.div key={pagina} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-10 flex-1 mt-4">
            {experienciasDireita.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-[#5c1616]/50">
                <div className="absolute w-3 h-3 bg-[#5c1616] rotate-45 -left-[7px] top-2"></div>
                <h3 className="text-2xl font-medieval font-bold text-[#5c1616] leading-tight">{exp.cargo[idioma]}</h3>
                <span className="text-sm italic font-bold text-[#2c1e16]/70 block mb-2">{exp.periodo[idioma]}</span>
                <h4 className="text-lg font-bold mb-2 text-[#2c1e16] flex items-center gap-2"><span>🍫</span> {typeof exp.instituicao === 'string' ? exp.instituicao : exp.instituicao[idioma]}</h4>
                <p className="text-lg leading-relaxed text-justify">{exp.descricao[idioma]}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* ===== RODAPÉ E CONTROLES DE PAGINAÇÃO ===== */}
        <div className="mt-auto pt-4 flex flex-col gap-6 shrink-0">
           
           {/* Só mostra a barra de paginação se houver mais de 1 página de experiências */}
           {totalPaginas > 1 && (
             <div className="border-t-2 border-[#2c1e16]/30 pt-4 flex justify-between items-center text-lg font-bold">
               <button onClick={paginaAnterior} disabled={pagina === 0} className={`flex items-center gap-2 transition-all ${pagina === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#5c1616] hover:-translate-x-1 cursor-pointer'}`}>
                 {t.projetos.btnAnterior}
               </button>
               <span className="font-medieval text-xl text-[#5c1616]">{pagina + 1} / {totalPaginas}</span>
               <button onClick={proximaPagina} disabled={pagina === totalPaginas - 1} className={`flex items-center gap-2 transition-all ${pagina === totalPaginas - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#5c1616] hover:translate-x-1 cursor-pointer'}`}>
                 {t.projetos.btnProximo}
               </button>
             </div>
           )}

           <div className="opacity-40 text-center font-medieval text-xl italic mt-2 border-t-2 border-[#2c1e16]/30 pt-4">
             {t.experiencias.rodape}
           </div>
        </div>
      </div>
    </div>
  );
}