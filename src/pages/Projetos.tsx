import { useState } from 'react';

// Aqui fica a lista dos seus projetos mágicos. Fica fácil adicionar mais depois!
const listaProjetos = [
  {
    id: 1,
    titulo: "O Épico Portfólio (Este Tomo)",
    data: "Fevereiro 2026",
    descricao: "Um website interativo com temática medieval, desenvolvido em formato de livro épico para apresentar minha jornada profissional, substituindo a rolagem comum por uma navegação imersiva.",
    tecnologias: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    github: "https://github.com/GustavoFirmino/Portifolio",
    imagem: "https://via.placeholder.com/600x300.png?text=Capa+do+Livro+(GIF+em+breve)" 
  },
  {
    id: 2,
    titulo: "Sistema Fullstack: Carrinho e Estoque",
    data: "Janeiro 2026",
    descricao: "Uma plataforma robusta com carrinho de compras e controle de estoque. Desenvolvida com arquitetura em camadas (MVC/Services) no backend para garantir regras de negócio complexas, como limites de itens.",
    tecnologias: ["Node.js", "Express", "Prisma ORM", "SQLite", "React", "Context API"],
    github: "#", // Depois você coloca o link do repositório desse projeto
    imagem: "https://via.placeholder.com/600x300.png?text=E-commerce+(Imagem+em+breve)"
  }
];

export function Projetos() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-medieval font-bold mb-8 border-b border-tinta pb-2">
        Capítulo II: Crônicas de Projetos
      </h2>
      
      {/* A Linha Vertical da Timeline */}
      <div className="relative border-l-4 border-tinta ml-4 space-y-12 pb-8">
        
        {listaProjetos.map((proj) => (
          <div key={proj.id} className="pl-8 relative">
            {/* O "Ponto" da linha do tempo */}
            <div className="absolute w-5 h-5 bg-pergaminho border-4 border-tinta rounded-full -left-[12px] top-2"></div>
            
            {/* O Card do Projeto (Como se fosse um recado colado no pergaminho) */}
            <div className="bg-[#e8d5a5] p-6 border-2 border-tinta rounded-sm shadow-lg">
              <span className="text-sm font-bold bg-tinta text-pergaminho px-3 py-1 rounded-sm mb-4 inline-block">
                {proj.data}
              </span>
              
              <h3 className="text-3xl font-medieval font-bold mb-2">{proj.titulo}</h3>
              <p className="text-lg mb-4 text-justify">{proj.descricao}</p>
              
              {/* Badges de Tecnologias */}
              <div className="mb-6 flex flex-wrap gap-2">
                {proj.tecnologias.map(tech => (
                  <span key={tech} className="text-sm font-bold border-2 border-tinta px-2 py-1 bg-pergaminho">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Caixa da Imagem com Efeito de "Pintura Antiga" (Preto e Branco que fica colorido ao passar o mouse) */}
              <div className="border-4 border-tinta mb-6 overflow-hidden">
                <img 
                  src={proj.imagem} 
                  alt={`Preview de ${proj.titulo}`} 
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                />
              </div>
              
              {/* Botão do GitHub */}
              <a 
                href={proj.github} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-block px-6 py-2 bg-tinta text-pergaminho font-bold hover:bg-opacity-80 transition-colors border-2 border-tinta hover:border-transparent"
              >
                Inspecionar Código (GitHub) 📜
              </a>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}