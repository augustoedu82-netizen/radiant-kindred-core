import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarClock,
  ChevronDown,
  CircleCheck,
  FolderOpen,
  Home,
  Landmark,
  MessageCircle,
  Receipt,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PortalHeader, PortalRoot, RequireRole, Spinner } from "@/components/portal/shell";
import {
  DocumentRow,
  Empty,
  InfoItem,
  Panel,
  ProgressBar,
  StatusPill,
  StepTimeline,
  UploadButton,
} from "@/components/portal/widgets";
import { useAuth } from "@/lib/portal/auth";
import {
  listDocuments,
  listMyCompanies,
  listTasks,
  listUpdates,
  uploadDocument,
} from "@/lib/portal/api";
import {
  CATEGORY_LABEL,
  TUTORIALS,
  WHATSAPP,
  obligationsOf,
  progressOf,
} from "@/lib/portal/content";
import { dueLabel, dueTone, formatDate } from "@/lib/portal/format";
import { cn } from "@/lib/utils";
import type { Company, DocumentCategory } from "@/lib/portal/types";

export const Route = createFileRoute("/portal")({
  ssr: false,
  component: () => (
    <PortalRoot>
      <RequireRole role="client">
        <ClientPortal />
      </RequireRole>
    </PortalRoot>
  ),
  head: () => ({
    meta: [{ title: "Minha empresa — DestravaUSA" }, { name: "robots", content: "noindex" }],
  }),
});

function ClientPortal() {
  const { profile } = useAuth();
  const companies = useQuery({
    queryKey: ["my-companies", profile?.email],
    queryFn: () => listMyCompanies(profile?.email ?? ""),
  });
  const [selected, setSelected] = useState<string | null>(null);
  const company = companies.data?.find((c) => c.id === selected) ?? companies.data?.[0];

  return (
    <>
      <PortalHeader subtitle="Área do cliente" />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-5">
        {companies.isLoading ? (
          <Spinner />
        ) : !company ? (
          <NoCompany />
        ) : (
          <>
            <CompanyHero company={company} />
            {companies.data!.length > 1 && (
              <div className="mt-4 max-w-xs">
                <Select value={company.id} onValueChange={setSelected}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.data!.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <CompanyTabs company={company} />
          </>
        )}
      </main>
    </>
  );
}

function NoCompany() {
  return (
    <Panel className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-extrabold">Ainda não encontramos sua empresa</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sua conta ainda não está ligada a uma LLC. Confira se você entrou com o mesmo e-mail do
        contrato ou fale com a gente.
      </p>
      <a href={WHATSAPP} className="btn-primary mt-6">
        <MessageCircle className="size-4" /> Falar no WhatsApp
      </a>
    </Panel>
  );
}

function CompanyHero({ company }: { company: Company }) {
  const { pct, current } = progressOf(company);
  const firstName = company.client_name.split(" ")[0];
  return (
    <section className="overflow-hidden rounded-[var(--radius-3xl)] bg-ink p-6 text-ink-foreground sm:p-8">
      <p className="text-sm text-ink-foreground/70">Olá, {firstName} 👋</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{company.company_name}</h1>
        <StatusPill status={company.status} />
      </div>
      <p className="mt-1 text-sm text-ink-foreground/70">LLC registrada em {company.state}</p>
      <div className="mt-6 max-w-xl">
        <div className="mb-2 flex justify-between text-sm">
          <span>{current ? `Etapa atual: ${current.title}` : "Processo concluído 🎉"}</span>
          <span className="font-bold">{pct}%</span>
        </div>
        <ProgressBar company={company} className="bg-white/15" />
      </div>
    </section>
  );
}

function CompanyTabs({ company }: { company: Company }) {
  const tabs = [
    { v: "inicio", label: "Início", icon: Home },
    { v: "documentos", label: "Documentos", icon: FolderOpen },
    { v: "fiscal", label: "Fiscal e contábil", icon: Receipt },
    { v: "tutoriais", label: "Tutoriais", icon: BookOpen },
  ];
  return (
    <Tabs defaultValue="inicio" className="mt-6">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-card p-1.5 shadow-sm sm:w-auto">
        {tabs.map(({ v, label, icon: Icon }) => (
          <TabsTrigger
            key={v}
            value={v}
            className="gap-1.5 rounded-xl px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Icon className="size-4" /> {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="inicio" className="mt-6">
        <Overview company={company} />
      </TabsContent>
      <TabsContent value="documentos" className="mt-6">
        <Documents company={company} />
      </TabsContent>
      <TabsContent value="fiscal" className="mt-6">
        <Fiscal company={company} />
      </TabsContent>
      <TabsContent value="tutoriais" className="mt-6">
        <Tutorials />
      </TabsContent>
    </Tabs>
  );
}

function Overview({ company }: { company: Company }) {
  const tasks = useQuery({ queryKey: ["tasks", company.id], queryFn: () => listTasks(company.id) });
  const updates = useQuery({
    queryKey: ["updates", company.id],
    queryFn: () => listUpdates(company.id),
  });
  const mine = (tasks.data ?? []).filter((t) => !t.done && t.responsible === "cliente");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="space-y-6">
        <Panel title="O que falta você fazer">
          {mine.length ? (
            <ul className="space-y-3">
              {mine.map((t) => (
                <li
                  key={t.id}
                  className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
                >
                  <p className="font-semibold">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
                  )}
                  {t.due_date && (
                    <p className={cn("mt-1 text-xs font-semibold", dueTone(t.due_date))}>
                      {dueLabel(t.due_date)}
                    </p>
                  )}
                </li>
              ))}
              <p className="text-xs text-muted-foreground">
                Envie os arquivos pedidos na aba <strong>Documentos</strong>.
              </p>
            </ul>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CircleCheck className="size-4 text-emerald-600" /> Nenhuma pendência sua no momento.
            </p>
          )}
        </Panel>

        <Panel title="Andamento do processo">
          <StepTimeline company={company} />
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="Dados da empresa">
          <dl className="grid grid-cols-2 gap-4">
            <InfoItem label="Estado" value={company.state} />
            <InfoItem label="EIN" value={company.ein} />
            <InfoItem
              label="Data de abertura"
              value={company.formation_date && formatDate(company.formation_date)}
            />
            <InfoItem label="Nº de registro" value={company.filing_number} />
            <InfoItem label="Registered Agent" value={company.registered_agent} />
            <InfoItem label="Banco" value={company.bank_name} />
            <div className="col-span-2">
              <InfoItem label="Endereço nos EUA" value={company.us_address} />
            </div>
          </dl>
        </Panel>

        <Panel title="Atualizações">
          {updates.data?.length ? (
            <ul className="space-y-4">
              {updates.data.map((u) => (
                <li key={u.id} className="border-l-2 border-primary pl-4">
                  <p className="text-sm">{u.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(u.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>As novidades do seu processo aparecem aqui.</Empty>
          )}
        </Panel>

        <a
          href={WHATSAPP}
          className="flex items-center gap-3 rounded-[var(--radius-3xl)] bg-emerald-600 p-5 text-white transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="size-6" />
          <div>
            <p className="font-bold">Dúvida? Fale com o Eduardo</p>
            <p className="text-sm text-white/80">Atendimento em português pelo WhatsApp</p>
          </div>
        </a>
      </div>
    </div>
  );
}

function Documents({ company }: { company: Company }) {
  const qc = useQueryClient();
  const docs = useQuery({
    queryKey: ["documents", company.id],
    queryFn: () => listDocuments(company.id),
  });
  const groups = useMemo(() => {
    const map = new Map<DocumentCategory, typeof docs.data>();
    for (const d of docs.data ?? []) map.set(d.category, [...(map.get(d.category) ?? []), d]);
    return map;
  }, [docs.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const order: DocumentCategory[] = [
    "societario",
    "fiscal",
    "contabil",
    "bancario",
    "outros",
    "cliente",
  ];

  return (
    <div className="space-y-6">
      <Panel
        title="Enviar documentos"
        action={
          <UploadButton
            onFiles={async (files) => {
              for (const f of files)
                await uploadDocument(company.id, f, { category: "cliente", uploadedBy: "client" });
              await qc.invalidateQueries({ queryKey: ["documents", company.id] });
            }}
          />
        }
      >
        <p className="text-sm text-muted-foreground">
          Passaporte, comprovante de endereço e o que mais pedirmos. PDF ou foto, até 25 MB por
          arquivo.
        </p>
      </Panel>

      {docs.isLoading ? (
        <Spinner />
      ) : !docs.data?.length ? (
        <Empty>Seus documentos oficiais vão aparecer aqui assim que ficarem prontos.</Empty>
      ) : (
        order
          .filter((cat) => groups.get(cat)?.length)
          .map((cat) => (
            <Panel key={cat} title={CATEGORY_LABEL[cat]}>
              <div className="space-y-2">
                {groups.get(cat)!.map((d) => (
                  <DocumentRow key={d.id} doc={d} />
                ))}
              </div>
            </Panel>
          ))
      )}
    </div>
  );
}

function Fiscal({ company }: { company: Company }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Panel title="Obrigações anuais">
        <ul className="space-y-3">
          {obligationsOf(company).map((o) => (
            <li key={o.title} className="flex gap-4 rounded-2xl border border-border p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                <CalendarClock className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{o.title}</p>
                <p className="text-sm text-muted-foreground">{o.d}</p>
                <p className={cn("mt-1 text-sm font-semibold", dueTone(o.date))}>
                  {o.date
                    ? `${formatDate(o.date)} · ${dueLabel(o.date)}`
                    : "Data definida após a abertura"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <div className="space-y-6">
        <Panel title="Manutenção anual">
          <p className="text-sm text-muted-foreground">
            Para a LLC continuar ativa, todo ano é preciso renovar o Registered Agent, pagar a taxa
            do estado e entregar o Annual Report. A Destrava USA cuida disso para você.
          </p>
          <a
            href={`${WHATSAPP}?text=${encodeURIComponent(`Quero renovar a manutenção anual da ${company.company_name}`)}`}
            className="btn-primary mt-4 !px-4 !py-2 !text-sm"
          >
            <Landmark className="size-4" /> Falar sobre a renovação
          </a>
        </Panel>
        <Panel title="Declaração do IRS (Form 5472)">
          <p className="text-sm text-muted-foreground">
            Obrigatória todo ano para LLC de estrangeiro, mesmo sem faturamento. Guarde extratos e
            comprovantes do ano e fale com a gente antes de abril.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function Tutorials() {
  const groups = Array.from(new Set(TUTORIALS.map((t) => t.group)));
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g}>
          <h2 className="mb-3 font-display text-lg font-bold">{g}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {TUTORIALS.filter((t) => t.group === g).map((t) => {
              const isOpen = open === t.id;
              return (
                <div key={t.id} className="surface-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : t.id)}
                    className="flex w-full items-start justify-between gap-3 p-5 text-left"
                  >
                    <div>
                      <p className="font-semibold">{t.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{t.summary}</p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-1 size-4 shrink-0 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <ol className="space-y-2 border-t border-border px-5 py-4">
                      {t.steps.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{s}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
