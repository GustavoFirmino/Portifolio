export interface Projeto {
  id: number;
  titulo: { pt: string; en: string };
  data: { pt: string; en: string };
  descricao: { pt: string; en: string };
  tecnologias: string[];
  github: string;
  imagem: string;
  link?: string;
}

export interface Experiencia {
  id: number;
  cargo: { pt: string; en: string };
  instituicao: string | { pt: string; en: string };
  periodo: { pt: string; en: string };
  descricao: { pt: string; en: string };
  emoji: string;
}

export const projetos: Projeto[] = [
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
  },
  {
    id: 3,
    titulo: { pt: "Sistema Moeda Estudantil", en: "Student Coin System" },
    data: { pt: "2024", en: "2024" },
    descricao: {
      pt: "Plataforma de recompensas acadêmicas onde professores concedem moedas a alunos por mérito. Os alunos resgatam as moedas por vantagens em empresas parceiras. Backend robusto com Spring Boot e containerização via Docker.",
      en: "Academic rewards platform where teachers grant coins to students for merit. Students redeem coins for perks at partner companies. Robust backend with Spring Boot and Docker containerization."
    },
    tecnologias: ["Java 21", "Spring Boot 3", "Docker", "PostgreSQL"],
    github: "https://github.com/GustavoFirmino/sistema-moeda-estudantil",
    imagem: "/img-moeda-estudantil.svg"
  },
  {
    id: 4,
    titulo: { pt: "Simulador de Rede TCP/IP", en: "TCP/IP Network Simulator" },
    data: { pt: "2024", en: "2024" },
    descricao: {
      pt: "Simulador de rede que modela o comportamento de protocolos TCP/IP, incluindo roteamento de pacotes, handshake de três vias e fragmentação. Útil para visualizar e compreender a comunicação entre nós de rede.",
      en: "Network simulator that models TCP/IP protocol behavior, including packet routing, three-way handshake, and fragmentation. Useful for visualizing and understanding communication between network nodes."
    },
    tecnologias: ["JavaScript", "Node.js"],
    github: "https://github.com/GustavoFirmino/simulador-de-rede",
    imagem: "/img-simulador-rede.svg"
  },
  {
    id: 5,
    titulo: { pt: "Projetos Swift — HackaTruck", en: "Swift Projects — HackaTruck" },
    data: { pt: "2023", en: "2023" },
    descricao: {
      pt: "Coleção de aplicativos iOS desenvolvidos durante o programa HackaTruck da IBM, uma maratona de inovação tecnológica. Projetos construídos com Swift e Xcode abordando soluções criativas para problemas reais.",
      en: "Collection of iOS apps developed during IBM's HackaTruck program, a technology innovation marathon. Projects built with Swift and Xcode addressing creative solutions to real-world problems."
    },
    tecnologias: ["Swift", "iOS", "Xcode", "IBM"],
    github: "https://github.com/GustavoFirmino/Projetos-Switft-HackaTRuck",
    imagem: "/img-hackatruck.svg"
  },
  {
    id: 6,
    titulo: { pt: "Sistema de Aluguel de Carros", en: "Car Rental System" },
    data: { pt: "2023", en: "2023" },
    descricao: {
      pt: "Sistema web completo para gerenciamento de aluguel de veículos. Permite cadastro de clientes, controle de frota, reservas e geração de contratos. Interface construída com HTML e CSS puro, lógica no servidor com Node.js.",
      en: "Full web system for vehicle rental management. Features customer registration, fleet control, reservations, and contract generation. Interface built with pure HTML and CSS, server logic with Node.js."
    },
    tecnologias: ["JavaScript", "Node.js", "HTML", "CSS"],
    github: "https://github.com/GustavoFirmino/sistema-aluguel-carros",
    imagem: "/img-aluguel-carros.svg"
  },
  {
    id: 7,
    titulo: { pt: "Algoritmos e Est. de Dados II", en: "Algorithms & Data Structures II" },
    data: { pt: "2023", en: "2023" },
    descricao: {
      pt: "Repositório de implementações desenvolvidas na disciplina de AEDS II na PUC Minas. Inclui estruturas como árvores AVL, grafos, tabelas hash e algoritmos de ordenação avançados, todos implementados em Java.",
      en: "Repository of implementations developed in the AEDS II course at PUC Minas. Includes structures like AVL trees, graphs, hash tables, and advanced sorting algorithms, all implemented in Java."
    },
    tecnologias: ["Java", "PUC Minas"],
    github: "https://github.com/GustavoFirmino/AEDS-2",
    imagem: "/img-aeds.svg"
  }
];

export const experiencias: Experiencia[] = [
  {
    id: 1,
    cargo: { pt: "Dev Júnior", en: "Junior Developer" },
    instituicao: "Grupo ROI",
    periodo: { pt: "Mar 2026 – Atual", en: "Mar 2026 – Present" },
    descricao: {
      pt: "Desenvolvimento de funcionalidades fullstack para as plataformas Loot e ROI Club, produtos do Grupo ROI. Atuação com React e Node.js em ambiente ágil, participando do ciclo completo de desenvolvimento — da concepção ao deploy em produção.",
      en: "Full-stack feature development for the Loot and ROI Club platforms, products of Grupo ROI. Working with React and Node.js in an agile environment, participating in the full development cycle — from conception to production deployment."
    },
    emoji: "🚀"
  },
  {
    id: 2,
    cargo: { pt: "Estagiário em Suporte Internacional", en: "International Support Intern" },
    instituicao: "ArcelorMittal Sistemas",
    periodo: { pt: "Fev 2024 – Fev 2026", en: "Feb 2024 – Feb 2026" },
    descricao: {
      pt: "Atuação na linha de frente do suporte internacional de aplicações, realizando a comunicação com clientes globais. Responsável pela análise de incidentes, validação de sistemas e manutenção de documentações técnicas.",
      en: "Frontline international application support, communicating with global clients. Responsible for incident analysis, system validation, and maintenance of technical documentation."
    },
    emoji: "⚒️"
  },
  {
    id: 3,
    cargo: { pt: "Estagiário em TI", en: "IT Intern" },
    instituicao: { pt: "Câmara Mun. de Nova Lima", en: "Nova Lima City Council" },
    periodo: { pt: "Jul 2023 – Jan 2024", en: "Jul 2023 – Jan 2024" },
    descricao: {
      pt: "Prestação de suporte administrativo e técnico durante minha graduação em Ciência da Computação. Auxílio aos processos internos do órgão e organização de documentações.",
      en: "Administrative and technical support during my Computer Science degree. Assistance with internal processes and documentation organization."
    },
    emoji: "🏛️"
  },
  {
    id: 4,
    cargo: { pt: "Atendimento e Operações", en: "Customer Service & Operations" },
    instituicao: "Cacau Show",
    periodo: { pt: "Junho 2020", en: "June 2020" },
    descricao: {
      pt: "Uma breve jornada focada no atendimento ao público e organização comercial. Experiência essencial para desenvolver habilidades de comunicação e resolução rápida de problemas.",
      en: "A brief journey focused on customer service and commercial organization. Essential experience for developing communication and quick problem-solving skills."
    },
    emoji: "🍫"
  }
];
