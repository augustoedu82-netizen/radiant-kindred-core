import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Building2, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoBanner, Logo, PortalRoot } from "@/components/portal/shell";
import { useAuth } from "@/lib/portal/auth";
import { isSupabaseConfigured, supabase } from "@/lib/portal/supabase";
import { WHATSAPP } from "@/lib/portal/content";

export const Route = createFileRoute("/entrar")({
  ssr: false,
  component: () => (
    <PortalRoot>
      <EntrarPage />
    </PortalRoot>
  ),
  head: () => ({
    meta: [{ title: "Área do cliente — DestravaUSA" }, { name: "robots", content: "noindex" }],
  }),
});

type Mode = "entrar" | "criar" | "esqueci" | "nova-senha";

function EntrarPage() {
  const { loading, profile, signIn, signUp, resetPassword, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(() =>
    typeof window !== "undefined" && window.location.search.includes("nova-senha")
      ? "nova-senha"
      : "entrar",
  );
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loading || !profile || mode === "nova-senha") return;
    void navigate({ to: profile.role === "admin" ? "/admin" : "/portal" });
  }, [loading, profile, mode, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "entrar") {
        await signIn(email, password);
      } else if (mode === "criar") {
        const result = await signUp(email, password, name);
        if (result === "confirm") {
          toast.success("Conta criada! Enviamos um link de confirmação para o seu e-mail.");
          setMode("entrar");
        }
      } else if (mode === "esqueci") {
        await resetPassword(email);
        toast.success(
          "Se o e-mail estiver cadastrado, você vai receber um link para criar uma nova senha.",
        );
        setMode("entrar");
      } else {
        const { error } = await supabase().auth.updateUser({ password });
        if (error) throw new Error(error.message);
        toast.success("Senha alterada!");
        window.history.replaceState(null, "", "/entrar");
        setMode("entrar");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo deu errado. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<Mode, [string, string]> = {
    entrar: ["Área do cliente", "Acompanhe sua LLC, seus documentos e suas obrigações."],
    criar: ["Primeiro acesso", "Use o mesmo e-mail que você informou no contrato."],
    esqueci: ["Esqueci minha senha", "Enviaremos um link para você criar uma senha nova."],
    "nova-senha": ["Criar nova senha", "Digite a nova senha da sua conta."],
  };

  return (
    <>
      <DemoBanner />
      <div className="hero-glow grid min-h-[calc(100vh-2rem)] lg:grid-cols-2">
        <aside className="hidden flex-col justify-between bg-ink p-12 text-ink-foreground lg:flex">
          <Logo />
          <div>
            <h2 className="text-3xl font-extrabold leading-tight">
              Sua empresa nos EUA,{" "}
              <span className="text-highlight">organizada em um só lugar.</span>
            </h2>
            <ul className="mt-8 space-y-4 text-sm text-ink-foreground/80">
              {[
                [Building2, "Status do registro da sua LLC em tempo real"],
                [ShieldCheck, "Documentos oficiais guardados com segurança"],
                [UserRound, "Tutoriais de bancos e gateways em português"],
              ].map(([Icon, t]) => {
                const I = Icon as typeof Building2;
                return (
                  <li key={t as string} className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-white/10">
                      <I className="size-4" />
                    </span>
                    {t as string}
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-xs text-ink-foreground/60">
            Assessoria privada, sem afiliação com órgãos governamentais dos EUA.
          </p>
        </aside>

        <main className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            <h1 className="text-3xl font-extrabold">{titles[mode][0]}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{titles[mode][1]}</p>

            {isSupabaseConfigured ? (
              <form onSubmit={submit} className="surface-card mt-8 space-y-4 p-6">
                {mode === "criar" && (
                  <Field label="Nome completo">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </Field>
                )}
                {mode !== "nova-senha" && (
                  <Field label="E-mail">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </Field>
                )}
                {mode !== "esqueci" && (
                  <Field label={mode === "entrar" ? "Senha" : "Crie uma senha (mín. 6 caracteres)"}>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete={mode === "entrar" ? "current-password" : "new-password"}
                    />
                  </Field>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  {
                    {
                      entrar: "Entrar",
                      criar: "Criar minha conta",
                      esqueci: "Enviar link",
                      "nova-senha": "Salvar senha",
                    }[mode]
                  }
                </button>

                <div className="flex flex-wrap justify-between gap-2 pt-1 text-sm">
                  {mode === "entrar" ? (
                    <>
                      <button
                        type="button"
                        className="font-semibold text-primary"
                        onClick={() => setMode("criar")}
                      >
                        Primeiro acesso? Criar conta
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground"
                        onClick={() => setMode("esqueci")}
                      >
                        Esqueci a senha
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="font-semibold text-primary"
                      onClick={() => setMode("entrar")}
                    >
                      Voltar para o login
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="surface-card mt-8 space-y-3 p-6">
                <p className="text-sm text-muted-foreground">
                  O login real é ativado quando o Supabase for conectado. Por enquanto, veja como
                  fica:
                </p>
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={() => enterDemo("client")}
                >
                  Ver como cliente
                </button>
                <button
                  type="button"
                  className="btn-ghost w-full"
                  onClick={() => enterDemo("admin")}
                >
                  Ver painel do Eduardo (admin)
                </button>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ainda não é cliente?{" "}
              <a href={WHATSAPP} className="font-semibold text-primary">
                Fale com a gente no WhatsApp
              </a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
