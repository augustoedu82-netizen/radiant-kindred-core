export type Role = "client" | "admin";

export type CompanyStatus = "em_andamento" | "ativa" | "pendente" | "cancelada";

export type DocumentCategory =
  "societario" | "fiscal" | "contabil" | "bancario" | "cliente" | "outros";

export type Company = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  company_name: string;
  state: string;
  status: CompanyStatus;
  /** Etapa concluída -> data ISO em que foi concluída. */
  steps: Record<string, string | null>;
  ein: string | null;
  filing_number: string | null;
  formation_date: string | null;
  registered_agent: string | null;
  us_address: string | null;
  bank_name: string | null;
  annual_report_due: string | null;
  renewal_due: string | null;
  admin_notes: string | null;
  created_at: string;
};

export type CompanyInput = Pick<
  Company,
  "client_name" | "client_email" | "client_phone" | "company_name" | "state"
>;

export type PortalDocument = {
  id: string;
  company_id: string;
  name: string;
  category: DocumentCategory;
  path: string;
  size: number | null;
  uploaded_by: "admin" | "client";
  internal: boolean;
  created_at: string;
};

export type Task = {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  responsible: "cliente" | "destrava";
  done: boolean;
  created_at: string;
};

export type Update = {
  id: string;
  company_id: string;
  message: string;
  created_at: string;
};

export type Credential = {
  id: string;
  company_id: string;
  service: string;
  url: string | null;
  username: string | null;
  /** Texto cifrado (AES-GCM), nunca a senha em texto puro. */
  secret: string | null;
  notes: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
};
