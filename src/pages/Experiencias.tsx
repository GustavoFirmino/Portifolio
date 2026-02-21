// Lista de experiências profissionais e acadêmicas
const listaExperiencias = [
  {
    id: 1,
    cargo: "Estagiário em Suporte Internacional de Aplicações",
    instituicao: "ArcelorMittal Sistemas",
    periodo: "Fev 2024 - Fev 2026",
    descricao: "Atuação na linha de frente do suporte internacional de aplicações, realizando a comunicação com clientes globais. Responsável pela análise de incidentes, validação de sistemas e manutenção cuidadosa das documentações técnicas.",
  },
  {
    id: 2,
    cargo: "Estagiário em TI",
    instituicao: "Câmara Municipal de Nova Lima",
    periodo: "Jul 2023 - Jan 2024",
    descricao: "Prestação de suporte administrativo e técnico durante minha graduação em Ciência da Computação. Auxílio contínuo aos processos internos do órgão e organização fundamental de documentações.",
  },
  {
    id: 3,
    cargo: "Atendimento e Operações (Temporário)",
    instituicao: "Cacau Show",
    periodo: "Junho 2020",
    descricao: "Uma breve jornada de um mês focada no atendimento direto ao público e organização comercial. Experiência essencial para desenvolver habilidades de comunicação e resolução rápida de problemas logo antes de ingressar no caminho acadêmico da tecnologia.",
  }
];

export function Experiencias() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-medieval font-bold mb-8 border-b border-tinta pb-2">
        Capítulo III: Jornada Profissional
      </h2>

      <div className="space-y-8">
        {listaExperiencias.map((exp) => (
          <div key={exp.id} className="relative pl-6 border-l-2 border-tinta/50">
            {/* Adorno pontiagudo na lateral */}
            <div className="absolute w-3 h-3 bg-tinta rotate-45 -left-[7px] top-2"></div>
            
            <div className="mb-1 flex flex-col md:flex-row md:items-baseline md:justify-between">
              <h3 className="text-2xl font-medieval font-bold text-tinta">
                {exp.cargo}
              </h3>
              <span className="text-sm italic font-bold text-tinta/80 bg-tinta/10 px-2 py-1 rounded-sm mt-2 md:mt-0 inline-block">
                {exp.periodo}
              </span>
            </div>
            
            <h4 className="text-xl font-bold mb-3 text-tinta/90 flex items-center gap-2">
              <span>🏰</span> {exp.instituicao}
            </h4>
            
            <p className="text-lg leading-relaxed text-justify">
              {exp.descricao}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}