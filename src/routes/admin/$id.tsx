import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  MessageCircle,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewCompanyDialog } from "@/components/portal/new-company-dialog";
import { PortalHeader, Spinner } from "@/components/portal/shell";
import {
  DocumentRow,
  Empty,
  Panel,
  StatusPill,
  StepTimeline,
  UploadButton,
} from "@/components/portal/widgets";
import {
  createTask,
  createUpdate,
  deleteCompany,
  deleteCredential,
  deleteDocument,
  deleteTask,
  deleteUpdate,
  getCompany,
  listCompanies,
  getSetting,
  listCredentials,
  listDocuments,
  listTasks,
  listUpdates,
  saveCredential,
  setSetting,
  updateCompany,
  updateDocument,
  updateTask,
  uploadDocument,
} from "@/lib/portal/api";
import { CATEGORY_LABEL, STATUS_LABEL, STEPS, US_STATES } from "@/lib/portal/content";
import {
  decryptSecret,
  encryptSecret,
  VAULT_CHECK_KEY,
  VAULT_CHECK_VALUE,
} from "@/lib/portal/crypto";
import { dueLabel, dueTone, formatDate } from "@/lib/portal/format";
import { cn } from "@/lib/utils";
import type { Company, CompanyStatus, Credential, DocumentCategory } from "@/lib/portal/types";

export const Route = createFileRoute("/admin/$id")({
  component: AdminClient,
});

function AdminClient() {
  const { id } = Route.useParams();
  const company = useQuery({ queryKey: ["company", id], queryFn: () => getCompany(id) });

  return (
    <>
      <PortalHeader subtitle="Painel administrativo" />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-5">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Todos os clientes
        </Link>
        {company.isLoading ? (
          <Spinner />
        ) : !company.data ? (
          <Empty>Cliente não encontrado.</Empty>
        ) : (
          <ClientDetail company={company.data} />
        )}
      </main>
    </>
  );
}

function useRefresh(id: string) {
  const qc = useQueryClient();
  return (...keys: string[]) =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["company", id] }),
      qc.invalidateQueries({ queryKey: ["companies"] }),
      qc.invalidateQueries({ queryKey: ["tasks", "all"] }),
      ...keys.map((k) => qc.invalidateQueries({ queryKey: [k, id] })),
    ]);
}

function ClientDetail({ company }: { company: Company }) {
  const refresh = useRefresh(company.id);
  const whatsapp = company.client_phone?.replace(/\D/g, "");
  const [addingLlc, setAddingLlc] = useState(false);
  const all = useQuery({ queryKey: ["companies"], queryFn: listCompanies });
  const siblings = (all.data ?? []).filter(
    (c) => c.client_email.toLowerCase() === company.client_email.toLowerCase(),
  );

  async function toggleStep(key: string, done: boolean) {
    const steps = { ...company.steps, [key]: done ? new Date().toISOString() : null };
    const allDone = STEPS.every((s) => steps[s.key]);
    await updateCompany(company.id, {
      steps,
      ...(allDone && company.status === "em_andamento" ? { status: "ativa" as CompanyStatus } : {}),
    });
    await refresh();
    if (done) {
      const step = STEPS.find((s) => s.key === key)!;
      toast.success(`"${step.title}" concluído`, {
        action: {
          label: "Avisar cliente",
          onClick: async () => {
            await createUpdate(company.id, `✅ ${step.title}. ${step.d}`);
            await refresh("updates");
            toast.success("Atualização publicada no portal do cliente.");
          },
        },
      });
    }
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold sm:text-3xl">{company.company_name}</h1>
            <StatusPill status={company.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {company.client_name} · {company.client_email} · {company.state}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAddingLlc(true)}
            className="btn-ghost !px-4 !py-2 !text-sm"
          >
            <Plus className="size-4" /> Adicionar outra LLC
          </button>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost !px-4 !py-2 !text-sm"
            >
              <MessageCircle className="size-4" /> WhatsApp do cliente
            </a>
          )}
        </div>
      </div>

      {siblings.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            LLCs deste cliente:
          </span>
          {siblings.map((c) => (
            <Link
              key={c.id}
              to="/admin/$id"
              params={{ id: c.id }}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                c.id === company.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary hover:text-primary",
              )}
            >
              {c.company_name}
            </Link>
          ))}
        </div>
      )}

      <NewCompanyDialog open={addingLlc} onOpenChange={setAddingLlc} client={company} />

      <Tabs defaultValue="geral" className="mt-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:w-auto">
          {(
            [
              ["geral", "Visão geral"],
              ["documentos", "Documentos"],
              ["pendencias", "Pendências"],
              ["atualizacoes", "Atualizações"],
              ["acessos", "Acessos"],
            ] as const
          ).map(([v, l]) => (
            <TabsTrigger
              key={v}
              value={v}
              className="rounded-xl px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="geral" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <Panel
              title="Etapas"
              action={<span className="text-xs text-muted-foreground">Clique para marcar</span>}
            >
              <StepTimeline company={company} onToggle={toggleStep} />
            </Panel>
            <CompanyForm company={company} onSaved={() => refresh()} />
          </div>
        </TabsContent>
        <TabsContent value="documentos" className="mt-6">
          <DocumentsTab company={company} />
        </TabsContent>
        <TabsContent value="pendencias" className="mt-6">
          <TasksTab company={company} />
        </TabsContent>
        <TabsContent value="atualizacoes" className="mt-6">
          <UpdatesTab company={company} />
        </TabsContent>
        <TabsContent value="acessos" className="mt-6">
          <VaultTab company={company} />
        </TabsContent>
      </Tabs>
    </>
  );
}

// ---------------------------------------------------------------------------
// Dados da empresa
// ---------------------------------------------------------------------------
const FIELDS: { key: keyof Company; label: string; type?: string; wide?: boolean }[] = [
  { key: "client_name", label: "Nome do cliente" },
  { key: "client_email", label: "E-mail (login)", type: "email" },
  { key: "client_phone", label: "WhatsApp" },
  { key: "company_name", label: "Nome da LLC" },
  { key: "ein", label: "EIN" },
  { key: "filing_number", label: "Nº de registro no estado" },
  { key: "formation_date", label: "Data de abertura", type: "date" },
  { key: "registered_agent", label: "Registered Agent" },
  { key: "bank_name", label: "Banco / fintech" },
  { key: "annual_report_due", label: "Vencimento do Annual Report", type: "date" },
  { key: "renewal_due", label: "Vencimento da renovação anual", type: "date" },
  { key: "us_address", label: "Endereço nos EUA", wide: true },
];

function CompanyForm({ company, onSaved }: { company: Company; onSaved: () => Promise<unknown> }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(company);
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm(company), [company]);

  const dirty = JSON.stringify(form) !== JSON.stringify(company);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const patch: Partial<Company> = {};
      for (const k of Object.keys(form) as (keyof Company)[]) {
        if (k === "id" || k === "created_at" || k === "steps") continue;
        const v = form[k];
        (patch as Record<string, unknown>)[k] = v === "" ? null : v;
      }
      patch.client_email = form.client_email.trim().toLowerCase();
      await updateCompany(company.id, patch);
      await onSaved();
      toast.success("Dados salvos.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (
      !window.confirm(
        `Excluir ${company.company_name} e todos os documentos? Não dá para desfazer.`,
      )
    )
      return;
    await deleteCompany(company.id);
    await onSaved();
    toast.success("Cliente excluído.");
    void navigate({ to: "/admin" });
  }

  return (
    <Panel title="Dados da empresa">
      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v as CompanyStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {FIELDS.map((f) => (
          <div key={f.key} className={cn("space-y-1.5", f.wide && "sm:col-span-2")}>
            <Label>{f.label}</Label>
            <Input
              type={f.type ?? "text"}
              value={(form[f.key] as string | null) ?? ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          </div>
        ))}
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Notas internas (o cliente não vê)</Label>
          <Textarea
            rows={4}
            value={form.admin_notes ?? ""}
            onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
            placeholder="Objetivo do cliente, combinados, oportunidades de venda..."
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
          <button
            type="button"
            onClick={remove}
            className="text-sm font-medium text-destructive hover:underline"
          >
            Excluir cliente
          </button>
          <button
            type="submit"
            disabled={!dirty || busy}
            className="btn-primary !px-5 !py-2.5 !text-sm disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{" "}
            Salvar alterações
          </button>
        </div>
      </form>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Documentos
// ---------------------------------------------------------------------------
function DocumentsTab({ company }: { company: Company }) {
  const qc = useQueryClient();
  const docs = useQuery({
    queryKey: ["documents", company.id],
    queryFn: () => listDocuments(company.id),
  });
  const [category, setCategory] = useState<DocumentCategory>("societario");
  const [internal, setInternal] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["documents", company.id] });

  return (
    <div className="space-y-6">
      <Panel title="Adicionar documentos">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABEL) as DocumentCategory[])
                  .filter((c) => c !== "cliente")
                  .map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_LABEL[c]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <Switch checked={internal} onCheckedChange={setInternal} /> Só para mim (cliente não vê)
          </label>
          <UploadButton
            onFiles={async (files) => {
              for (const f of files)
                await uploadDocument(company.id, f, { category, uploadedBy: "admin", internal });
              await refresh();
            }}
          />
        </div>
      </Panel>

      {docs.isLoading ? (
        <Spinner />
      ) : docs.data?.length ? (
        (Object.keys(CATEGORY_LABEL) as DocumentCategory[])
          .filter((cat) => docs.data!.some((d) => d.category === cat))
          .map((cat) => (
            <Panel
              key={cat}
              title={cat === "cliente" ? "Enviados pelo cliente" : CATEGORY_LABEL[cat]}
            >
              <div className="space-y-2">
                {docs
                  .data!.filter((d) => d.category === cat)
                  .map((d) => (
                    <DocumentRow
                      key={d.id}
                      doc={d}
                      extra={
                        <button
                          type="button"
                          onClick={async () => {
                            await updateDocument(d.id, { internal: !d.internal });
                            await refresh();
                          }}
                          className="hidden rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent sm:inline"
                        >
                          {d.internal ? "Mostrar ao cliente" : "Ocultar do cliente"}
                        </button>
                      }
                      onDelete={async () => {
                        if (!window.confirm(`Excluir "${d.name}"?`)) return;
                        await deleteDocument(d);
                        await refresh();
                      }}
                    />
                  ))}
              </div>
            </Panel>
          ))
      ) : (
        <Empty>Nenhum documento ainda.</Empty>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pendências
// ---------------------------------------------------------------------------
function TasksTab({ company }: { company: Company }) {
  const refresh = useRefresh(company.id);
  const tasks = useQuery({ queryKey: ["tasks", company.id], queryFn: () => listTasks(company.id) });
  const empty = {
    title: "",
    description: "",
    due_date: "",
    responsible: "cliente" as "cliente" | "destrava",
  };
  const [form, setForm] = useState(empty);

  async function add(e: FormEvent) {
    e.preventDefault();
    await createTask({
      company_id: company.id,
      title: form.title,
      description: form.description || null,
      due_date: form.due_date || null,
      responsible: form.responsible,
    });
    setForm(empty);
    await refresh("tasks");
  }

  const list = tasks.data ?? [];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel title="Nova pendência">
        <form onSubmit={add} className="space-y-4">
          <div className="space-y-1.5">
            <Label>O que precisa ser feito</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Detalhes (o cliente vê)</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Responsável</Label>
              <Select
                value={form.responsible}
                onValueChange={(v) =>
                  setForm({ ...form, responsible: v as "cliente" | "destrava" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="destrava">Destrava USA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prazo</Label>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full !py-2.5 !text-sm">
            <Plus className="size-4" /> Adicionar
          </button>
        </form>
      </Panel>
      <Panel title="Pendências">
        {list.length ? (
          <ul className="space-y-2">
            {list.map((t) => (
              <li
                key={t.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border border-border p-3",
                  t.done && "opacity-60",
                )}
              >
                <button
                  type="button"
                  onClick={async () => {
                    await updateTask(t.id, { done: !t.done });
                    await refresh("tasks");
                  }}
                  className={cn(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2",
                    t.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary",
                  )}
                  aria-label={t.done ? "Reabrir" : "Concluir"}
                >
                  {t.done && <Check className="size-3.5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-semibold", t.done && "line-through")}>{t.title}</p>
                  {t.description && (
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  )}
                  <p className="mt-1 text-xs">
                    <span className="font-medium">
                      {t.responsible === "cliente" ? "Cliente" : "Destrava USA"}
                    </span>
                    {t.due_date && (
                      <span className={cn("ml-2", dueTone(t.due_date))}>
                        · {dueLabel(t.due_date)}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteTask(t.id);
                    await refresh("tasks");
                  }}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Nenhuma pendência.</Empty>
        )}
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Atualizações (aparecem no portal do cliente)
// ---------------------------------------------------------------------------
function UpdatesTab({ company }: { company: Company }) {
  const qc = useQueryClient();
  const updates = useQuery({
    queryKey: ["updates", company.id],
    queryFn: () => listUpdates(company.id),
  });
  const [message, setMessage] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["updates", company.id] });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel title="Publicar atualização">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createUpdate(company.id, message.trim());
            setMessage("");
            await refresh();
            toast.success("Publicado no portal do cliente.");
          }}
          className="space-y-3"
        >
          <Textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex.: Seu EIN saiu! A carta do IRS já está na aba Documentos."
          />
          <button type="submit" className="btn-primary w-full !py-2.5 !text-sm">
            <Send className="size-4" /> Publicar
          </button>
        </form>
      </Panel>
      <Panel title="Histórico">
        {updates.data?.length ? (
          <ul className="space-y-4">
            {updates.data.map((u) => (
              <li
                key={u.id}
                className="flex items-start justify-between gap-3 border-l-2 border-primary pl-4"
              >
                <div>
                  <p className="text-sm">{u.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(u.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteUpdate(u.id);
                    await refresh();
                  }}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Nada publicado ainda.</Empty>
        )}
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cofre de acessos (senhas cifradas com a senha mestra)
// ---------------------------------------------------------------------------
let sessionPassphrase: string | null = null;

function VaultTab({ company }: { company: Company }) {
  const [passphrase, setPassphrase] = useState<string | null>(sessionPassphrase);
  if (!passphrase) {
    return (
      <UnlockVault
        onUnlock={(p) => {
          sessionPassphrase = p;
          setPassphrase(p);
        }}
      />
    );
  }
  return <VaultList company={company} passphrase={passphrase} />;
}

function UnlockVault({ onUnlock }: { onUnlock: (p: string) => void }) {
  const check = useQuery({
    queryKey: ["setting", VAULT_CHECK_KEY],
    queryFn: () => getSetting(VAULT_CHECK_KEY),
  });
  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const isNew = check.data === null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (isNew) {
        if (value.length < 10) throw new Error("Use pelo menos 10 caracteres.");
        if (value !== confirm) throw new Error("As senhas não conferem.");
        await setSetting(VAULT_CHECK_KEY, await encryptSecret(VAULT_CHECK_VALUE, value));
      } else {
        const ok = await decryptSecret(check.data!, value).then(
          (v) => v === VAULT_CHECK_VALUE,
          () => false,
        );
        if (!ok) throw new Error("Senha mestra incorreta.");
      }
      onUnlock(value);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao abrir o cofre.");
    } finally {
      setBusy(false);
    }
  }

  if (check.isLoading) return <Spinner />;
  return (
    <Panel className="mx-auto max-w-md">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent text-primary">
          <Lock className="size-5" />
        </span>
        <h2 className="mt-3 font-display text-xl font-bold">
          {isNew ? "Criar senha mestra" : "Cofre de acessos"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isNew
            ? "As senhas dos clientes são criptografadas com essa senha antes de ir para o banco. Guarde-a bem: sem ela não dá para recuperar os acessos."
            : "Digite sua senha mestra para ver os logins deste cliente."}
        </p>
      </div>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <Input
          type="password"
          placeholder="Senha mestra"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          autoFocus
        />
        {isNew && (
          <Input
            type="password"
            placeholder="Repita a senha mestra"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full !py-2.5 !text-sm disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}{" "}
          {isNew ? "Criar e abrir" : "Abrir cofre"}
        </button>
      </form>
    </Panel>
  );
}

function VaultList({ company, passphrase }: { company: Company; passphrase: string }) {
  const qc = useQueryClient();
  const creds = useQuery({
    queryKey: ["credentials", company.id],
    queryFn: () => listCredentials(company.id),
  });
  const empty = { service: "", url: "", username: "", password: "", notes: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["credentials", company.id] });

  async function add(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveCredential({
        company_id: company.id,
        service: form.service,
        url: form.url || null,
        username: form.username || null,
        secret: form.password ? await encryptSecret(form.password, passphrase) : null,
        notes: form.notes || null,
      });
      setForm(empty);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel title="Novo acesso">
        <form onSubmit={add} className="space-y-3">
          <Input
            placeholder="Serviço (ex.: Wyoming SOS, Mercury, IRS)"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            required
          />
          <Input
            placeholder="Link de login"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <Input
            placeholder="Usuário / e-mail"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
          />
          <Textarea
            rows={2}
            placeholder="Observações (PIN, pergunta de segurança...)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full !py-2.5 !text-sm disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}{" "}
            Salvar acesso
          </button>
          <p className="text-xs text-muted-foreground">
            A senha é criptografada no seu navegador antes de ser salva.
          </p>
        </form>
      </Panel>
      <Panel title="Acessos salvos">
        {creds.data?.length ? (
          <ul className="space-y-2">
            {creds.data.map((c) => (
              <CredentialRow
                key={c.id}
                cred={c}
                passphrase={passphrase}
                onDelete={async () => {
                  if (!window.confirm(`Excluir o acesso "${c.service}"?`)) return;
                  await deleteCredential(c.id);
                  await refresh();
                }}
              />
            ))}
          </ul>
        ) : (
          <Empty>Nenhum acesso salvo para este cliente.</Empty>
        )}
      </Panel>
    </div>
  );
}

function CredentialRow({
  cred,
  passphrase,
  onDelete,
}: {
  cred: Credential;
  passphrase: string;
  onDelete: () => void;
}) {
  const [plain, setPlain] = useState<string | null>(null);

  async function reveal() {
    if (plain !== null) return setPlain(null);
    if (!cred.secret) return;
    try {
      setPlain(await decryptSecret(cred.secret, passphrase));
    } catch {
      toast.error("Não foi possível descriptografar. Senha mestra diferente?");
    }
  }

  async function copy(text: string, what: string) {
    await navigator.clipboard.writeText(text);
    toast.success(`${what} copiado.`);
  }

  return (
    <li className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{cred.service}</p>
          {cred.url && (
            <a
              href={cred.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-xs text-primary hover:underline"
            >
              {cred.url}
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Excluir"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <dl className="mt-3 grid gap-2 text-sm">
        {cred.username && (
          <Row label="Usuário">
            <span className="truncate">{cred.username}</span>
            <IconBtn onClick={() => copy(cred.username!, "Usuário")} label="Copiar usuário">
              <Copy className="size-3.5" />
            </IconBtn>
          </Row>
        )}
        {cred.secret && (
          <Row label="Senha">
            <span className="truncate font-mono">{plain ?? "••••••••••"}</span>
            <IconBtn onClick={reveal} label={plain ? "Ocultar" : "Mostrar"}>
              {plain ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </IconBtn>
            <IconBtn
              onClick={async () =>
                copy(plain ?? (await decryptSecret(cred.secret!, passphrase)), "Senha")
              }
              label="Copiar senha"
            >
              <Copy className="size-3.5" />
            </IconBtn>
          </Row>
        )}
        {cred.notes && <p className="text-xs text-muted-foreground">{cred.notes}</p>}
      </dl>
    </li>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <dt className="w-16 shrink-0 text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="flex min-w-0 flex-1 items-center gap-1">{children}</dd>
    </div>
  );
}

function IconBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-7 place-items-center rounded-full hover:bg-accent"
    >
      {children}
    </button>
  );
}
