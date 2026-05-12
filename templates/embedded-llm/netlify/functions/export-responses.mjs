import {
  corsHeaders,
  csvEscape,
  empty,
  enforceAllowedOrigin,
  getAdminKey,
  getBearerKey,
  getStoreForCourse,
  isOlderThanRetention,
  json,
  listAll,
  normalizeCourseId,
  purgeExpiredRecords,
  safeEqual,
} from "../lib/wizard-utils.mjs";

export default async function handler(request) {
  const method = request.method || request.httpMethod;
  if (method === "OPTIONS") return empty(204, "GET, OPTIONS");
  if (method !== "GET") return json(405, { error: "GET only" }, "GET, OPTIONS");
  const originError = enforceAllowedOrigin(request, "GET, OPTIONS");
  if (originError) return originError;

  try {
    const url = new URL(request.url);
    const courseId = normalizeCourseId(url.searchParams.get("course_id"));
    const format = (url.searchParams.get("format") || "json").toLowerCase();
    const adminKey = getBearerKey(request);

    if (!courseId) return json(400, { error: "Invalid course id." }, "GET, OPTIONS");
    if (!["json", "csv"].includes(format)) return json(400, { error: "Invalid export format." }, "GET, OPTIONS");
    if (!getAdminKey()) return json(500, { error: "Admin key is not configured." }, "GET, OPTIONS");
    if (!safeEqual(adminKey, getAdminKey())) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders("GET, OPTIONS") });
    }

    const store = getStoreForCourse(courseId, "strong");
    await purgeExpiredRecords(store, ["exchanges/", "feedback/", "progress/", "students/"]);
    const blobs = await listAll(store, { prefix: "exchanges/" });
    const exchanges = [];

    for (const blob of blobs) {
      const data = await store.get(blob.key, { type: "json" }).catch(() => null);
      if (!data) continue;
      if (isOlderThanRetention(data.timestamp)) continue;
      exchanges.push({
        timestamp: data.timestamp,
        courseId: data.courseId || courseId,
        studentId: data.studentId,
        interactionId: data.interactionId,
        studentText: data.studentText,
        response: data.response,
        inputTokens: data.inputTokens || 0,
        outputTokens: data.outputTokens || 0,
        estimatedCostUsd: data.estimatedCostUsd || 0,
      });
    }

    exchanges.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (format === "csv") {
      const header = "timestamp,courseId,studentId,interactionId,studentText,response,inputTokens,outputTokens,estimatedCostUsd";
      const rows = exchanges.map((entry) =>
        `"${csvEscape(entry.timestamp)}","${csvEscape(entry.courseId)}","${csvEscape(entry.studentId)}","${csvEscape(entry.interactionId)}","${csvEscape(entry.studentText)}","${csvEscape(entry.response)}",${entry.inputTokens},${entry.outputTokens},${entry.estimatedCostUsd}`
      );
      return new Response([header, ...rows].join("\n"), {
        status: 200,
        headers: {
          ...corsHeaders("GET, OPTIONS"),
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${courseId}-wizard-exchanges.csv"`,
        },
      });
    }

    return new Response(JSON.stringify(exchanges, null, 2), {
      status: 200,
      headers: {
        ...corsHeaders("GET, OPTIONS"),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[export-responses] error:", error);
    return json(500, { error: "Server error." }, "GET, OPTIONS");
  }
}

export const config = {
  path: "/api/export-responses",
};
