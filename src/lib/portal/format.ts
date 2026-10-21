export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Dias até a data (negativo se já passou). */
export function daysUntil(iso: string | null | undefined) {
  if (!iso) return null;
  const target = new Date(`${iso.slice(0, 10)}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function dueLabel(iso: string | null | undefined) {
  const days = daysUntil(iso);
  if (days === null) return "Sem data";
  if (days < 0) return `Venceu há ${-days} dia${days === -1 ? "" : "s"}`;
  if (days === 0) return "Vence hoje";
  return `Em ${days} dia${days === 1 ? "" : "s"}`;
}

export function dueTone(iso: string | null | undefined) {
  const days = daysUntil(iso);
  if (days === null) return "text-muted-foreground";
  if (days < 0) return "text-destructive";
  if (days <= 30) return "text-amber-700";
  return "text-muted-foreground";
}
