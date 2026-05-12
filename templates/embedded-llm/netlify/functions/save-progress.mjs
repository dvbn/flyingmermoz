import {
  empty,
  enforceAllowedOrigin,
  json,
  normalizeCourseId,
  readJson,
  verifyStudentSession,
} from "../lib/wizard-utils.mjs";
import { DEFAULT_LIMITS, PROGRESS_SCHEMA } from "../lib/runtime-contract.mjs";

function sanitizeProgress(progress) {
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) return null;
  const encoded = JSON.stringify(progress);
  if (Buffer.byteLength(encoded, "utf8") > DEFAULT_LIMITS.progressBytes) return null;

  const cleaned = {};
  for (const [key, spec] of Object.entries(PROGRESS_SCHEMA)) {
    const value = progress[key];
    if (value === undefined) continue;

    if (spec.type === "string" && typeof value === "string") {
      cleaned[key] = value.trim().slice(0, spec.maxChars);
    }

    if (spec.type === "stringArray" && Array.isArray(value)) {
      cleaned[key] = value
        .filter((item) => typeof item === "string")
        .slice(0, spec.maxItems)
        .map((item) => item.trim().slice(0, spec.maxChars));
    }

    if (spec.type === "stringMap" && value && typeof value === "object" && !Array.isArray(value)) {
      cleaned[key] = {};
      for (const [entryKey, entryValue] of Object.entries(value).slice(0, spec.maxKeys)) {
        if (typeof entryValue === "string") {
          cleaned[key][entryKey.slice(0, 80)] = entryValue.trim().slice(0, spec.maxChars);
        }
      }
    }

    if (spec.type === "numberMap" && value && typeof value === "object" && !Array.isArray(value)) {
      cleaned[key] = {};
      for (const [entryKey, entryValue] of Object.entries(value).slice(0, spec.maxKeys)) {
        if (typeof entryValue === "number" && Number.isFinite(entryValue)) {
          cleaned[key][entryKey.slice(0, 80)] = entryValue;
        }
      }
    }

    if (spec.type === "booleanMap" && value && typeof value === "object" && !Array.isArray(value)) {
      cleaned[key] = {};
      for (const [entryKey, entryValue] of Object.entries(value).slice(0, spec.maxKeys)) {
        if (typeof entryValue === "boolean") {
          cleaned[key][entryKey.slice(0, 80)] = entryValue;
        }
      }
    }
  }

  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

export default async function handler(request) {
  const method = request.method || request.httpMethod;
  if (method === "OPTIONS") return empty(204, "POST, OPTIONS");
  if (method !== "POST") return json(405, { error: "POST only" }, "POST, OPTIONS");
  const originError = enforceAllowedOrigin(request, "POST, OPTIONS");
  if (originError) return originError;

  try {
    const body = await readJson(request);
    const courseId = normalizeCourseId(body.course_id);
    const studentId = typeof body.student_id === "string" ? body.student_id.trim() : "";
    const sessionToken = typeof body.session_token === "string" ? body.session_token : "";
    const progress = sanitizeProgress(body.progress);

    if (!courseId) return json(400, { error: "Invalid course id." }, "POST, OPTIONS");
    if (!studentId || !sessionToken || !progress) {
      return json(400, { error: "Missing or invalid progress payload." }, "POST, OPTIONS");
    }

    const { ok, store, reason } = await verifyStudentSession(courseId, studentId, sessionToken);
    if (!ok) return json(401, { error: reason === "expired" ? "Session expired." : "Invalid session." }, "POST, OPTIONS");

    await store.setJSON(`progress/${studentId}`, {
      courseId,
      studentId,
      updatedAt: new Date().toISOString(),
      progress,
    });

    return json(200, { ok: true }, "POST, OPTIONS");
  } catch (error) {
    console.error("[save-progress] error:", error);
    return json(error.status || 500, { error: error.status ? error.message : "Server error." }, "POST, OPTIONS");
  }
}

export const config = {
  path: "/api/save-progress",
};
