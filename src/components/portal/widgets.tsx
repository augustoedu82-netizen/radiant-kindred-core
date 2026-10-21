import { useRef, useState, type ReactNode } from "react";
import { Check, CircleDashed, Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { STATUS_CLASS, STATUS_LABEL, STEPS, progressOf } from "@/lib/portal/content";
import { documentUrl } from "@/lib/portal/api";
import { formatDate, formatSize } from "@/lib/portal/format";
import type { Company, CompanyStatus, PortalDocument } from "@/lib/portal/types";

export function StatusPill({ status }: { status: CompanyStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_CLASS[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ProgressBar({ company, className }: { company: Company; className?: string }) {
  const { pct } = progressOf(company);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Linha do tempo das etapas. Com onToggle, vira editável (painel admin). */
export function StepTimeline({
  company,
  onToggle,
}: {
  company: Company;
  onToggle?: (key: string, done: boolean) => void;
}) {
  const { current } = progressOf(company);
  return (
    <ol className="relative space-y-1">
      {STEPS.map((step, i) => {
        const doneAt = company.steps?.[step.key];
        const isCurrent = current?.key === step.key;
        return (
          <li key={step.key} className="relative flex gap-4 pb-4">
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5",
                  doneAt ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <button
              type="button"
              disabled={!onToggle}
              onClick={() => onToggle?.(step.key, !doneAt)}
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors",
                doneAt
                  ? "border-primary bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-primary bg-background text-primary"
                    : "border-border bg-background text-muted-foreground",
                onToggle && "cursor-pointer hover:border-primary",
              )}
              aria-label={onToggle ? `${doneAt ? "Desmarcar" : "Marcar"} ${step.title}` : undefined}
            >
              {doneAt ? (
                <Check className="size-4" />
              ) : isCurrent ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CircleDashed className="size-4" />
              )}
            </button>
            <div className="pt-1">
              <p className={cn("font-semibold", !doneAt && !isCurrent && "text-muted-foreground")}>
                {step.title}
                {isCurrent && (
                  <span className="ml-2 text-xs font-semibold text-primary">Em andamento</span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {doneAt ? `Concluído em ${formatDate(doneAt)}` : step.d}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function DocumentRow({
  doc,
  onDelete,
  extra,
}: {
  doc: PortalDocument;
  onDelete?: () => void;
  extra?: ReactNode;
}) {
  const [opening, setOpening] = useState(false);
  async function open() {
    setOpening(true);
    try {
      const url = await documentUrl(doc);
      if (url) window.open(url, "_blank", "noopener");
      else toast.info("No modo demonstração os arquivos de exemplo não têm conteúdo.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível abrir o arquivo.");
    } finally {
      setOpening(false);
    }
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary">
        <FileText className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{doc.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(doc.created_at)} {doc.size ? `· ${formatSize(doc.size)}` : ""}
          {doc.internal && " · Interno (cliente não vê)"}
        </p>
      </div>
      {extra}
      <button
        type="button"
        onClick={open}
        className="grid size-9 place-items-center rounded-full transition-colors hover:bg-accent"
        aria-label="Abrir documento"
      >
        {opening ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="grid size-9 place-items-center rounded-full text-destructive transition-colors hover:bg-destructive/10"
          aria-label="Excluir documento"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

export function UploadButton({
  onFiles,
  label = "Enviar arquivo",
  className,
}: {
  onFiles: (files: File[]) => Promise<void>;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (!files.length) return;
          const tooBig = files.find((f) => f.size > 25 * 1024 * 1024);
          if (tooBig) {
            toast.error(`"${tooBig.name}" passa de 25 MB.`);
            return;
          }
          setBusy(true);
          try {
            await onFiles(files);
            toast.success(files.length > 1 ? "Arquivos enviados!" : "Arquivo enviado!");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Falha no envio.");
          } finally {
            setBusy(false);
          }
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => ref.current?.click()}
        className={cn("btn-primary !px-4 !py-2 !text-sm disabled:opacity-60", className)}
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} {label}
      </button>
    </>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-lg font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}
