import { useState } from 'react'
import { SobreMim } from './pages/SobreMim'
import { Projetos } from './pages/Projetos'
import { Experiencias } from './pages/Experiencias'
import { Contato } from './pages/Contato'

function App() {
  // Esse estado controla se o livro está na Capa (false) ou Aberto (true)
  const [livroAberto, setLivroAberto] = useState(false)

  // Esse estado controla qual página do Sumário estamos lendo
  const [paginaAtual, setPaginaAtual] = useState('sobre_mim')

  return (
    // Essa div garante que a tela toda pegue nossa cor de pergaminho
    <div className="min-h-screen bg-pergaminho text-tinta font-texto flex items-center justify-center p-4">
      
      {/* SE O LIVRO ESTIVER FECHADO -> MOSTRA A CAPA */}
      {!livroAberto ? (
        <div className="text-center border-4 border-tinta p-12 rounded-sm max-w-lg w-full shadow-2xl bg-[#e8d5a5]">
          <h1 className="text-5xl font-medieval font-bold mb-4">As Crônicas de Gustavo</h1>
          <p className="text-xl italic mb-8">Um portfólio de código, suor e glória.</p>
          
          <button 
            onClick={() => setLivroAberto(true)}
            className="px-6 py-3 border-2 border-tinta hover:bg-tinta hover:text-pergaminho transition-all duration-300 font-bold text-lg cursor-pointer"
          >
            Abrir o Tomo
          </button>
        </div>
      ) : (
        
      /* SE O LIVRO ESTIVER ABERTO -> MOSTRA O LAYOUT DO LIVRO */
        <div className="w-full max-w-6xl min-h-[80vh] border-2 border-tinta flex flex-col md:flex-row shadow-2xl bg-[#fdf5e6]">
          
          {/* PÁGINA ESQUERDA (O SUMÁRIO) */}
          <nav className="w-full md:w-1/3 border-b-2 md:border-b-0 md:border-r-2 border-tinta p-8 flex flex-col">
            <h2 className="text-3xl font-medieval font-bold mb-6 border-b border-tinta pb-2">Sumário</h2>
            <ul className="flex flex-col gap-4 text-xl">
              <li>
                <button onClick={() => setPaginaAtual('sobre_mim')} className="hover:font-bold text-left w-full cursor-pointer">
                  I. Sobre Mim
                </button>
              </li>
              <li>
                <button onClick={() => setPaginaAtual('projetos')} className="hover:font-bold text-left w-full cursor-pointer">
                  II. Crônicas de Projetos
                </button>
              </li>
              <li>
                <button onClick={() => setPaginaAtual('experiencias')} className="hover:font-bold text-left w-full cursor-pointer">
                  III. Jornada Profissional
                </button>
              </li>
              <li>
                <button onClick={() => setPaginaAtual('contato')} className="hover:font-bold text-left w-full cursor-pointer">
                  IV. Mensageiros (Contato)
                </button>
              </li>
            </ul>
            
            <button 
              onClick={() => setLivroAberto(false)}
              className="mt-auto pt-8 text-sm italic hover:underline cursor-pointer"
            >
              Fechar o livro
            </button>
          </nav>

          {/* PÁGINA DIREITA (O CONTEÚDO DINÂMICO) */}
          <main className="w-full md:w-2/3 p-8">
            {paginaAtual === 'sobre_mim' && (
              <SobreMim />
            )}

            {paginaAtual === 'projetos' && (
              <Projetos />
            )}
            
            {/* Adicionaremos os outros componentes depois */}
            {paginaAtual === 'experiencias' && (
              <Experiencias />
            )}
            
            {paginaAtual === 'contato' && (
              <Contato />
            )}
          </main>
        </div>
      )}
    </div>
  )
}

export default App