import type { Company, CompanyStatus, DocumentCategory } from "./types";

export const WHATSAPP = "https://wa.me/18572924040";

export const STEPS = [
  {
    key: "contrato",
    title: "Contrato assinado",
    d: "Contrato de prestação de serviço assinado digitalmente.",
  },
  { key: "pagamento", title: "Pagamento confirmado", d: "Honorários e taxa do estado recebidos." },
  { key: "nome", title: "Nome aprovado", d: "Disponibilidade do nome confirmada no estado." },
  {
    key: "registro",
    title: "LLC registrada no estado",
    d: "Articles of Organization protocolado e aprovado.",
  },
  {
    key: "ein",
    title: "EIN emitido",
    d: 'Número fiscal americano (o "CNPJ" dos EUA) liberado pelo IRS.',
  },
  {
    key: "operating",
    title: "Operating Agreement",
    d: "Contrato social da LLC entregue no portal.",
  },
  { key: "banco", title: "Conta bancária", d: "Aplicação no banco/fintech aprovada." },
  {
    key: "concluido",
    title: "Empresa pronta",
    d: "Tudo entregue. Sua LLC está pronta para operar.",
  },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

export function progressOf(company: Pick<Company, "steps">) {
  const done = STEPS.filter((s) => company.steps?.[s.key]).length;
  const current = STEPS.find((s) => !company.steps?.[s.key]);
  return { done, total: STEPS.length, pct: Math.round((done / STEPS.length) * 100), current };
}

export const STATUS_LABEL: Record<CompanyStatus, string> = {
  em_andamento: "Em andamento",
  ativa: "Ativa",
  pendente: "Aguardando cliente",
  cancelada: "Cancelada",
};

export const STATUS_CLASS: Record<CompanyStatus, string> = {
  em_andamento: "bg-accent text-primary",
  ativa: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
  cancelada: "bg-muted text-muted-foreground",
};

export const CATEGORY_LABEL: Record<DocumentCategory, string> = {
  societario: "Societário",
  fiscal: "Fiscal (IRS)",
  contabil: "Contábil",
  bancario: "Bancário",
  cliente: "Enviados por você",
  outros: "Outros",
};

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export type Obligation = { title: string; date: string | null; d: string };

/** Próximo 15 de abril a partir de hoje (prazo do Form 5472 + 1120 pro forma). */
function nextApril15(today = new Date()) {
  const y =
    today.getMonth() > 3 || (today.getMonth() === 3 && today.getDate() > 15)
      ? today.getFullYear() + 1
      : today.getFullYear();
  return `${y}-04-15`;
}

export function obligationsOf(company: Company): Obligation[] {
  return [
    {
      title: "Annual Report do estado",
      date: company.annual_report_due,
      d: `Relatório anual obrigatório em ${company.state}. Sem ele, a LLC pode ser dissolvida pelo estado.`,
    },
    {
      title: "Renovação do Registered Agent",
      date: company.renewal_due,
      d: "Agente registrado obrigatório por lei. Renovamos junto com a manutenção anual.",
    },
    {
      title: "Form 5472 + 1120 pro forma (IRS)",
      date: nextApril15(),
      d: "Declaração anual obrigatória para LLC de estrangeiro, mesmo sem faturamento. Multa a partir de US$ 25 mil se não entregar.",
    },
  ];
}

export type Tutorial = {
  id: string;
  group: string;
  title: string;
  summary: string;
  steps: string[];
};

export const TUTORIALS: Tutorial[] = [
  {
    id: "mercury",
    group: "Contas bancárias",
    title: "Abrindo conta na Mercury",
    summary: "Banco digital americano que aceita LLC de não residentes, sem taxa mensal.",
    steps: [
      'Acesse mercury.com e clique em "Open account".',
      "Informe o nome exato da LLC, o estado de registro e o EIN.",
      "Envie o Articles of Organization, o EIN Letter (CP 575 ou 147C) e o Operating Agreement — todos estão na aba Documentos.",
      "Envie foto do passaporte e faça a verificação por selfie.",
      'Descreva a atividade da empresa em inglês simples (ex.: "E-commerce selling home goods to US customers").',
      "Aguarde a análise (geralmente de 3 a 10 dias úteis). Se pedirem algo, fale com a gente antes de responder.",
    ],
  },
  {
    id: "relay",
    group: "Contas bancárias",
    title: "Abrindo conta na Relay",
    summary: "Alternativa à Mercury, boa para separar o dinheiro em várias subcontas.",
    steps: [
      'Acesse relayfi.com e escolha "Get started".',
      "Preencha os dados da LLC e do sócio (você) exatamente como estão no Articles of Organization.",
      "Anexe EIN Letter, Articles of Organization e passaporte.",
      "Use o endereço americano da empresa que está na aba Início.",
      "Aguarde a aprovação e ative o cartão de débito virtual.",
    ],
  },
  {
    id: "wise",
    group: "Contas bancárias",
    title: "Wise Business",
    summary: "Para receber em dólar e mandar para o Brasil com câmbio baixo.",
    steps: [
      'Crie a conta em wise.com/business e escolha "Business".',
      "Cadastre a LLC com EIN, estado e endereço americano.",
      "Envie o Articles of Organization e o passaporte.",
      "Pague a taxa única de ativação dos dados bancários em USD, se solicitada.",
      "Com a conta aprovada, use os dados de conta em USD para receber de clientes e gateways.",
    ],
  },
  {
    id: "payoneer",
    group: "Contas bancárias",
    title: "Payoneer",
    summary: "Muito usada para receber de marketplaces (Amazon, Walmart, etc.).",
    steps: [
      'Cadastre-se em payoneer.com como "Company".',
      "Informe os dados da LLC e o EIN.",
      "Envie documentos da empresa e do sócio quando solicitado.",
      "Conecte a conta Payoneer ao marketplace em que você vende.",
    ],
  },
  {
    id: "stripe",
    group: "Gateways de pagamento",
    title: "Configurando o Stripe",
    summary: "Receba cartão de crédito do mundo todo direto no seu site ou link de pagamento.",
    steps: [
      "Crie a conta em stripe.com com o país United States.",
      'Em tipo de empresa escolha "LLC" e informe o nome exato e o EIN.',
      "Use o endereço americano da empresa (não use o endereço do Brasil).",
      "Em representante, preencha seus dados e o passaporte. SSN não é obrigatório para estrangeiro.",
      "Conecte a conta bancária americana (Mercury, Relay ou Wise) para receber os saques.",
      "Tenha um site com política de reembolso, termos de uso e contato. É o motivo nº 1 de bloqueio.",
    ],
  },
  {
    id: "paypal",
    group: "Gateways de pagamento",
    title: "PayPal Business",
    summary: "Útil para clientes que só pagam com PayPal.",
    steps: [
      "Crie uma conta Business em paypal.com/us (país: Estados Unidos).",
      "Informe a LLC, o EIN e o endereço americano.",
      "Vincule a conta bancária americana e confirme os microdepósitos.",
      "Complete a verificação de identidade com o passaporte.",
    ],
  },
  {
    id: "shopify",
    group: "Gateways de pagamento",
    title: "Shopify Payments",
    summary: "Checkout nativo da Shopify, sem depender de gateway brasileiro.",
    steps: [
      "Na Shopify, vá em Settings > Store details e coloque o endereço americano da LLC.",
      "Em Settings > Payments, ative o Shopify Payments.",
      "Preencha os dados da LLC (nome, EIN) e os seus como representante.",
      "Adicione a conta bancária americana para receber os repasses.",
    ],
  },
  {
    id: "ein-letter",
    group: "Fiscal e contábil",
    title: "O que é o EIN Letter (CP 575 / 147C)",
    summary: "A carta do IRS que comprova o número fiscal da sua empresa.",
    steps: [
      "O CP 575 é a carta enviada quando o EIN é criado. O 147C é a segunda via.",
      "Bancos e gateways quase sempre pedem esse documento.",
      "Ele fica salvo na aba Documentos, categoria Fiscal (IRS).",
      "Nunca compartilhe o EIN em grupos ou sites que não sejam o banco ou o gateway.",
    ],
  },
  {
    id: "form-5472",
    group: "Fiscal e contábil",
    title: "Form 5472: a declaração anual",
    summary: "Obrigatória para LLC de estrangeiro, mesmo sem faturamento.",
    steps: [
      "Toda LLC de um sócio estrangeiro precisa entregar o Form 5472 junto com o 1120 pro forma.",
      "O prazo é 15 de abril de cada ano, referente ao ano anterior.",
      "A multa por não entregar começa em US$ 25 mil, então não deixe passar.",
      "Guarde extratos e comprovantes do ano para facilitar o preenchimento.",
      "Fale com a gente para incluir a declaração no pacote anual.",
    ],
  },
  {
    id: "annual-report",
    group: "Fiscal e contábil",
    title: "Annual Report do estado",
    summary: "O relatório anual que mantém sua LLC ativa.",
    steps: [
      "Cada estado tem sua data e taxa. A data da sua empresa aparece na aba Fiscal e contábil.",
      "Se o relatório não for entregue, o estado pode dissolver a LLC.",
      "A Destrava USA cuida do preenchimento quando você renova a manutenção anual.",
    ],
  },
];
