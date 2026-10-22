import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCompany, updateCompany } from "@/lib/portal/api";
import { STEPS, US_STATES } from "@/lib/portal/content";
import type { Company } from "@/lib/portal/types";

type ClientInfo = Pick<Company, "client_name" | "client_email" | "client_phone">;

const emptyForm = {
  client_name: "",
  client_email: "",
  client_phone: "",
  company_name: "",
  state: "",
  annual_report_due: "",
};

/**
 * Cadastra uma LLC. Sem `client`, é um cliente novo; com `client`, é mais uma LLC
 * do mesmo cliente (mesmo e-mail = mesma conta no portal).
 */
export function NewCompanyDialog({
  open,
  onOpenChange,
  client,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client?: ClientInfo;
}) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [existing, setExisting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    setExisting(false);
    setForm({
      ...emptyForm,
      client_name: client?.client_name ?? "",
      client_email: client?.client_email ?? "",
      client_phone: client?.client_phone ?? "",
    });
  }, [open, client]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.state) {
      toast.error("Escolha o estado da LLC.");
      return;
    }
    setBusy(true);
    try {
      let c = await createCompany({
        client_name: form.client_name,
        client_email: form.client_email,
        client_phone: form.client_phone || null,
        company_name: form.company_name,
        state: form.state,
      });
      if (existing) {
        // LLC aberta antes de chegar na Destrava: etapas de abertura já estão concluídas.
        const when = new Date().toISOString();
        c = await updateCompany(c.id, {
          status: "ativa",
          steps: Object.fromEntries(STEPS.map((s) => [s.key, when])),
          annual_report_due: form.annual_report_due || null,
          admin_notes: "LLC já existente: cliente veio para manutenção anual.",
        });
      }
      await qc.invalidateQueries({ queryKey: ["companies"] });
      await qc.invalidateQueries({ queryKey: ["client-companies"] });
      toast.success(
        client
          ? "LLC adicionada. Ela aparece no portal do cliente junto com as outras."
          : "Cliente cadastrado! Peça para ele criar a conta em /entrar com esse e-mail.",
      );
      onOpenChange(false);
      void navigate({ to: "/admin/$id", params: { id: c.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível cadastrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? `Nova LLC de ${client.client_name}` : "Novo cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {!client && (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Nome do cliente</Label>
                <Input value={form.client_name} onChange={set("client_name")} required />
              </div>
              <div className="space-y-1.5">
                <Label>E-mail (login do portal)</Label>
                <Input
                  type="email"
                  value={form.client_email}
                  onChange={set("client_email")}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp</Label>
                <Input
                  value={form.client_phone}
                  onChange={set("client_phone")}
                  placeholder="+55 ..."
                />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label>Nome da LLC</Label>
            <Input
              value={form.company_name}
              onChange={set("company_name")}
              required
              placeholder="Exemplo LLC"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha o estado" />
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

          <label className="flex items-start gap-3 rounded-2xl border border-border p-3 sm:col-span-2">
            <Switch checked={existing} onCheckedChange={setExisting} className="mt-0.5" />
            <span className="text-sm">
              <span className="font-semibold">Essa LLC já existe</span>
              <span className="block text-muted-foreground">
                O cliente já abriu antes e vai passar para você cuidar (Annual Report, renovação).
                As etapas de abertura entram como concluídas.
              </span>
            </span>
          </label>

          {existing && (
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Vencimento do próximo Annual Report (se souber)</Label>
              <Input
                type="date"
                value={form.annual_report_due}
                onChange={set("annual_report_due")}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-primary sm:col-span-2 disabled:opacity-60"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}{" "}
            {client ? "Adicionar LLC" : "Cadastrar cliente"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
