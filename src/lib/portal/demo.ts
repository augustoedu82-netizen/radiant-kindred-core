// Dados fictícios do modo demonstração (sem Supabase). Ficam só na memória da aba.
import type { Company, Credential, PortalDocument, Task, Update } from "./types";

export const DEMO_CLIENT_EMAIL = "cliente@exemplo.com";

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const companies: Company[] = [
  {
    id: "demo-1",
    client_name: "Mariana Costa",
    client_email: DEMO_CLIENT_EMAIL,
    client_phone: "+55 31 99999-0001",
    company_name: "Costa Global Trade LLC",
    state: "Wyoming",
    status: "em_andamento",
    steps: {
      contrato: day(-9),
      pagamento: day(-9),
      nome: day(-8),
      registro: day(-6),
      ein: day(-1),
    },
    ein: "88-1234567",
    filing_number: "2026-001234567",
    formation_date: day(-6),
    registered_agent: "Registered Agents Inc.",
    us_address: "30 N Gould St, Ste R, Sheridan, WY 82801",
    bank_name: null,
    annual_report_due: day(359),
    renewal_due: day(359),
    admin_notes: "Quer vender na Amazon EUA. Oferecer pacote do Form 5472.",
    created_at: day(-10),
  },
  {
    id: "demo-2",
    client_name: "Rafael Souza",
    client_email: "rafael@exemplo.com",
    client_phone: "+1 508 555-0102",
    company_name: "RS Painting Services LLC",
    state: "Massachusetts",
    status: "ativa",
    steps: Object.fromEntries(
      ["contrato", "pagamento", "nome", "registro", "ein", "operating", "banco", "concluido"].map(
        (k) => [k, day(-300)],
      ),
    ),
    ein: "88-7654321",
    filing_number: "001598765",
    formation_date: day(-310),
    registered_agent: "Northwest Registered Agent",
    us_address: "Framingham, MA",
    bank_name: "Mercury",
    annual_report_due: day(42),
    renewal_due: day(55),
    admin_notes: "Annual report chegando. Mandar mensagem de renovação.",
    created_at: day(-320),
  },
  {
    id: "demo-3",
    client_name: "Juliana Lima",
    client_email: "juliana@exemplo.com",
    client_phone: "+55 11 98888-0003",
    company_name: "Lima Digital Holdings LLC",
    state: "New Mexico",
    status: "pendente",
    steps: { contrato: day(-3), pagamento: day(-3) },
    ein: null,
    filing_number: null,
    formation_date: null,
    registered_agent: null,
    us_address: null,
    bank_name: null,
    annual_report_due: null,
    renewal_due: null,
    admin_notes: "Aguardando foto do passaporte.",
    created_at: day(-4),
  },
];

const documents: PortalDocument[] = [
  {
    id: "doc-1",
    company_id: "demo-1",
    name: "Articles of Organization.pdf",
    category: "societario",
    path: "",
    size: 184_000,
    uploaded_by: "admin",
    internal: false,
    created_at: day(-6),
  },
  {
    id: "doc-2",
    company_id: "demo-1",
    name: "EIN Letter CP 575.pdf",
    category: "fiscal",
    path: "",
    size: 96_000,
    uploaded_by: "admin",
    internal: false,
    created_at: day(-1),
  },
  {
    id: "doc-3",
    company_id: "demo-1",
    name: "Contrato Destrava USA.pdf",
    category: "outros",
    path: "",
    size: 210_000,
    uploaded_by: "admin",
    internal: false,
    created_at: day(-9),
  },
  {
    id: "doc-4",
    company_id: "demo-1",
    name: "Passaporte.jpg",
    category: "cliente",
    path: "",
    size: 1_200_000,
    uploaded_by: "client",
    internal: false,
    created_at: day(-9),
  },
  {
    id: "doc-5",
    company_id: "demo-2",
    name: "Operating Agreement.pdf",
    category: "societario",
    path: "",
    size: 150_000,
    uploaded_by: "admin",
    internal: false,
    created_at: day(-300),
  },
];

const tasks: Task[] = [
  {
    id: "t-1",
    company_id: "demo-1",
    title: "Enviar comprovante de endereço do Brasil",
    description: "Conta de luz ou extrato bancário dos últimos 90 dias. Pode ser PDF ou foto.",
    due_date: day(3),
    responsible: "cliente",
    done: false,
    created_at: day(-1),
  },
  {
    id: "t-2",
    company_id: "demo-1",
    title: "Preparar Operating Agreement",
    description: null,
    due_date: day(2),
    responsible: "destrava",
    done: false,
    created_at: day(-1),
  },
  {
    id: "t-3",
    company_id: "demo-3",
    title: "Enviar foto do passaporte",
    description: "Foto nítida da página com seus dados.",
    due_date: day(1),
    responsible: "cliente",
    done: false,
    created_at: day(-3),
  },
  {
    id: "t-4",
    company_id: "demo-2",
    title: "Preencher Annual Report 2026",
    description: null,
    due_date: day(40),
    responsible: "destrava",
    done: false,
    created_at: day(-2),
  },
];

const updates: Update[] = [
  {
    id: "u-1",
    company_id: "demo-1",
    message: "Seu EIN saiu! A carta do IRS já está na aba Documentos.",
    created_at: day(-1),
  },
  {
    id: "u-2",
    company_id: "demo-1",
    message: "LLC aprovada pelo estado de Wyoming. Agora vamos pedir o EIN ao IRS.",
    created_at: day(-6),
  },
  {
    id: "u-3",
    company_id: "demo-1",
    message: "Bem-vinda à Destrava USA! Seu processo começou.",
    created_at: day(-9),
  },
];

const credentials: Credential[] = [];
const settings = new Map<string, string>();

export const demoDb = { companies, documents, tasks, updates, credentials, settings };
