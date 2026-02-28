# Portfólio Profissional - As Crônicas de Gustavo 🗡️📜

**Disciplina:** Laboratório de Desenvolvimento de Software  
**Sprint:** 03 

## 📖 Descrição do Projeto
Este projeto é um website de portfólio profissional interativo, construído com a temática e o design de um **livro épico medieval**. O objetivo é apresentar minha trajetória, habilidades, projetos (artefatos) e formas de contato de maneira criativa, moderna e imersiva. 

Na **Sprint 03**, o foco principal foi a **Magia Visual e Arquitetura Avançada**. O layout foi reestruturado para suportar páginas duplas (simulando um livro físico real) com animações tridimensionais, texturas cinematográficas e um sistema nativo de internacionalização (i18n) construído do zero.

## 🛠️ Tecnologias e Ferramentas Utilizadas
* **Front-end:** React.js com TypeScript (via Vite)
* **Estilização e UI:** Tailwind CSS (tipografia medieval, texturas, blend-modes)
* **Animações e Física:** Framer Motion (abertura da capa e transição de páginas)
* **Serviço de Mensageria:** EmailJS (envio real de formulários)
* **Design/Prototipação:** Figma
* **Hospedagem (Futuro):** Vercel ou Render

## 🖼️ Protótipos e Evolução Visual

Abaixo está a evolução da forja deste artefato, desde os wireframes iniciais até a magia visual aplicada na Sprint 03.

### Wireframes Iniciais (Sprint 01)
![Wireframe da Capa](./docs/wireframe-capa.png)
![Wireframe do Livro](./docs/wireframe-livro-aberto.png)

### O Tomo Atual (Sprint 03)
![Screenshot Atual do Tomo - Tela Incial](./docs/docs/Tela-Inicial.png) 
![Screenshot Atual do Tomo - Índice](./docs/docs/Índice.png)
![Screenshot Atual do Tomo - Sobre mim](./docs/docs/Sobre-mim.png)
![Screenshot Atual do Tomo - Projetos](./docs/docs/Projetos.png)
![Screenshot Atual do Tomo - Jornada](./docs/docs/Jornada.png)
![Screenshot Atual do Tomo - Contatos](./docs/docs/Contato.png)


## ⚙️ Funcionalidades Implementadas (Sprint 03)
O grimório recebeu uma atualização massiva em sua estrutura e imersão:

* **Arquitetura de "Páginas Duplas" (Spreads):** O layout fixo foi substituído por uma arquitetura onde o conteúdo flui organicamente da página esquerda para a direita, preenchendo o livro por completo a cada capítulo.
* **Internacionalização (i18n) Limpa:** Implementação de um dicionário global centralizado. Todo o portfólio é **100% bilíngue (Português 🇧🇷 / English 🇬🇧)**. A preferência do usuário viaja por todo o livro através da elevação de estado (*Lifting State Up*).
* **Texturas e Ambientação Cinematográfica:** * Fundo escuro imitando uma mesa de guilda iluminada por tocha.
  * Capa renderizada com textura de couro velho, selo de cera e lombada em relevo.
  * Páginas com textura de papel creme microporoso e fita de marcação em cetim vermelho (`clip-path`).
* **Tipografia e Detalhes:** Implementação da "Letra Capitular" (primeira letra gigante e desenhada nos textos principais) e paginação fluida nas abas de projetos e experiências.

## 🚀 Como rodar o projeto localmente

1. Clone este repositório (ou baixe a pasta `.zip`):
   ```bash
   git clone [https://github.com/GustavoFirmino/Portifolio.git](https://github.com/GustavoFirmino/Portifolio.git)


2. Acesse a câmara secreta (pasta do projeto) no seu terminal:
   
   cd Portifolio

3. Invoque as dependências padrão do projeto:

   npm install

4. ⚠️ Solução de Problemas (Framer Motion / EmailJS):

   npm install framer-motion @emailjs/browser

5. Certifique-se de que os arquivos PDF do currículo estejam na pasta public.

6. Inicie o servidor de desenvolvimento:

   npm run dev