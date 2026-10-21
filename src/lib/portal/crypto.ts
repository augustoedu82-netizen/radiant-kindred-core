// Cofre de senhas: AES-GCM com chave derivada (PBKDF2) da senha mestra do admin.
// A senha mestra nunca sai do navegador; o banco só recebe o texto cifrado.

const enc = new TextEncoder();
const dec = new TextDecoder();
const ITERATIONS = 310_000;

const toB64 = (buf: ArrayBuffer | Uint8Array) =>
  btoa(
    String.fromCharCode(...new Uint8Array(buf instanceof Uint8Array ? buf : new Uint8Array(buf))),
  );
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Retorna "v1.<salt>.<iv>.<cifra>" em base64. */
export async function encryptSecret(plain: string, passphrase: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain));
  return `v1.${toB64(salt)}.${toB64(iv)}.${toB64(cipher)}`;
}

export async function decryptSecret(payload: string, passphrase: string) {
  const [version, salt, iv, cipher] = payload.split(".");
  if (version !== "v1" || !salt || !iv || !cipher) throw new Error("Formato desconhecido");
  const key = await deriveKey(passphrase, fromB64(salt));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(iv) },
    key,
    fromB64(cipher),
  );
  return dec.decode(plain);
}

export const VAULT_CHECK_KEY = "vault_check";
export const VAULT_CHECK_VALUE = "destrava-usa-cofre";
