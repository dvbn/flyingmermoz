import {
  createAnonymousStudentId,
  createSessionToken,
  empty,
  enforceAllowedOrigin,
  getAccessKey,
  getSessionSecret,
  getStoreForCourse,
  json,
  normalizeCourseId,
  readJson,
  safeEqual,
} from "../lib/wizard-utils.mjs";
import { DEFAULT_LIMITS } from "../lib/runtime-contract.mjs";

const authAttempts = new Map();
const MAX_AUTH_ATTEMPTS = Number.parseInt(process.env.WIZARD_MAX_AUTH_ATTEMPTS || "5", 10);
const AUTH_LOCKOUT_MINUTES = Number.parseInt(process.env.WIZARD_AUTH_LOCKOUT_MINUTES || "15", 10);

function clientKey(request) {
  return request.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isLocked(key) {
  const record = authAttempts.get(key);
  return Boolean(record?.lockedUntil && Date.now() < record.lockedUntil);
}

function recordFailure(key) {
  const record = authAttempts.get(key) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_AUTH_ATTEMPTS) {
    record.count = 0;
    record.lockedUntil = Date.now() + AUTH_LOCKOUT_MINUTES * 60 * 1000;
  }
  authAttempts.set(key, record);
  return record;
}

export default async function handler(request) {
  const method = request.method || request.httpMethod;
  if (method === "OPTIONS") return empty(204, "POST, OPTIONS");
  if (method !== "POST") return json(405, { error: "POST only" }, "POST, OPTIONS");
  const originError = enforceAllowedOrigin(request, "POST, OPTIONS");
  if (originError) return originError;

  try {
    const ip = clientKey(request);
    if (isLocked(ip)) return json(429, { error: "Too many attempts. Try again later." }, "POST, OPTIONS");

    const body = await readJson(request);
    const courseId = normalizeCourseId(body.course_id);
    const displayName = typeof body.display_name === "string" ? body.display_name.trim().slice(0, 120) : "";
    const accessKey = typeof body.access_key === "string" ? body.access_key : "";

    if (!courseId) return json(400, { error: "Invalid course id." }, "POST, OPTIONS");
    if (body.student_id) return json(400, { error: "Client-supplied student ids are disabled in this starter." }, "POST, OPTIONS");
    if (!accessKey) return json(400, { error: "Missing required fields." }, "POST, OPTIONS");

    const configuredKey = getAccessKey();
    if (!configuredKey) return json(500, { error: "Access key is not configured." }, "POST, OPTIONS");
    if (!getSessionSecret()) return json(500, { error: "Session secret is not configured." }, "POST, OPTIONS");
    if (!safeEqual(accessKey, configuredKey)) {
      recordFailure(ip);
      return json(401, { error: "Invalid access key." }, "POST, OPTIONS");
    }

    authAttempts.delete(ip);
    const studentId = createAnonymousStudentId();
    const sessionIssuedAt = new Date().toISOString();
    const sessionToken = createSessionToken(studentId, sessionIssuedAt);
    const sessionCallLimit = DEFAULT_LIMITS.maxCallsPerSession;
    const store = getStoreForCourse(courseId, "strong");

    await store.setJSON(`students/${studentId}`, {
      courseId,
      studentId,
      displayName,
      firstLoginAt: sessionIssuedAt,
      lastLoginAt: sessionIssuedAt,
      sessionIssuedAt,
      sessionToken,
      sessionCallLimit,
      sessionCallCount: 0,
    });

    return json(200, {
      session_token: sessionToken,
      course_id: courseId,
      student_id: studentId,
      session_call_limit: sessionCallLimit,
      session_call_count: 0,
      remaining_calls: sessionCallLimit,
    }, "POST, OPTIONS");
  } catch (error) {
    console.error("[auth-wizard] error:", error);
    return json(error.status || 500, { error: error.status ? error.message : "Server error." }, "POST, OPTIONS");
  }
}

export const config = {
  path: "/api/auth-wizard",
};
