import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";
import { DEMO_CLIENT_EMAIL } from "./demo";
import type { Profile, Role } from "./types";

type AuthState = {
  loading: boolean;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<"logged" | "confirm">;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  enterDemo: (role: Role) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);
const DEMO_KEY = "destrava-portal-demo-role";

function readDemoRole(): Role | null {
  try {
    const v = sessionStorage.getItem(DEMO_KEY);
    return v === "admin" || v === "client" ? v : null;
  } catch {
    return null;
  }
}

function demoProfile(role: Role): Profile {
  return role === "admin"
    ? { id: "demo-admin", email: "admin@exemplo.com", full_name: "Eduardo (demonstração)", role }
    : { id: "demo-client", email: DEMO_CLIENT_EMAIL, full_name: "Mariana Costa", role };
}

async function loadProfile(): Promise<Profile | null> {
  const { data } = await supabase().auth.getUser();
  if (!data.user) return null;
  const { data: row } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();
  return (
    (row as Profile | null) ?? {
      id: data.user.id,
      email: data.user.email ?? "",
      full_name: (data.user.user_metadata?.["full_name"] as string) ?? null,
      role: "client",
    }
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const role = readDemoRole();
      setProfile(role ? demoProfile(role) : null);
      setLoading(false);
      return;
    }
    let active = true;
    const refresh = () =>
      loadProfile()
        .then((p) => active && setProfile(p))
        .finally(() => active && setLoading(false));
    void refresh();
    const { data } = supabase().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED")
        void refresh();
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(traduz(error.message));
    setProfile(await loadProfile());
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/portal`,
      },
    });
    if (error) throw new Error(traduz(error.message));
    if (data.session) {
      setProfile(await loadProfile());
      return "logged";
    }
    return "confirm";
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    const { error } = await supabase().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/portal` },
    });
    if (error) throw new Error(traduz(error.message));
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/entrar?nova-senha=1`,
    });
    if (error) throw new Error(traduz(error.message));
  }, []);

  const enterDemo = useCallback((role: Role) => {
    try {
      sessionStorage.setItem(DEMO_KEY, role);
    } catch {
      // sem sessionStorage a demonstração vale só até recarregar a página
    }
    setProfile(demoProfile(role));
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) await supabase().auth.signOut();
    try {
      sessionStorage.removeItem(DEMO_KEY);
    } catch {
      // ignorado
    }
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ loading, profile, signIn, signUp, sendMagicLink, resetPassword, enterDemo, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fora do AuthProvider");
  return ctx;
}

function traduz(msg: string) {
  if (/invalid login credentials/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(msg))
    return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (/already registered/i.test(msg)) return 'Esse e-mail já tem conta. Use "Entrar".';
  if (/password should be at least/i.test(msg))
    return "A senha precisa ter pelo menos 6 caracteres.";
  if (/signups not allowed|otp/i.test(msg)) return "Não encontramos uma conta com esse e-mail.";
  if (/rate limit/i.test(msg)) return "Muitas tentativas. Aguarde alguns minutos.";
  return msg;
}
