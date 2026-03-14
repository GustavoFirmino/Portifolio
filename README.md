# Portfólio Profissional - As Crônicas de Gustavo 🗡️📜

**Disciplina:** Laboratório de Desenvolvimento de Software  
**Autor:** Gustavo Firmino  
**Sprint:** 03 (Entrega Final)

## 🔗 Acesso ao Tomo (Deploy na Nuvem)
O grimório está forjado e hospedado na nuvem. Acesse o projeto em produção através do link abaixo:

https://portifolio-rho-beige-65.vercel.app/

## 📖 Descrição do Projeto
Este projeto é um website de portfólio profissional interativo, construído com a temática e o design de um **livro épico medieval**. O objetivo é apresentar minha trajetória, habilidades, artefatos (projetos) e formas de contato de maneira criativa, moderna e imersiva. 

Substituímos a rolagem tradicional da web por uma navegação imersiva em "páginas duplas", incluindo um sistema nativo de internacionalização (PT/EN) e texturas cinematográficas para simular um pergaminho real.

## 🛠️ Tecnologias e Dependências
O arsenal utilizado para a forja deste artefato inclui:
* **Front-end:** React.js com TypeScript
* **Bundler:** Vite
* **Estilização e UI:** Tailwind CSS (tipografia medieval, texturas e capitulares)
* **Animações e Física:** `framer-motion` (para o efeito de virar as páginas e transições suaves)
* **Mensageria:** `@emailjs/browser` (para o envio real de formulários direto do front-end)
* **Design/Prototipação:** Figma
* **Hospedagem em Nuvem:** Vercel

## 🖼️ Evolução Visual (Protótipos vs. Realidade)
Abaixo está a evolução do projeto, desde os wireframes iniciais (Sprint 01) até a forja final (Sprint 03).

### Wireframes Iniciais (Sprint 01)
![Wireframe da Capa](./docs/wireframe-capa.png)
![Wireframe do Livro](./docs/wireframe-livro-aberto.png)

### O Tomo Atual (Sprint 03)
![GIF Atual do Tomo](./public/portifolio-ezgif.com-video-to-gif-converter.gif) 

## 📂 Estrutura de Diretórios
```text
Portifolio/
├── public/                 # Arquivos públicos estáticos (Não processados pelo Vite)
│   ├── projeto-portfolio.png  # Artefato 1
│   ├── projeto-estoque.gif    # Artefato 2 animado
│   └── curriculo.pdf          # Seu CV para download
│
├── src/                    # O "Coração" da aplicação (Código-fonte)
│   ├── pages/              # Componentes isolados de cada capítulo do livro
│   │   ├── SobreMim.tsx       # Lógica e layout da aba "Sobre Mim"
│   │   ├── Projetos.tsx       # Componente com paginação e imagens dos artefatos
│   │   ├── Experiencias.tsx   # Paginação matemática inteligente das vivências
│   │   └── Contato.tsx        # Formulário integrado com EmailJS
│   │
│   ├── App.tsx             # Componente Raiz: Gerencia o estado da capa e renderiza as páginas
│   ├── dicionario.ts       # Motor de Internacionalização (Traduções PT/EN)
│   ├── index.css           # Injeção do Tailwind e customizações globais de CSS
│   ├── main.tsx            # Ponto de entrada do React (Injeta o App no HTML)
│   └── vite-env.d.ts       # Declaração de tipagens do ambiente Vite
│
├── docs/                   # Documentação auxiliar para o GitHub
│   ├── wireframe-capa.png
│   └── wireframe-livro-aberto.png
│
├── .gitignore              # Impede que o 'node_modules' e a pasta 'dist' subam pro GitHub
├── index.html              # O esqueleto HTML único (Single Page Application)
├── package.json            # Lista de dependências (React, Framer Motion, EmailJS, etc.)
├── package-lock.json       # Árvore de versões exatas das bibliotecas
├── tailwind.config.js      # Configuração visual (Cores de pergaminho, fontes medievais)
├── tsconfig.json           # Regras rigorosas do compilador TypeScript
└── vite.config.ts          # Configurações do motor de build (Vite)

```

## 🚀 Como rodar o projeto localmente

Para inspecionar o código e abrir o livro em sua própria máquina, siga os passos:

1. Clone este repositório:
   ```bash
   git clone [https://github.com/GustavoFirmino/Portifolio.git](https://github.com/GustavoFirmino/Portifolio.git)

2. Acesse a pasta do projeto:
   
   cd Portifolio

3. Invoque as dependências padrão:
   
   npm install

4. ⚠️ Solução de Problemas: Caso tenha baixado o projeto via .zip direto do GitHub e o terminal retorne um erro informando a falta de dependências (como framer-motion), assegure a instalação das bibliotecas externas rodando:
   
   npm install framer-motion @emailjs/browser

5. Inicie o servidor de desenvolvimento:
   
   npm run dev

6. Acesse o link gerado no terminal (geralmente http://localhost:5173).

