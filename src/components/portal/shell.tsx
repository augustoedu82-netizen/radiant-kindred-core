import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Globe2, Loader2, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/portal/auth";
import { isSupabaseConfigured } from "@/lib/portal/supabase";
import type { Role } from "@/lib/portal/types";

export function PortalRoot({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface">{children}</div>
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight"
    >
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Globe2 className="size-4" />
      </span>
      Destrava<span className="text-primary">USA</span>
    </Link>
  );
}

export function Spinner({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> {label}
    </div>
  );
}

export function DemoBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="bg-highlight/30 px-5 py-2 text-center text-xs font-medium text-ink sm:text-sm">
      Modo demonstração: dados fictícios. Conecte o Supabase para usar com clientes reais.
    </div>
  );
}

/** Redireciona para /entrar se não houver login, ou se o papel não bater. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { loading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!profile) void navigate({ to: "/entrar" });
    else if (role === "admin" && profile.role !== "admin") void navigate({ to: "/portal" });
  }, [loading, profile, role, navigate]);

  if (loading || !profile || (role === "admin" && profile.role !== "admin")) return <Spinner />;
  return <>{children}</>;
}

export function PortalHeader({ subtitle, actions }: { subtitle: string; actions?: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <DemoBanner />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary sm:inline">
              {subtitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <span className="hidden text-sm text-muted-foreground md:inline">
              {profile?.full_name || profile?.email}
            </span>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                void navigate({ to: "/entrar" });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
