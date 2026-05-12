import { getStore } from "@netlify/blobs";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEFAULT_LIMITS } from "./runtime-contract.mjs";

export const STORE_NAME = process.env.WIZARD_STORE_NAME || "wizard-template";
const requestWindows = new Map();

function configuredAllowedOrigin() {
  return (process.env.ALLOWED_ORIGIN || "").trim();
}

export function corsHeaders(methods = "GET, POST, OPTIONS") {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": methods,
  };
  const allowedOrigin = configuredAllowedOrigin();
  if (allowedOrigin) headers["Access-Control-Allow-Origin"] = allowedOrigin;
  return headers;
}

export function json(status, body, methods = "GET, POST, OPTIONS", extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(methods),
      ...extraHeaders,
    },
  });
}

export function empty(status = 204, methods = "GET, POST, OPTIONS") {
  return new Response(null, { status, headers: corsHeaders(methods) });
}

export function enforceAllowedOrigin(request, methods = "GET, POST, OPTIONS") {
  const allowedOrigin = configuredAllowedOrigin();
  const origin = request.headers?.get?.("origin") || "";
  if (!origin) return null;
  if (!allowedOrigin) return json(403, { error: "ALLOWED_ORIGIN is not configured." }, methods);
  if (origin === allowedOrigin) return null;
  return json(403, { error: "Origin not allowed." }, methods);
}

export function clientIp(request) {
  return request.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers?.get?.("x-real-ip")
    || "unknown";
}

export function checkWindowLimit(key, limit, windowMs) {
  const now = Date.now();
  const record = requestWindows.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }
  record.count += 1;
  requestWindows.set(key, record);
  return {
    ok: record.count <= limit,
    count: record.count,
    limit,
    retryAfter: Math.max(0, Math.ceil((record.resetAt - now) / 1000)),
  };
}

export async function readJson(request, maxBytes = 20 * 1024) {
  const text = typeof request.text === "function" ? await request.text() : request.body;
  if (typeof text !== "string") return {};
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    const error = new Error("Payload too large.");
    error.status = 413;
    throw error;
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error("Invalid JSON.");
    error.status = 400;
    throw error;
  }
}

export function normalizeCourseId(value) {
  const courseId = typeof value === "string" && value.trim()
    ? value.trim().toUpperCase()
    : "DEMO_COURSE";
  return /^[A-Z0-9_-]{1,64}$/.test(courseId) ? courseId : null;
}

export function createAnonymousStudentId() {
  return `anon_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export function normalizeStudentId(value) {
  if (typeof value !== "string") return null;
  const studentId = value.trim();
  return /^[A-Za-z0-9_-]{8,80}$/.test(studentId) ? studentId : null;
}

export function getStoreForCourse(courseId, consistency = "strong") {
  return getStore({ name: `${STORE_NAME}-${courseId}`, consistency });
}

export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function getAccessKey() {
  return process.env.WIZARD_ACCESS_KEY || "";
}

export function getAdminKey() {
  return process.env.WIZARD_ADMIN_KEY || "";
}

export function getSessionSecret() {
  return process.env.WIZARD_SESSION_SECRET || "";
}

export function createSessionToken(studentId, issuedAt, secret = getSessionSecret()) {
  const nonce = randomUUID();
  const signature = createHmac("sha256", secret)
    .update(`${studentId}:${issuedAt}:${nonce}`)
    .digest("hex");
  return `${issuedAt}.${nonce}.${signature}`;
}

export function isExpired(issuedAt) {
  const sessionHours = Number.parseFloat(process.env.WIZARD_SESSION_HOURS || "24");
  const issued = Date.parse(issuedAt);
  if (!Number.isFinite(issued)) return true;
  return Date.now() - issued > sessionHours * 60 * 60 * 1000;
}

export async function verifyStudentSession(courseId, studentId, sessionToken) {
  const store = getStoreForCourse(courseId, "strong");
  const normalizedStudentId = normalizeStudentId(studentId);
  if (!normalizedStudentId || !sessionToken) return { ok: false, store, student: null, reason: "missing" };
  const student = await store.get(`students/${normalizedStudentId}`, { type: "json" }).catch(() => null);
  if (!student || !safeEqual(student.sessionToken || "", sessionToken || "")) {
    return { ok: false, store, student: null, reason: "invalid" };
  }
  if (isExpired(student.sessionIssuedAt)) {
    return { ok: false, store, student, reason: "expired" };
  }
  return { ok: true, store, student, reason: "ok" };
}

export function wordCount(text) {
  if (typeof text !== "string") return 0;
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function trimText(text, maxChars) {
  return typeof text === "string" ? text.trim().slice(0, maxChars) : "";
}

export function validateStudentText(text, interaction) {
  const trimmed = trimText(text, interaction.maxStudentChars || DEFAULT_LIMITS.maxStudentChars);
  if (!trimmed) return { ok: false, text: "", error: "Student text is required." };
  const chars = text.length;
  const words = wordCount(text);
  const maxChars = interaction.maxStudentChars || DEFAULT_LIMITS.maxStudentChars;
  const maxWords = interaction.maxStudentWords || DEFAULT_LIMITS.maxStudentWords;
  if (chars > maxChars) return { ok: false, text: trimmed, error: `Student text exceeds ${maxChars} characters.` };
  if (words > maxWords) return { ok: false, text: trimmed, error: `Student text exceeds ${maxWords} words.` };
  return { ok: true, text: trimmed, words, chars };
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function estimateCost(usage = {}) {
  const inputTokens = Number(usage.input_tokens || 0);
  const outputTokens = Number(usage.output_tokens || 0);
  const inputPrice = Number.parseFloat(process.env.LLM_INPUT_USD_PER_M_TOKENS || "NaN");
  const outputPrice = Number.parseFloat(process.env.LLM_OUTPUT_USD_PER_M_TOKENS || "NaN");
  if (!Number.isFinite(inputPrice) || !Number.isFinite(outputPrice) || inputPrice <= 0 || outputPrice <= 0) {
    const error = new Error("LLM token prices are required for budget enforcement.");
    error.status = 500;
    throw error;
  }
  return ((inputTokens / 1_000_000) * inputPrice) + ((outputTokens / 1_000_000) * outputPrice);
}

export async function getDailyUsage(store) {
  const key = `usage/${todayKey()}`;
  const usage = await store.get(key, { type: "json" }).catch(() => null);
  return usage || { date: todayKey(), calls: 0, inputTokens: 0, outputTokens: 0, estimatedCostUsd: 0 };
}

export async function assertBudgetAvailable(store) {
  const dailyBudget = Number.parseFloat(process.env.WIZARD_DAILY_BUDGET_USD || "5");
  const inputPrice = Number.parseFloat(process.env.LLM_INPUT_USD_PER_M_TOKENS || "NaN");
  const outputPrice = Number.parseFloat(process.env.LLM_OUTPUT_USD_PER_M_TOKENS || "NaN");
  if (!Number.isFinite(inputPrice) || !Number.isFinite(outputPrice) || inputPrice <= 0 || outputPrice <= 0) {
    return { ok: false, usage: await getDailyUsage(store), dailyBudget, reason: "missing_prices" };
  }
  const usage = await getDailyUsage(store);
  if (dailyBudget > 0 && usage.estimatedCostUsd >= dailyBudget) {
    return { ok: false, usage, dailyBudget, reason: "daily_budget" };
  }
  return { ok: true, usage, dailyBudget, reason: "ok" };
}

export async function recordUsage(store, usageDelta = {}) {
  const key = `usage/${todayKey()}`;
  const current = await getDailyUsage(store);
  const estimatedCost = estimateCost(usageDelta);
  const next = {
    date: todayKey(),
    calls: current.calls + 1,
    inputTokens: current.inputTokens + Number(usageDelta.input_tokens || 0),
    outputTokens: current.outputTokens + Number(usageDelta.output_tokens || 0),
    estimatedCostUsd: Number((current.estimatedCostUsd + estimatedCost).toFixed(6)),
  };
  await store.setJSON(key, next);
  return { next, estimatedCost };
}

export async function listAll(store, options = {}) {
  const blobs = [];
  let cursor = null;
  do {
    const result = await store.list(cursor ? { ...options, cursor } : options);
    blobs.push(...(result.blobs || []));
    cursor = result.cursor || null;
  } while (cursor);
  return blobs;
}

export function csvEscape(value) {
  if (value === null || value === undefined) return "";
  let text = String(value).replace(/\r?\n/g, " ");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return text.replace(/"/g, '""');
}

export function getBearerKey(request) {
  const auth = request.headers?.get?.("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return "";
}

export function retentionDays() {
  const value = Number.parseInt(process.env.WIZARD_RETENTION_DAYS || "30", 10);
  return Number.isFinite(value) && value > 0 ? value : 30;
}

export function isOlderThanRetention(timestamp) {
  const parsed = Date.parse(timestamp);
  if (!Number.isFinite(parsed)) return false;
  return Date.now() - parsed > retentionDays() * 24 * 60 * 60 * 1000;
}

export async function purgeExpiredRecords(store, prefixes = []) {
  const deleted = [];
  for (const prefix of prefixes) {
    const blobs = await listAll(store, { prefix });
    for (const blob of blobs) {
      const data = await store.get(blob.key, { type: "json" }).catch(() => null);
      const timestamp = data?.timestamp || data?.createdAt || data?.updatedAt || data?.lastLoginAt;
      if (timestamp && isOlderThanRetention(timestamp)) {
        await store.delete(blob.key).catch(() => null);
        deleted.push(blob.key);
      }
    }
  }
  return deleted;
}
