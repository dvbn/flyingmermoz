import {
  assertBudgetAvailable,
  checkWindowLimit,
  clientIp,
  empty,
  enforceAllowedOrigin,
  json,
  normalizeCourseId,
  readJson,
  recordUsage,
  validateStudentText,
  verifyStudentSession,
} from "../lib/wizard-utils.mjs";
import {
  FORBIDDEN_CLIENT_FIELDS,
  DEFAULT_LIMITS,
  getApprovedContext,
  getInteraction,
} from "../lib/runtime-contract.mjs";
import { callLlm } from "../lib/llm-provider.mjs";

function forbiddenFields(body) {
  return Object.keys(body || {}).filter((key) => FORBIDDEN_CLIENT_FIELDS.has(key));
}

export default async function handler(request) {
  const method = request.method || request.httpMethod;
  if (method === "OPTIONS") return empty(204, "POST, OPTIONS");
  if (method !== "POST") return json(405, { error: "POST only" }, "POST, OPTIONS");
  const originError = enforceAllowedOrigin(request, "POST, OPTIONS");
  if (originError) return originError;

  try {
    const body = await readJson(request);
    const burst = checkWindowLimit(`ask:${clientIp(request)}`, DEFAULT_LIMITS.maxRequestsPerMinute, 60 * 1000);
    if (!burst.ok) {
      return json(429, {
        error: "Too many requests. Wait briefly and try again.",
        retry_after: burst.retryAfter,
      }, "POST, OPTIONS");
    }

    const rejected = forbiddenFields(body);
    if (rejected.length > 0) {
      return json(400, { error: `Server-owned fields are not accepted: ${rejected.join(", ")}` }, "POST, OPTIONS");
    }

    const courseId = normalizeCourseId(body.course_id);
    const studentId = typeof body.student_id === "string" ? body.student_id.trim() : "";
    const sessionToken = typeof body.session_token === "string" ? body.session_token : "";
    const interaction = getInteraction(body.interaction_id);
    const locale = typeof body.locale === "string" ? body.locale.slice(0, 12) : "en";

    if (!courseId) return json(400, { error: "Invalid course id." }, "POST, OPTIONS");
    if (!interaction) return json(400, { error: "Unsupported interaction id." }, "POST, OPTIONS");

    const checkedText = validateStudentText(body.student_text, interaction);
    if (!checkedText.ok) return json(400, { error: checkedText.error }, "POST, OPTIONS");

    const { ok, store, student, reason } = await verifyStudentSession(courseId, studentId, sessionToken);
    if (!ok) return json(401, { error: reason === "expired" ? "Session expired." : "Invalid session." }, "POST, OPTIONS");

    const sessionCallLimit = Number(student.sessionCallLimit || 0);
    const sessionCallCount = Number(student.sessionCallCount || 0);
    if (sessionCallCount >= sessionCallLimit) {
      return json(429, {
        error: `Session limit reached: ${sessionCallLimit} LLM calls.`,
        remaining_calls: 0,
      }, "POST, OPTIONS");
    }

    const budget = await assertBudgetAvailable(store);
    if (!budget.ok) {
      return json(429, {
        error: budget.reason === "missing_prices"
          ? "Cost controls are not configured. Continue without live feedback until the instructor fixes setup."
          : "Daily budget reached. Continue the activity without live feedback.",
        estimated_cost_usd: budget.usage.estimatedCostUsd,
        daily_budget_usd: budget.dailyBudget,
      }, "POST, OPTIONS");
    }

    const context = getApprovedContext(interaction);
    const userPrompt = interaction.userPrompt({
      context,
      studentText: checkedText.text,
      locale,
    });

    const llm = await callLlm({
      systemPrompt: interaction.systemPrompt,
      userPrompt,
      maxTokens: interaction.maxResponseTokens,
      temperature: interaction.temperature,
    });

    const timestamp = new Date().toISOString();
    const updatedCallCount = sessionCallCount + 1;
    const recorded = await recordUsage(store, llm.usage);

    await store.setJSON(`students/${studentId}`, {
      ...student,
      lastApiCallAt: timestamp,
      sessionCallCount: updatedCallCount,
    });

    if (interaction.storeExchange) {
      await store.setJSON(`exchanges/${studentId}/${timestamp}-${body.interaction_id}`, {
        timestamp,
        courseId,
        studentId,
        interactionId: body.interaction_id,
        studentText: checkedText.text,
        response: llm.text,
        inputTokens: llm.usage.input_tokens,
        outputTokens: llm.usage.output_tokens,
        estimatedCostUsd: recorded.estimatedCost,
      });
    }

    return json(200, {
      response: llm.text,
      interaction_id: body.interaction_id,
      usage: {
        input_tokens: llm.usage.input_tokens,
        output_tokens: llm.usage.output_tokens,
        estimated_cost_usd: recorded.estimatedCost,
      },
      remaining_calls: Math.max(0, sessionCallLimit - updatedCallCount),
    }, "POST, OPTIONS");
  } catch (error) {
    console.error("[ask-wizard] error:", error.message || error);
    return json(error.status || 500, {
      error: "The assistant is unavailable. Continue the activity and try again later.",
    }, "POST, OPTIONS");
  }
}

export const config = {
  path: "/api/ask-wizard",
};
