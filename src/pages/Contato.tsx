import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { dicionario } from '../dicionario';

interface ContatoProps {
  voltar: () => void;
  idioma: 'pt' | 'en';
  toggleIdioma: () => void;
}

export function Contato({ voltar, idioma, toggleIdioma }: ContatoProps) {
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Puxamos as traduções
  const t = dicionario[idioma];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    setCarregando(true);
    const templateParams = { nome: formData.nome, email: formData.email, mensagem: formData.mensagem };

    emailjs.send('service_qb3jail', 'template_sp9e5tu', templateParams, 'glAb3wFpmONFLHLAL')
    .then(() => {
      setEnviado(true); setCarregando(false); setFormData({ nome: '', email: '', mensagem: '' });
      setTimeout(() => setEnviado(false), 4000);
    }).catch(() => { setCarregando(false); alert(t.contato.erroMagia); });
  };

  return (
    <div className="flex w-full h-full">
      {/* ===== PÁGINA ESQUERDA ===== */}
      <div className="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-[1px] border-[#2c1e16]/20 p-8 md:p-12 flex flex-col relative">
        <button onClick={voltar} className="self-start text-lg font-bold hover:text-[#7a0000] hover:-translate-x-2 transition-transform cursor-pointer mb-8 flex items-center gap-2">
          {t.geral.voltarSumario}
        </button>

        {/* CABEÇALHO RESOLVIDO: Título e Botão lado a lado */}
        <div className="flex justify-between items-start mb-6 gap-4 border-b-2 border-[#5c1616] pb-2">
          <h2 className="text-4xl font-medieval font-bold text-[#2c1e16] leading-none">
            {t.contato.titulo}
          </h2>
          <button onClick={toggleIdioma} className="px-3 py-1 border border-[#2c1e16] hover:bg-[#2c1e16] hover:text-[#f4e8d1] transition-all text-sm font-bold cursor-pointer rounded-sm shrink-0 mt-1">
            {t.geral.botaoIdioma}
          </button>
        </div>

        <p className="text-lg mb-8 text-justify">{t.contato.descricao}</p>

        <div className="flex flex-col gap-4 mb-10 text-lg font-medium">
          <a href="mailto:gustavopessoa00719@gmail.com" className="flex items-center gap-3 hover:text-[#5c1616] hover:translate-x-1 transition-all"><span>🦅</span> gustavopessoa00719@gmail.com</a>
          <a href="https://wa.me/5531985559698" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#5c1616] hover:translate-x-1 transition-all"><span>💬</span> WhatsApp: (31) 98555-9698</a>
          <a href="https://linkedin.com/in/SEU-LINKEDIN" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#5c1616] hover:translate-x-1 transition-all"><span>📜</span> {t.contato.linkedin}</a>
          <a href="https://github.com/GustavoFirmino" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#5c1616] hover:translate-x-1 transition-all"><span>🐙</span> {t.contato.github}</a>
        </div>

        <h3 className="text-2xl font-bold mb-4 border-t border-[#2c1e16]/20 pt-6 text-[#5c1616]">{t.contato.baixarArquivos}</h3>
        <div className="flex flex-col gap-3">
          <a href="/Curriculo_Gustavo_PT.pdf" download className="px-4 py-2 bg-[#f4e8d1] text-[#2c1e16] text-center font-bold hover:bg-[#e8d5a5] transition-colors border-2 border-[#2c1e16] w-full shadow-sm">
            {t.contato.curriculo}
          </a>
        </div>
      </div>

      {/* ===== PÁGINA DIREITA ===== */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative justify-center">
        <h3 className="text-3xl font-medieval font-bold mb-6 text-[#5c1616]">{t.contato.formularioTitulo}</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 justify-center">
          <div>
            <label className="block text-lg font-bold mb-1 text-[#2c1e16]" htmlFor="nome">{t.contato.labelNome}</label>
            <input type="text" id="nome" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full p-3 bg-[#e8d5a5]/30 border-2 border-[#2c1e16] focus:outline-none focus:ring-2 focus:ring-[#5c1616]/50 transition-all font-medium" />
          </div>
          
          <div>
            <label className="block text-lg font-bold mb-1 text-[#2c1e16]" htmlFor="email">{t.contato.labelEmail}</label>
            <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-[#e8d5a5]/30 border-2 border-[#2c1e16] focus:outline-none focus:ring-2 focus:ring-[#5c1616]/50 transition-all font-medium" />
          </div>

          <div>
            <label className="block text-lg font-bold mb-1 text-[#2c1e16]" htmlFor="mensagem">{t.contato.labelMensagem}</label>
            <textarea id="mensagem" rows={5} required value={formData.mensagem} onChange={(e) => setFormData({...formData, mensagem: e.target.value})} className="w-full p-3 bg-[#e8d5a5]/30 border-2 border-[#2c1e16] focus:outline-none focus:ring-2 focus:ring-[#5c1616]/50 resize-none transition-all font-medium"></textarea>
          </div>

          <button type="submit" disabled={carregando} className={`mt-4 px-6 py-4 font-bold text-lg transition-all border-2 border-[#2c1e16] shadow-lg ${ carregando ? 'bg-[#2c1e16]/50 text-[#f4e8d1] cursor-wait' : 'bg-[#2c1e16] text-[#f4e8d1] hover:bg-[#5c1616] cursor-pointer' }`}>
            {carregando ? t.contato.btnEnviando : enviado ? t.contato.btnEnviado : t.contato.btnEnviar}
          </button>
        </form>
      </div>
    </div>
  );
}