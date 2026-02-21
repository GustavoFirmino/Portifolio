import { useState } from 'react';

export function Contato() {
  // Estado para controlar o que o usuário digita no formulário
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  // Função que roda quando o usuário clica em Enviar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    
    // Aqui no futuro podemos integrar o EmailJS para enviar o email de verdade
    console.log("Mensagem enviada pelos corvos:", formData);
    
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000); // O botão volta ao normal depois de 3 segundos
    setFormData({ nome: '', email: '', mensagem: '' }); // Limpa o formulário
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-medieval font-bold mb-8 border-b border-tinta pb-2">
        Capítulo IV: Mensageiros (Contato)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Lado Esquerdo: Links e Currículo */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Envie um Corvo</h3>
          <p className="text-lg mb-6 text-justify">
            A guilda está sempre aberta para novas alianças, missões e trocas de conhecimento. Utilize os pergaminhos abaixo para me encontrar.
          </p>

          <div className="flex flex-col gap-4 mb-8 text-lg">
            <a href="mailto:gustavopessoa00719@gmail.com" className="flex items-center gap-2 hover:font-bold transition-all">
              <span>🦅</span> gustavopessoa00719@gmail.com
            </a>
            <a href="https://wa.me/5531985559698" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:font-bold transition-all">
              <span>💬</span> WhatsApp: (31) 98555-9698
            </a>
            <a href="https://www.linkedin.com/in/gustavo-pessoa-205759239/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:font-bold transition-all">
              <span>📜</span> Meu LinkedIn Oficial
            </a>
            <a href="https://github.com/GustavoFirmino" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:font-bold transition-all">
              <span>🐙</span> GitHub (Grimório de Códigos)
            </a>
          </div>

          <h3 className="text-2xl font-bold mb-4 border-t border-tinta/30 pt-4">Arquivos da Guilda (Download)</h3>
          <div className="flex flex-col gap-3">
            {/* O atributo "download" avisa o navegador para baixar em vez de abrir */}
            <a 
              href="/Currículo_Gustavo_PF_2026.pdf" 
              download 
              className="px-4 py-2 bg-tinta text-pergaminho text-center font-bold hover:bg-opacity-80 transition-colors border-2 border-tinta hover:border-transparent w-full"
            >
              Baixar Currículo (Português) 🇧🇷
            </a>
            <a 
              href="/Currículo_Gustavo_EN_2026.pdf" 
              download 
              className="px-4 py-2 bg-tinta text-pergaminho text-center font-bold hover:bg-opacity-80 transition-colors border-2 border-tinta hover:border-transparent w-full"
            >
              Baixar Resume (English) 🇬🇧
            </a>
          </div>
        </div>

        {/* Lado Direito: Formulário de Contato */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Pergaminho Rápido</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-lg font-bold mb-1" htmlFor="nome">Sua Assinatura (Nome)</label>
              <input 
                type="text" 
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full p-2 bg-[#fdf5e6] border-2 border-tinta focus:outline-none focus:ring-2 focus:ring-tinta/50"
              />
            </div>
            
            <div>
              <label className="block text-lg font-bold mb-1" htmlFor="email">Seu Correio (E-mail)</label>
              <input 
                type="email" 
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 bg-[#fdf5e6] border-2 border-tinta focus:outline-none focus:ring-2 focus:ring-tinta/50"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-1" htmlFor="mensagem">A Mensagem</label>
              <textarea 
                id="mensagem"
                rows={4}
                required
                value={formData.mensagem}
                onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                className="w-full p-2 bg-[#fdf5e6] border-2 border-tinta focus:outline-none focus:ring-2 focus:ring-tinta/50 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="mt-2 px-6 py-3 bg-tinta text-pergaminho font-bold text-lg hover:bg-opacity-80 transition-all cursor-pointer border-2 border-tinta"
            >
              {enviado ? 'Corvo Enviado! 🦅' : 'Enviar Mensagem ✉️'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}