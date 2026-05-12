import {
  empty,
  enforceAllowedOrigin,
  json,
  normalizeCourseId,
  readJson,
  trimText,
  verifyStudentSession,
} from "../lib/wizard-utils.mjs";
import { DEFAULT_LIMITS, getInteraction } from "../lib/runtime-contract.mjs";

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
    const interactionId = typeof body.interaction_id === "string" ? body.interaction_id.trim() : "unknown";
    const feedbackText = typeof body.feedback_text === "string" ? body.feedback_text : "";

    if (!courseId) return json(400, { error: "Invalid course id." }, "POST, OPTIONS");
    if (!studentId || !sessionToken) return json(400, { error: "Missing required fields." }, "POST, OPTIONS");
    if (interactionId !== "unknown" && !getInteraction(interactionId)) {
      return json(400, { error: "Unsupported interaction id." }, "POST, OPTIONS");
    }
    if (!["up", "down"].includes(body.thumbs)) return json(400, { error: "Invalid feedback rating." }, "POST, OPTIONS");
    if (feedbackText.length > DEFAULT_LIMITS.feedbackChars) {
      return json(400, { error: `Feedback exceeds ${DEFAULT_LIMITS.feedbackChars} characters.` }, "POST, OPTIONS");
    }

    const { ok, store, reason } = await verifyStudentSession(courseId, studentId, sessionToken);
    if (!ok) return json(401, { error: reason === "expired" ? "Session expired." : "Invalid session." }, "POST, OPTIONS");

    await store.setJSON(`feedback/${studentId}/${Date.now()}-${interactionId}`, {
      courseId,
      studentId,
      interactionId,
      thumbs: body.thumbs,
      feedback: trimText(feedbackText, DEFAULT_LIMITS.feedbackChars),
      createdAt: new Date().toISOString(),
    });

    return json(200, { ok: true }, "POST, OPTIONS");
  } catch (error) {
    console.error("[feedback-wizard] error:", error);
    return json(error.status || 500, { error: error.status ? error.message : "Server error." }, "POST, OPTIONS");
  }
}

export const config = {
  path: "/api/feedback-wizard",
};
