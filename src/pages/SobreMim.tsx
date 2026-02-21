import { useState } from 'react';

export function SobreMim() {
  const [idioma, setIdioma] = useState<'pt' | 'en'>('pt');

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-6 border-b border-tinta pb-2">
        <h2 className="text-4xl font-medieval font-bold">
          {idioma === 'pt' ? 'Capítulo I: Sobre Mim' : 'Chapter I: About Me'}
        </h2>
        
        <button
          onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')}
          className="px-4 py-1 border-2 border-tinta hover:bg-tinta hover:text-pergaminho transition-all duration-300 text-sm font-bold cursor-pointer"
        >
          {idioma === 'pt' ? 'Read in English 🇬🇧' : 'Ler em Português 🇧🇷'}
        </button>
      </div>

      <div className="text-lg leading-relaxed space-y-4 text-justify">
        {idioma === 'pt' ? (
          <>
            <p>
              Saudações, viajante! Meu nome é <strong>Gustavo Firmino</strong>. Sou um desenvolvedor Fullstack forjado nas artes de criar sistemas web robustos e arquiteturas limpas.
            </p>
            <p>
              Em minha jornada, escolhi como principais armas o <strong>React</strong> para moldar interfaces dinâmicas e interativas, e o <strong>Node.js</strong> com bancos de dados relacionais (como SQLite e Prisma) para sustentar a lógica pesada e a segurança nos bastidores.
            </p>
            <p>
              Sou fascinado por transformar ideias complexas em soluções digitais eficientes. Meu foco atual é evoluir meu grimório de programação, desbravando novos desafios técnicos, construindo APIs escaláveis e garantindo que cada linha de código contribua para uma experiência de usuário épica.
            </p>
          </>
        ) : (
          <>
            <p>
              Greetings, traveler! My name is <strong>Gustavo Firmino</strong>. I am a Fullstack developer forged in the arts of creating robust web systems and clean architectures.
            </p>
            <p>
              In my journey, I have chosen <strong>React</strong> as my main weapon to shape dynamic and interactive interfaces, alongside <strong>Node.js</strong> and relational databases (like SQLite and Prisma) to uphold heavy logic and security behind the scenes.
            </p>
            <p>
              I am fascinated by transforming complex ideas into efficient digital solutions. My current focus is evolving my programming grimoire, braving new technical challenges, building scalable APIs, and ensuring every line of code contributes to an epic user experience.
            </p>
          </>
        )}
      </div>
    </div>
  );
}