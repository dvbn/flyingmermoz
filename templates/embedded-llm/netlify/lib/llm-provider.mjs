// Default provider adapter.
//
// This starter ships with an Anthropic Messages API-compatible adapter because
// it is small and easy to inspect. To use another provider, replace only this
// file and keep the public `callLlm` contract unchanged.

function extractTextFromAnthropic(data) {
  if (!Array.isArray(data?.content)) return "";
  return data.content
    .filter((block) => block?.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n\n")
    .trim();
}

export async function callLlm({ systemPrompt, userPrompt, maxTokens, temperature }) {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL_ID;
  if (!apiKey || !model) throw new Error("LLM provider is not configured.");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`LLM provider error ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = extractTextFromAnthropic(data);
  if (!text) throw new Error("LLM provider returned an empty response.");

  return {
    text,
    usage: {
      input_tokens: data.usage?.input_tokens || 0,
      output_tokens: data.usage?.output_tokens || 0,
    },
    model,
  };
}
