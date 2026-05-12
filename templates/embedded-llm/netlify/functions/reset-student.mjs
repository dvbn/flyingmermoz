import {
  empty,
  enforceAllowedOrigin,
  getStoreForCourse,
  json,
  normalizeCourseId,
  readJson,
  verifyStudentSession,
} from "../lib/wizard-utils.mjs";

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

    if (!courseId) return json(400, { error: "Invalid course id." }, "POST, OPTIONS");
    const { ok } = await verifyStudentSession(courseId, studentId, sessionToken);
    if (!ok) return json(401, { error: "Invalid session." }, "POST, OPTIONS");

    const store = getStoreForCourse(courseId, "strong");
    await Promise.all([
      store.delete(`students/${studentId}`).catch(() => null),
      store.delete(`progress/${studentId}`).catch(() => null),
    ]);

    const prefixes = [`feedback/${studentId}/`, `exchanges/${studentId}/`];
    for (const prefix of prefixes) {
      let cursor = null;
      do {
        const result = await store.list(cursor ? { prefix, cursor } : { prefix });
        await Promise.all((result.blobs || []).map((blob) => store.delete(blob.key).catch(() => null)));
        cursor = result.cursor || null;
      } while (cursor);
    }

    return json(200, { ok: true }, "POST, OPTIONS");
  } catch (error) {
    console.error("[reset-student] error:", error);
    return json(error.status || 500, { error: error.status ? error.message : "Server error." }, "POST, OPTIONS");
  }
}

export const config = {
  path: "/api/reset-student",
};
