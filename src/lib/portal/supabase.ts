import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const key = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  import.meta.env["VITE_SUPABASE_ANON_KEY"]) as string | undefined;

/** Sem as chaves do Supabase, o portal roda em modo demonstração com dados fictícios. */
export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!isSupabaseConfigured) throw new Error("Supabase não configurado");
  client ??= createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}

export const BUCKET = "documentos";
