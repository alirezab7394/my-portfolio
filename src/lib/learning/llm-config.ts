const GEMINI_OPENAI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai";

function firstEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function usesGeminiKey(): boolean {
  return Boolean(firstEnv("GEMINI_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY", "GOOGLE_API_KEY"));
}

export function getLlmApiKey(): string | undefined {
  return firstEnv("GEMINI_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY", "GOOGLE_API_KEY", "OPENAI_API_KEY");
}

export function getLlmBaseUrl(): string {
  const raw =
    firstEnv("GEMINI_URL", "OPENAI_URL", "OPENAI_BASE_URL") ||
    (usesGeminiKey() ? GEMINI_OPENAI_BASE : "https://api.openai.com/v1");
  return raw.replace(/\/$/, "");
}

export function isGeminiEndpoint(): boolean {
  return getLlmBaseUrl().includes("generativelanguage.googleapis.com") || usesGeminiKey();
}

export function getLlmModel(): string {
  return (
    firstEnv("GEMINI_MODEL", "OPENAI_MODEL") ||
    (isGeminiEndpoint() ? "gemini-2.5-flash" : "gpt-4o-mini")
  );
}

export function getEmbeddingModel(): string {
  return (
    firstEnv("GEMINI_EMBEDDING_MODEL", "OPENAI_EMBEDDING_MODEL") ||
    (isGeminiEndpoint() ? "gemini-embedding-001" : "text-embedding-3-small")
  );
}

export function isLlmConfigured(): boolean {
  return Boolean(getLlmApiKey() && getLlmBaseUrl() && getLlmModel());
}
