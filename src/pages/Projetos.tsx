import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dicionario } from '../dicionario';

interface ProjetosProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

const listaProjetos = [
  {
    id: 1,
    titulo: { pt: "O Épico Portfólio (Este Tomo)", en: "The Epic Portfolio (This Tome)" },
    data: { pt: "Fevereiro 2026", en: "February 2026" },
    descricao: { 
      pt: "Um website interativo com temática medieval, desenvolvido em formato de livro épico para apresentar minha jornada profissional, substituindo a rolagem comum por uma navegação imersiva e cinematográfica.",
      en: "An interactive medieval-themed website, developed in an epic book format to present my professional journey, replacing standard scrolling with an immersive and cinematic navigation."
    },
    tecnologias: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/GustavoFirmino/Portifolio",
    
    imagem: "/portifolio-ezgif.com-video-to-gif-converter.gif" 
  },
  {
    id: 2,
    titulo: { pt: "Sistema Fullstack: Carrinho e Estoque", en: "Fullstack System: Cart & Inventory" },
    data: { pt: "Janeiro 2026", en: "January 2026" },
    descricao: {
      pt: "Uma plataforma robusta com carrinho de compras e controle de estoque. Desenvolvida com arquitetura em camadas no backend para garantir regras de negócio complexas, como limites de itens.",
      en: "A robust platform with a shopping cart and inventory control. Developed with layered backend architecture to ensure complex business rules, such as item limits."
    },
    tecnologias: ["Node.js", "Express", "Prisma ORM", "SQLite", "React"],
    github: "https://github.com/GustavoFirmino/ecommerce-technical-challenge",
    imagem: "/projeto-estoque.gif"
  }
];

export function Projetos({ voltar, idioma, toggleIdioma }: ProjetosProps) {
  const [pagina, setPagina] = useState(0);
  const projetoAtual = listaProjetos[pagina];
  const t = dicionario[idioma];

  const proximaPagina = () => { if (pagina < listaProjetos.length - 1) setPagina(pagina + 1); };
  const paginaAnterior = () => { if (pagina > 0) setPagina(pagina - 1); };

  return (
    <div className="flex w-full h-full">
      
      
      <div className="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-[1px] border-[#2c1e16]/20 p-8 md:p-12 flex flex-col relative">
        <button onClick={voltar} className="self-start text-lg font-bold hover:text-[#7a0000] hover:-translate-x-2 transition-transform cursor-pointer mb-8 flex items-center gap-2">
          {t.geral.voltarSumario}
        </button>

        <h2 className="text-4xl font-medieval font-bold mb-6 border-b-2 border-[#5c1616] pb-2 text-[#2c1e16]">
          {t.projetos.titulo}
        </h2>

        <AnimatePresence mode="wait">
          <motion.div 
            key={pagina} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            transition={{ duration: 0.3 }} 
            className="flex-1 flex flex-col"
          >
            <span className="text-sm font-bold bg-[#5c1616] text-[#f4e8d1] px-3 py-1 rounded-sm mb-4 self-start shadow-md">
              {projetoAtual.data[idioma]}
            </span>
            <h3 className="text-3xl font-medieval font-bold mb-4 text-[#2c1e16] leading-tight">
              {projetoAtual.titulo[idioma]}
            </h3>
            
            
            <div className="border-4 border-[#2c1e16] overflow-hidden shadow-md shrink-0 mb-4 bg-[#f4e8d1]">
              <img 
                src={projetoAtual.imagem} 
                alt={`Preview do ${projetoAtual.titulo[idioma]}`} 
                className="w-full h-48 md:h-56 object-cover sepia-[.3] hover:sepia-0 transition-all duration-500" 
              />
            </div>

            
            <div className="mb-6 flex flex-wrap gap-2">
              {projetoAtual.tecnologias.map(tech => (
                <span key={tech} className="text-xs font-bold border border-[#2c1e16] px-2 py-1 bg-[#f4e8d1] shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative overflow-y-auto custom-scrollbar">
        
        <div className="flex justify-end mb-6 shrink-0 absolute top-8 right-12">
          <button onClick={toggleIdioma} className="px-3 py-1 border border-[#2c1e16] hover:bg-[#2c1e16] hover:text-[#f4e8d1] transition-all text-sm font-bold cursor-pointer rounded-sm whitespace-nowrap shrink-0">
            {t.geral.botaoIdioma}
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={pagina} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            transition={{ duration: 0.3 }} 
            className="flex-1 flex flex-col pt-12 justify-center" 
          >
            <h4 className="text-2xl font-bold mb-4 text-[#5c1616]">
              {t.projetos.sobreArtefato}
            </h4>
            <p className="text-xl mb-12 text-justify font-medium leading-relaxed">
              {projetoAtual.descricao[idioma]}
            </p>
            
            <a 
              href={projetoAtual.github} 
              target="_blank" 
              rel="noreferrer" 
              className="text-center px-6 py-3 bg-[#2c1e16] text-[#f4e8d1] font-bold hover:bg-[#5c1616] transition-colors border-2 border-transparent hover:border-[#2c1e16] shadow-lg w-full max-w-xs mx-auto shrink-0 mb-16"
            >
              {t.projetos.btnGithub}
            </a>
          </motion.div>
        </AnimatePresence>

        {/* Controles de Paginação */}
        <div className="mt-auto border-t-2 border-[#2c1e16]/30 pt-4 flex justify-between items-center text-lg font-bold shrink-0">
          <button onClick={paginaAnterior} disabled={pagina === 0} className={`flex items-center gap-2 transition-all ${pagina === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#5c1616] hover:-translate-x-1 cursor-pointer'}`}>
            {t.projetos.btnAnterior}
          </button>
          <span className="font-medieval text-xl text-[#5c1616]">{pagina + 1} / {listaProjetos.length}</span>
          <button onClick={proximaPagina} disabled={pagina === listaProjetos.length - 1} className={`flex items-center gap-2 transition-all ${pagina === listaProjetos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#5c1616] hover:translate-x-1 cursor-pointer'}`}>
            {t.projetos.btnProximo}
          </button>
        </div>
      </div>
    </div>
  );
}
