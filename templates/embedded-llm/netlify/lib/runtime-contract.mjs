export const DEFAULT_LOCALE = "en";

export const DEFAULT_LIMITS = {
  maxStudentWords: 150,
  maxStudentChars: 1200,
  maxResponseTokens: 450,
  targetResponseWords: 200,
  maxCallsPerSession: Number.parseInt(process.env.WIZARD_MAX_CALLS_PER_SESSION || "10", 10),
  maxRequestsPerMinute: Number.parseInt(process.env.WIZARD_MAX_REQUESTS_PER_MINUTE || "20", 10),
  feedbackChars: 500,
  progressBytes: 10 * 1024,
  progressAnswerChars: 1200,
};

export const CONTEXTS = {
  "public-demo-summary": [
    "Replace this placeholder with a short instructor-approved context summary.",
    "Keep private source text server-side and bounded. Do not paste full readings here.",
  ].join(" "),
};

const BASE_STYLE_RULES = [
  "Use the requested output language when possible.",
  "Be concise and pedagogical.",
  "Do not use emojis unless the instructor explicitly enabled them.",
  "Do not invent course facts, citations, or grading rules.",
  "If the question is outside the approved role, say that briefly and redirect to the activity.",
  "Do not provide answer keys, private assessment content, or unsupported claims.",
];

export const INTERACTIONS = {
  "act-1-reflection": {
    screen: "end-of-act-1",
    purpose: "brief formative feedback",
    contextKey: "public-demo-summary",
    storeExchange: false,
    maxStudentWords: DEFAULT_LIMITS.maxStudentWords,
    maxStudentChars: DEFAULT_LIMITS.maxStudentChars,
    maxResponseTokens: DEFAULT_LIMITS.maxResponseTokens,
    targetResponseWords: 180,
    temperature: 0.2,
    systemPrompt: [
      "You are a bounded teaching assistant embedded in a course wizard.",
      "Give formative feedback on the student's reflection.",
      "Target 120-180 words. Use at most two short paragraphs.",
      ...BASE_STYLE_RULES,
    ].join(" "),
    userPrompt({ context, studentText, locale }) {
      return [
        `Output language: ${locale || DEFAULT_LOCALE}.`,
        "Approved course context:",
        context || "No course context was approved for this interaction.",
        "Student reflection:",
        studentText,
      ].join("\n\n");
    },
  },
  "act-2-hint": {
    screen: "act-2-exercise",
    purpose: "short hint after a student attempt",
    contextKey: "public-demo-summary",
    storeExchange: false,
    maxStudentWords: 120,
    maxStudentChars: 900,
    maxResponseTokens: 250,
    targetResponseWords: 90,
    temperature: 0.2,
    systemPrompt: [
      "You are a bounded teaching assistant embedded in a course wizard.",
      "Give a hint, not a full solution.",
      "Target 60-90 words.",
      ...BASE_STYLE_RULES,
    ].join(" "),
    userPrompt({ context, studentText, locale }) {
      return [
        `Output language: ${locale || DEFAULT_LOCALE}.`,
        "Approved course context:",
        context || "No course context was approved for this interaction.",
        "Student attempt:",
        studentText,
      ].join("\n\n");
    },
  },
  "act-2-reflection": {
    screen: "end-of-act-2",
    purpose: "brief formative feedback after the second activity",
    contextKey: "public-demo-summary",
    storeExchange: false,
    maxStudentWords: DEFAULT_LIMITS.maxStudentWords,
    maxStudentChars: DEFAULT_LIMITS.maxStudentChars,
    maxResponseTokens: DEFAULT_LIMITS.maxResponseTokens,
    targetResponseWords: 200,
    temperature: 0.2,
    systemPrompt: [
      "You are a bounded teaching assistant embedded in a course wizard.",
      "Give concise formative feedback and one concrete next step.",
      "Target 150-200 words. Use at most two short paragraphs.",
      ...BASE_STYLE_RULES,
    ].join(" "),
    userPrompt({ context, studentText, locale }) {
      return [
        `Output language: ${locale || DEFAULT_LOCALE}.`,
        "Approved course context:",
        context || "No course context was approved for this interaction.",
        "Student reflection:",
        studentText,
      ].join("\n\n");
    },
  },
};

export const FORBIDDEN_CLIENT_FIELDS = new Set([
  "system",
  "system_prompt",
  "prompt",
  "context",
  "model",
  "model_id",
  "temperature",
  "max_tokens",
  "api_key",
  "admin_key",
  "secret",
]);

export const PROGRESS_SCHEMA = {
  current_screen: { type: "string", maxChars: 80 },
  completed_screens: { type: "stringArray", maxItems: 50, maxChars: 80 },
  local_answers: { type: "stringMap", maxKeys: 50, maxChars: DEFAULT_LIMITS.progressAnswerChars },
  scores: { type: "numberMap", maxKeys: 50 },
  flags: { type: "booleanMap", maxKeys: 50 },
};

export function getInteraction(interactionId) {
  if (typeof interactionId !== "string") return null;
  return INTERACTIONS[interactionId] || null;
}

export function getApprovedContext(interaction) {
  if (!interaction?.contextKey) return "";
  return CONTEXTS[interaction.contextKey] || "";
}
