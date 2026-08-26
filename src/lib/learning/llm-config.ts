export function getLlmBaseUrl(): string {
  const raw = process.env.OPENAI_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  return raw.replace(/\/$/, "");
}

export function getLlmModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function isLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY && getLlmBaseUrl() && getLlmModel());
}
