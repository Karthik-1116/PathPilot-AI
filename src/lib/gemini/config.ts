import "server-only";

const DEFAULT_MODEL = "gemini-3.8-flash";
const DEFAULT_FALLBACK_MODEL = "gemini-3.5-flash";
const DEFAULT_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_PRIMARY_TIMEOUT_MS = 15_000;
const DEFAULT_FALLBACK_TIMEOUT_MS = 35_000;
const DEFAULT_TOTAL_TIMEOUT_MS = 50_000;

export interface GeminiConfig {
  apiKey: string;
  model: string;
  fallbackModel: string;
  baseUrl: string;
  primaryTimeoutMs: number;
  fallbackTimeoutMs: number;
  totalTimeoutMs: number;
  configured: boolean;
}

function readPositiveInt(
  value: string | undefined,
  fallback: number,
  max: number,
) {
  const parsed = Number.parseInt(value?.trim() ?? "", 10);

  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;

  return Math.min(parsed, max);
}

export function getGeminiConfig(): GeminiConfig {
  const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_FALLBACK_MODEL;
  const baseUrl =
    process.env.GEMINI_API_BASE_URL?.trim().replace(/\/+$/, "") ||
    DEFAULT_BASE_URL;

  return {
    apiKey,
    model,
    fallbackModel,
    baseUrl,
    primaryTimeoutMs: readPositiveInt(
      process.env.GEMINI_PRIMARY_TIMEOUT_MS,
      DEFAULT_PRIMARY_TIMEOUT_MS,
      55_000,
    ),
    fallbackTimeoutMs: readPositiveInt(
      process.env.GEMINI_FALLBACK_TIMEOUT_MS,
      DEFAULT_FALLBACK_TIMEOUT_MS,
      55_000,
    ),
    totalTimeoutMs: readPositiveInt(
      process.env.GEMINI_TOTAL_TIMEOUT_MS,
      DEFAULT_TOTAL_TIMEOUT_MS,
      55_000,
    ),
    configured: apiKey.length > 0,
  };
}

export function isGeminiConfigured() {
  return getGeminiConfig().configured;
}
