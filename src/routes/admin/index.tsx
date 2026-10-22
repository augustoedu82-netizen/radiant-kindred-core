import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  ClipboardList,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewCompanyDialog } from "@/components/portal/new-company-dialog";
import { PortalHeader, Spinner } from "@/components/portal/shell";
import { Empty, Panel, ProgressBar, StatusPill } from "@/components/portal/widgets";
import { createCompany, listCompanies, listTasks } from "@/lib/portal/api";
import { STATUS_LABEL, US_STATES, progressOf } from "@/lib/portal/content";
import { daysUntil, dueLabel, dueTone, formatDate } from "@/lib/portal/format";
import { cn } from "@/lib/utils";
import type { Company, CompanyStatus } from "@/lib/portal/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type Deadline = { company: Company; title: string; date: string };

function AdminDashboard() {
  const companies = useQuery({ queryKey: ["companies"], queryFn: listCompanies });
  const tasks = useQuery({ queryKey: ["tasks", "all"], queryFn: () => listTasks() });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CompanyStatus | "todos">("todos");
  const [creating, setCreating] = useState(false);

  const all = useMemo(() => companies.data ?? [], [companies.data]);
  const byId = useMemo(() => new Map(all.map((c) => [c.id, c])), [all]);

  const deadlines = useMemo(() => {
    const list: Deadline[] = [];
    for (const c of all) {
      if (c.status === "cancelada") continue;
      if (c.annual_report_due)
        list.push({ company: c, title: "Annual Report", date: c.annual_report_due });
      if (c.renewal_due) list.push({ company: c, title: "Renovação anual", date: c.renewal_due });
    }
    return list
      .filter((d) => (daysUntil(d.date) ?? 999) <= 60)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [all]);

  const openTasks = (tasks.data ?? []).filter((t) => !t.done);

  const filtered = all.filter((c) => {
    if (status !== "todos" && c.status !== status) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [c.client_name, c.company_name, c.client_email, c.state, c.ein ?? ""].some((v) =>
      v.toLowerCase().includes(q),
    );
  });

  const stats = [
    { label: "Clientes", value: all.length, icon: Building2 },
    {
      label: "Em andamento",
      value: all.filter((c) => c.status === "em_andamento" || c.status === "pendente").length,
      icon: Loader2,
    },
    { label: "Pendências abertas", value: openTasks.length, icon: ClipboardList },
    { label: "Prazos em 60 dias", value: deadlines.length, icon: CalendarClock },
  ];

  return (
    <>
      <PortalHeader
        subtitle="Painel administrativo"
        actions={
          <button
            type="button"
            className="btn-primary !px-4 !py-2 !text-sm"
            onClick={() => setCreating(true)}
          >
            <Plus className="size-4" /> <span className="hidden sm:inline">Novo cliente</span>
          </button>
        }
      />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-5">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Visão geral</h1>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="surface-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">{label}</span>
                <Icon className="size-4" />
              </div>
              <p className="mt-2 font-display text-3xl font-extrabold">
                {companies.isLoading ? "–" : value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Prazos próximos">
            {deadlines.length ? (
              <ul className="divide-y divide-border">
                {deadlines.map((d) => (
                  <li key={`${d.company.id}-${d.title}`}>
                    <Link
                      to="/admin/$id"
                      params={{ id: d.company.id }}
                      className="flex items-center justify-between gap-3 py-3 hover:text-primary"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{d.company.company_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.title} · {d.company.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{formatDate(d.date)}</p>
                        <p className={cn("text-xs font-semibold", dueTone(d.date))}>
                          {dueLabel(d.date)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>Nenhum Annual Report ou renovação nos próximos 60 dias.</Empty>
            )}
          </Panel>

          <Panel title="Pendências abertas">
            {openTasks.length ? (
              <ul className="divide-y divide-border">
                {openTasks.slice(0, 8).map((t) => {
                  const c = byId.get(t.company_id);
                  return (
                    <li key={t.id}>
                      <Link
                        to="/admin/$id"
                        params={{ id: t.company_id }}
                        className="flex items-center justify-between gap-3 py-3 hover:text-primary"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{t.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {c?.company_name} ·{" "}
                            {t.responsible === "cliente" ? "Com o cliente" : "Com a Destrava"}
                          </p>
                        </div>
                        {t.due_date && (
                          <span
                            className={cn("shrink-0 text-xs font-semibold", dueTone(t.due_date))}
                          >
                            {dueLabel(t.due_date)}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Empty>Tudo em dia.</Empty>
            )}
          </Panel>
        </div>

        <Panel
          title="Clientes"
          action={
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar"
                  className="w-36 pl-9 sm:w-56"
                />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as CompanyStatus | "todos")}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        >
          {companies.isLoading ? (
            <Spinner />
          ) : companies.error ? (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="size-4" /> {(companies.error as Error).message}
            </p>
          ) : filtered.length ? (
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 py-2 font-semibold">Empresa</th>
                    <th className="px-2 py-2 font-semibold">Estado</th>
                    <th className="px-2 py-2 font-semibold">Progresso</th>
                    <th className="px-2 py-2 font-semibold">Status</th>
                    <th className="px-2 py-2 font-semibold">Annual Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => (
                    <ClientRow key={c.id} company={c} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>
              {all.length
                ? "Nenhum cliente com esse filtro."
                : 'Cadastre o primeiro cliente em "Novo cliente".'}
            </Empty>
          )}
        </Panel>
      </main>
      <NewCompanyDialog open={creating} onOpenChange={setCreating} />
    </>
  );
}

function ClientRow({ company: c }: { company: Company }) {
  const navigate = useNavigate();
  const { current, done, total } = progressOf(c);
  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-accent/50"
      onClick={() => void navigate({ to: "/admin/$id", params: { id: c.id } })}
    >
      <td className="px-2 py-3">
        <p className="font-semibold">{c.company_name}</p>
        <p className="text-xs text-muted-foreground">{c.client_name}</p>
      </td>
      <td className="px-2 py-3">{c.state}</td>
      <td className="px-2 py-3">
        <ProgressBar company={c} className="w-28" />
        <p className="mt-1 text-xs text-muted-foreground">
          {done}/{total} · {current?.title ?? "Concluído"}
        </p>
      </td>
      <td className="px-2 py-3">
        <StatusPill status={c.status} />
      </td>
      <td className={cn("px-2 py-3 text-xs font-semibold", dueTone(c.annual_report_due))}>
        {c.annual_report_due ? dueLabel(c.annual_report_due) : "—"}
      </td>
    </tr>
  );
}
