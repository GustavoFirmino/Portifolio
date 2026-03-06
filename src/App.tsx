import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SobreMim } from './pages/SobreMim';
import { Projetos } from './pages/Projetos';
import { Experiencias } from './pages/Experiencias';
import { Contato } from './pages/Contato';
import { dicionario } from './dicionario';

export default function App() {
  const [livroAberto, setLivroAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState('sumario');
  const [idioma, setIdioma] = useState<'pt' | 'en'>('pt');
  
  const toggleIdioma = () => setIdioma(idioma === 'pt' ? 'en' : 'pt');
  const t = dicionario[idioma];

  const renderizarPaginaDupla = () => {
    switch (paginaAtual) {
      case 'sumario':
        return (
          <div className="flex w-full h-full">
            <div className="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-[1px] border-[#2c1e16]/20 p-8 md:p-12 flex flex-col items-center justify-center text-center opacity-60 relative">
               <div className="absolute top-8 right-8">
                 <button onClick={toggleIdioma} className="px-3 py-1 border border-[#2c1e16] hover:bg-[#2c1e16] hover:text-[#f4e8d1] transition-all text-sm font-bold cursor-pointer rounded-sm">
                   {t.geral.botaoIdioma}
                 </button>
               </div>
               <div className="w-24 h-24 mb-6 border-4 border-[#2c1e16] rounded-full flex items-center justify-center rotate-45">
                 <div className="w-16 h-16 border-2 border-[#2c1e16] rounded-full -rotate-45 flex items-center justify-center font-medieval text-4xl">G</div>
               </div>
               <h2 className="text-3xl font-medieval font-bold">{t.sumario.tituloArte}</h2>
               <p className="italic mt-4 text-lg">{t.sumario.subtituloArte}</p>
               
               <button onClick={() => setLivroAberto(false)} className="mt-12 text-sm italic hover:underline cursor-pointer text-[#2c1e16]/70">
                {t.geral.fecharTomo}
              </button>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center">
              <h2 className="text-5xl font-medieval font-bold mb-12 border-b-2 border-[#2c1e16] pb-4 text-center w-full">{t.sumario.indice}</h2>
              <ul className="flex flex-col gap-8 text-2xl w-full max-w-xs">
                <li><button onClick={() => setPaginaAtual('sobre_mim')} className="hover:font-bold hover:text-[#7a0000] text-center w-full cursor-pointer transition-colors border-b border-transparent hover:border-[#7a0000] pb-1">{t.sumario.cap1}</button></li>
                <li><button onClick={() => setPaginaAtual('projetos')} className="hover:font-bold hover:text-[#7a0000] text-center w-full cursor-pointer transition-colors border-b border-transparent hover:border-[#7a0000] pb-1">{t.sumario.cap2}</button></li>
                <li><button onClick={() => setPaginaAtual('experiencias')} className="hover:font-bold hover:text-[#7a0000] text-center w-full cursor-pointer transition-colors border-b border-transparent hover:border-[#7a0000] pb-1">{t.sumario.cap3}</button></li>
                <li><button onClick={() => setPaginaAtual('contato')} className="hover:font-bold hover:text-[#7a0000] text-center w-full cursor-pointer transition-colors border-b border-transparent hover:border-[#7a0000] pb-1">{t.sumario.cap4}</button></li>
              </ul>
            </div>
          </div>
        );
      case 'sobre_mim': return <SobreMim voltar={() => setPaginaAtual('sumario')} idioma={idioma} toggleIdioma={toggleIdioma} />;
      case 'projetos': return <Projetos voltar={() => setPaginaAtual('sumario')} idioma={idioma} toggleIdioma={toggleIdioma} />;
      case 'experiencias': return <Experiencias voltar={() => setPaginaAtual('sumario')} idioma={idioma} toggleIdioma={toggleIdioma} />;
      case 'contato': return <Contato voltar={() => setPaginaAtual('sumario')} idioma={idioma} toggleIdioma={toggleIdioma} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden relative text-[#2c1e16]" style={{ background: 'radial-gradient(circle at center, #2a2015 0%, #050505 80%)' }}>
      <AnimatePresence mode="wait">
        {!livroAberto ? (
          <motion.div key="capa" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0, rotateY: -90 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="relative w-full max-w-md h-[600px] border-[14px] border-[#2c1e16] rounded-r-3xl rounded-l-md shadow-[30px_30px_30px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-8 z-10" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/leather.png')`, backgroundColor: '#4a3320', backgroundBlendMode: 'multiply' }}>
            <div className="absolute -bottom-16 left-16 w-10 h-24 bg-[#7a0000] shadow-[5px_5px_10px_rgba(0,0,0,0.7)] z-[-1]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 15px), 0 100%)' }}></div>
            <div className="absolute inset-4 border-4 border-[#2c1e16] opacity-80 rounded-r-xl rounded-l-sm shadow-inner pointer-events-none z-0"></div>
            <div className="absolute inset-8 border-2 border-[#2c1e16] opacity-50 rounded-r-lg rounded-l-sm pointer-events-none z-0"></div>
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#1f150f] border-r-4 border-[#120c08] shadow-[10px_0_20px_rgba(0,0,0,0.7)] z-0"></div>
            
            <div className="relative z-20 flex flex-col items-center pl-8">
              <h1 className="text-5xl font-medieval font-bold mb-4 text-[#e8d5a5] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-pre-line">{t.capa.titulo}</h1>
              <p className="text-xl italic mb-16 text-[#c4a661] text-center opacity-90">{t.capa.subtitulo}</p>
              <button onClick={() => setLivroAberto(true)} className="px-8 py-3 bg-[#1f150f] text-[#c4a661] border-2 border-[#c4a661] hover:bg-[#c4a661] hover:text-[#1f150f] transition-all duration-300 font-bold text-lg cursor-pointer uppercase tracking-widest">
                {t.capa.botaoAbrir}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="livro" initial={{ scale: 0.8, opacity: 0, rotateY: 90 }} animate={{ scale: 1, opacity: 1, rotateY: 0 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="w-full max-w-6xl min-h-[85vh] h-[85vh] border-8 border-[#2c1e16] flex flex-col md:flex-row shadow-[40px_40px_50px_rgba(0,0,0,0.95)] rounded-sm relative z-10 text-[#2c1e16]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')`, backgroundColor: '#f4e8d1' }}>
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-transparent via-[rgba(60,30,10,0.15)] to-transparent pointer-events-none z-20"></div>
            <div className="hidden md:block absolute left-1/2 top-0 w-8 h-[105%] bg-[#7a0000] ml-2 z-30 shadow-[3px_0_10px_rgba(0,0,0,0.4)] opacity-95" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 15px), 0 100%)' }}></div>
            <AnimatePresence mode="wait">
              <motion.div key={paginaAtual} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full h-full">
                {renderizarPaginaDupla()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}