import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Projeto "destrava-portal". A publishable key é pública por natureza: quem protege os dados é o RLS.
const DEFAULT_URL = "https://tsxdmtsoxviekyabohif.supabase.co";
const DEFAULT_KEY = "sb_publishable_qw7Dw02S1p9lHvtLmueJAg_mcuD-yfY";

const url = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || DEFAULT_URL;
const key =
  ((import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    import.meta.env["VITE_SUPABASE_ANON_KEY"]) as string | undefined) || DEFAULT_KEY;

/** Sem URL e chave, o portal roda em modo demonstração com dados fictícios. */
export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!isSupabaseConfigured) throw new Error("Supabase não configurado");
  client ??= createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}

export const BUCKET = "documentos";
