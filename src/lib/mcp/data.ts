// Public marketing data for the DestravaUSA MCP tools.
// Mirrors the numbers shown on the landing page.

export const SERVICE_FEE_USD = 280;

export type StateOption = {
  slug: string;
  name: string;
  stateFeeUsd: number;
  note: string;
};

export const STATES: StateOption[] = [
  {
    slug: "wyoming",
    name: "Wyoming",
    stateFeeUsd: 102,
    note: "Registro em cerca de 1 dia útil. Sem imposto estadual sobre a renda da LLC.",
  },
  {
    slug: "novo-mexico",
    name: "Novo México",
    stateFeeUsd: 50,
    note: "Taxa estadual mais baixa e sem relatório anual obrigatório.",
  },
  {
    slug: "florida",
    name: "Flórida",
    stateFeeUsd: 125,
    note: "Boa opção para quem tem operação, cliente ou logística na Flórida.",
  },
  {
    slug: "delaware",
    name: "Delaware",
    stateFeeUsd: 110,
    note: "Preferido por startups que buscam investimento nos EUA.",
  },
];

export const PROCESS_STEPS = [
  "Escolha do estado e do nome da empresa, com checagem de disponibilidade.",
  "Registro da LLC junto ao estado, com registered agent grátis por 1 ano.",
  "Solicitação do EIN (CNPJ americano) junto ao IRS.",
  "Preparação da documentação para abertura de conta bancária/fintech remota.",
];

export const FAQ = [
  {
    question: "O que é a taxa do estado e por que varia?",
    answer:
      "Cada estado americano cobra uma taxa oficial para registrar a LLC. Esse valor é pago diretamente ao estado — não fica com a DestravaUSA — e varia: Wyoming ~US$ 102, Novo México ~US$ 50, Flórida ~US$ 125, Delaware ~US$ 110. O serviço fixo da DestravaUSA é de US$ 280.",
  },
  {
    question: "Preciso ir aos EUA ou ter visto?",
    answer:
      "Não. Todo o processo é remoto e não exige visto, green card ou viagem. Estrangeiros não residentes podem ser donos de 100% de uma LLC.",
  },
  {
    question: "Vou pagar imposto nos EUA?",
    answer:
      "Se você não é residente, não tem estoque em território americano e não tem sócio americano, sua LLC normalmente é isenta de imposto federal — restando apenas a declaração anual obrigatória.",
  },
  {
    question: "Em quanto tempo a empresa fica pronta?",
    answer:
      "Em Wyoming o registro sai em cerca de 1 dia útil. Com EIN emitido, o processo completo leva até 6 dias úteis, dependendo do estado e da fila do IRS.",
  },
  {
    question: "Consigo abrir conta bancária de verdade?",
    answer:
      "Sim. Preparamos toda a documentação e a aplicação em bancos e fintechs que aceitam empresas de não residentes, de forma remota.",
  },
];

export const INCLUDED = [
  "Registro da LLC no estado escolhido",
  "Registered agent grátis por 1 ano",
  "EIN (CNPJ americano) junto ao IRS",
  "Operating Agreement",
  "Apoio na abertura de conta bancária/fintech",
  "Suporte humano em português",
];

export function findState(query: string): StateOption | undefined {
  const normalized = query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return STATES.find((state) => {
    const name = state.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return name === normalized || state.slug === normalized || state.slug.replace(/-/g, " ") === normalized;
  });
}
