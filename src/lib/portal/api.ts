// Camada de dados do portal. Com Supabase configurado usa o banco real;
// sem ele, usa os dados fictícios de demo.ts.
import { BUCKET, isSupabaseConfigured, supabase } from "./supabase";
import { DEMO_CLIENT_EMAIL, demoDb } from "./demo";
import type {
  Company,
  CompanyInput,
  Credential,
  DocumentCategory,
  PortalDocument,
  Task,
  Update,
} from "./types";

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const demoFiles = new Map<string, string>();

async function run<T>(query: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as T;
}

const byDateDesc = <T extends { created_at: string }>(a: T, b: T) =>
  b.created_at.localeCompare(a.created_at);

// Notas internas vivem em company_notes (só o admin lê); aqui elas voltam para o objeto Company.
const WITH_NOTES = "*, company_notes(notes)";
type NotesRow = { notes: string };
type CompanyRow = Omit<Company, "admin_notes"> & { company_notes: NotesRow | NotesRow[] | null };
const withNotes = ({ company_notes, ...c }: CompanyRow): Company => {
  const notes = Array.isArray(company_notes) ? company_notes[0] : company_notes;
  return { ...c, admin_notes: notes?.notes ?? null };
};

// ---------------------------------------------------------------------------
// Empresas
// ---------------------------------------------------------------------------
export async function listCompanies(): Promise<Company[]> {
  if (!isSupabaseConfigured) return [...demoDb.companies].sort(byDateDesc);
  const rows = await run<CompanyRow[]>(
    supabase().from("companies").select(WITH_NOTES).order("created_at", { ascending: false }),
  );
  return rows.map(withNotes);
}

export async function listMyCompanies(email: string): Promise<Company[]> {
  if (!isSupabaseConfigured) {
    return demoDb.companies.filter((c) => c.client_email === (email || DEMO_CLIENT_EMAIL));
  }
  // O RLS já filtra pelo e-mail do usuário logado.
  return run(supabase().from("companies").select("*").order("created_at", { ascending: true }));
}

export async function getCompany(id: string): Promise<Company | null> {
  if (!isSupabaseConfigured) return demoDb.companies.find((c) => c.id === id) ?? null;
  const row = await run<CompanyRow | null>(
    supabase().from("companies").select(WITH_NOTES).eq("id", id).maybeSingle(),
  );
  return row && withNotes(row);
}

export async function createCompany(input: CompanyInput): Promise<Company> {
  const row = { ...input, client_email: input.client_email.trim().toLowerCase() };
  if (!isSupabaseConfigured) {
    const company: Company = {
      ...row,
      id: uid(),
      status: "em_andamento",
      steps: {},
      ein: null,
      filing_number: null,
      formation_date: null,
      registered_agent: null,
      us_address: null,
      bank_name: null,
      annual_report_due: null,
      renewal_due: null,
      admin_notes: null,
      created_at: now(),
    };
    demoDb.companies.push(company);
    return company;
  }
  return {
    ...(await run<Company>(supabase().from("companies").insert(row).select().single())),
    admin_notes: null,
  };
}

export async function updateCompany(id: string, patch: Partial<Company>): Promise<Company> {
  if (!isSupabaseConfigured) {
    const c = demoDb.companies.find((x) => x.id === id)!;
    Object.assign(c, patch);
    return c;
  }
  const { admin_notes, ...rest } = patch;
  if (admin_notes !== undefined) {
    await run(
      supabase()
        .from("company_notes")
        .upsert({ company_id: id, notes: admin_notes ?? "" }),
    );
  }
  const row = await run<CompanyRow>(
    supabase().from("companies").update(rest).eq("id", id).select(WITH_NOTES).single(),
  );
  return withNotes(row);
}

export async function deleteCompany(id: string) {
  if (!isSupabaseConfigured) {
    demoDb.companies.splice(
      demoDb.companies.findIndex((c) => c.id === id),
      1,
    );
    return;
  }
  const docs = await listDocuments(id);
  if (docs.length)
    await supabase()
      .storage.from(BUCKET)
      .remove(docs.map((d) => d.path));
  await run(supabase().from("companies").delete().eq("id", id));
}

// ---------------------------------------------------------------------------
// Documentos
// ---------------------------------------------------------------------------
export async function listDocuments(companyId: string): Promise<PortalDocument[]> {
  if (!isSupabaseConfigured)
    return demoDb.documents.filter((d) => d.company_id === companyId).sort(byDateDesc);
  return run(
    supabase()
      .from("documents")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
  );
}

export async function uploadDocument(
  companyId: string,
  file: File,
  opts: { category: DocumentCategory; uploadedBy: "admin" | "client"; internal?: boolean },
): Promise<PortalDocument> {
  const safeName = file.name.normalize("NFD").replace(/[^\w.-]+/g, "_");
  const path = `${companyId}/${uid()}-${safeName}`;
  const row = {
    company_id: companyId,
    name: file.name,
    category: opts.category,
    path,
    size: file.size,
    uploaded_by: opts.uploadedBy,
    internal: opts.internal ?? false,
  };
  if (!isSupabaseConfigured) {
    demoFiles.set(path, URL.createObjectURL(file));
    const doc = { ...row, id: uid(), created_at: now() };
    demoDb.documents.push(doc);
    return doc;
  }
  const { error } = await supabase()
    .storage.from(BUCKET)
    .upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return run(supabase().from("documents").insert(row).select().single());
}

export async function updateDocument(
  id: string,
  patch: Partial<Pick<PortalDocument, "category" | "internal" | "name">>,
) {
  if (!isSupabaseConfigured) {
    Object.assign(
      demoDb.documents.find((d) => d.id === id)!,
      patch,
    );
    return;
  }
  await run(supabase().from("documents").update(patch).eq("id", id));
}

export async function deleteDocument(doc: PortalDocument) {
  if (!isSupabaseConfigured) {
    demoDb.documents.splice(
      demoDb.documents.findIndex((d) => d.id === doc.id),
      1,
    );
    return;
  }
  await supabase().storage.from(BUCKET).remove([doc.path]);
  await run(supabase().from("documents").delete().eq("id", doc.id));
}

/** Link temporário (5 min) para abrir ou baixar o arquivo. */
export async function documentUrl(doc: PortalDocument): Promise<string | null> {
  if (!isSupabaseConfigured) return demoFiles.get(doc.path) ?? null;
  const { data, error } = await supabase().storage.from(BUCKET).createSignedUrl(doc.path, 300);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

// ---------------------------------------------------------------------------
// Pendências
// ---------------------------------------------------------------------------
export async function listTasks(companyId?: string): Promise<Task[]> {
  if (!isSupabaseConfigured) {
    return demoDb.tasks.filter((t) => !companyId || t.company_id === companyId).sort(byDateDesc);
  }
  let q = supabase().from("tasks").select("*").order("created_at", { ascending: false });
  if (companyId) q = q.eq("company_id", companyId);
  return run(q);
}

export async function createTask(task: Omit<Task, "id" | "created_at" | "done">): Promise<Task> {
  if (!isSupabaseConfigured) {
    const t = { ...task, id: uid(), done: false, created_at: now() };
    demoDb.tasks.push(t);
    return t;
  }
  return run(supabase().from("tasks").insert(task).select().single());
}

export async function updateTask(id: string, patch: Partial<Task>) {
  if (!isSupabaseConfigured) {
    Object.assign(
      demoDb.tasks.find((t) => t.id === id)!,
      patch,
    );
    return;
  }
  await run(supabase().from("tasks").update(patch).eq("id", id));
}

export async function deleteTask(id: string) {
  if (!isSupabaseConfigured) {
    demoDb.tasks.splice(
      demoDb.tasks.findIndex((t) => t.id === id),
      1,
    );
    return;
  }
  await run(supabase().from("tasks").delete().eq("id", id));
}

// ---------------------------------------------------------------------------
// Atualizações para o cliente
// ---------------------------------------------------------------------------
export async function listUpdates(companyId: string): Promise<Update[]> {
  if (!isSupabaseConfigured)
    return demoDb.updates.filter((u) => u.company_id === companyId).sort(byDateDesc);
  return run(
    supabase()
      .from("updates")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
  );
}

export async function createUpdate(companyId: string, message: string) {
  if (!isSupabaseConfigured) {
    demoDb.updates.push({ id: uid(), company_id: companyId, message, created_at: now() });
    return;
  }
  await run(supabase().from("updates").insert({ company_id: companyId, message }));
}

export async function deleteUpdate(id: string) {
  if (!isSupabaseConfigured) {
    demoDb.updates.splice(
      demoDb.updates.findIndex((u) => u.id === id),
      1,
    );
    return;
  }
  await run(supabase().from("updates").delete().eq("id", id));
}

// ---------------------------------------------------------------------------
// Cofre de acessos (somente admin)
// ---------------------------------------------------------------------------
export async function listCredentials(companyId: string): Promise<Credential[]> {
  if (!isSupabaseConfigured) return demoDb.credentials.filter((c) => c.company_id === companyId);
  return run(
    supabase().from("credentials").select("*").eq("company_id", companyId).order("service"),
  );
}

export async function saveCredential(
  cred: Omit<Credential, "id" | "created_at"> & { id?: string },
) {
  if (!isSupabaseConfigured) {
    const existing = cred.id && demoDb.credentials.find((c) => c.id === cred.id);
    if (existing) Object.assign(existing, cred);
    else demoDb.credentials.push({ ...cred, id: uid(), created_at: now() });
    return;
  }
  if (cred.id) await run(supabase().from("credentials").update(cred).eq("id", cred.id));
  else await run(supabase().from("credentials").insert(cred));
}

export async function deleteCredential(id: string) {
  if (!isSupabaseConfigured) {
    demoDb.credentials.splice(
      demoDb.credentials.findIndex((c) => c.id === id),
      1,
    );
    return;
  }
  await run(supabase().from("credentials").delete().eq("id", id));
}

export async function getSetting(key: string): Promise<string | null> {
  if (!isSupabaseConfigured) return demoDb.settings.get(key) ?? null;
  const row = await run<{ value: string } | null>(
    supabase().from("settings").select("value").eq("key", key).maybeSingle(),
  );
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  if (!isSupabaseConfigured) {
    demoDb.settings.set(key, value);
    return;
  }
  await run(supabase().from("settings").upsert({ key, value }));
}
