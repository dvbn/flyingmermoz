# Embedded LLM Runtime Checklist

Use this checklist when a pipeline adds student-facing or instructor-facing LLM
calls to an HTML wizard, game, assistant, or other teaching artifact.

## Runtime Contract

- Define each interaction point by id, screen location, purpose, allowed input,
  response cap, and fallback copy.
- Keep the static artifact usable without live LLM calls whenever possible.
- Decide whether context is public, server-side private, retrieval-backed, or
  absent for each interaction point.
- Keep secrets and private source-derived context out of client-side code.
- Route hosted LLM calls through a server function or API proxy when secrets,
  private context, rate limits, or logging are involved.
- Require explicit instructor approval before student text, private
  source-derived context, assessment material, or identifiable data is sent to
  an external LLM provider.

Example interaction contract:

```json
{
  "interaction_id": "act-1-reflection",
  "screen": "end-of-act-1",
  "purpose": "brief formative feedback",
  "max_student_words": 150,
  "max_student_chars": 1200,
  "max_response_tokens": 450,
  "max_response_words": 180,
  "context_source": "server-side-approved-summary",
  "stores_response": false,
  "fallback": "Save your reflection locally and ask your instructor if the assistant is unavailable."
}
```

## Prompt And Context

- Use a short system prompt with role, tone, refusal policy, language, response
  length, and source-grounding rules.
- Pass only bounded, relevant context for the current interaction.
- Do not let the client submit arbitrary system prompts, model parameters, or
  unrestricted context.
- Keep system prompts, model allowlists, context selection, and token caps under
  server control for hosted calls.
- Refuse or defer questions outside the approved pedagogical role.
- Tell students the assistant is a learning aid, not an authority or substitute
  for instructor review.

## Data And Privacy

- Collect the minimum student data needed for the activity.
- Choose one auth mode: none, instructor-provided access code, hosted auth, or
  LMS gate; document session expiration and re-auth behavior.
- Choose one persistence mode: none, browser-local, export-only, or server-side.
- Prefer pseudonymous or course-local identifiers unless named identity is
  required and approved.
- Document provider retention/logging assumptions, student notice or consent,
  retention, deletion/reset behavior, export access, and who can view responses.
- Limit storage of raw prompts and responses; store summaries or exports only
  when they are needed for the teaching purpose.
- Log only what is needed for operations or abuse handling; redact student
  personal information and document log retention.
- Use placeholders for all service identifiers, secrets, and environment
  variables.
- Never put API keys, admin passwords, answer keys, or private course files in
  public artifacts.
- Require `PRIVACY.md` whenever hosted LLM calls handle student input, auth,
  logging, or stored responses.
- Require `COST_NOTES.md` whenever hosted LLM calls are used.

Example environment variables:

```text
LLM_API_KEY=<provider-api-key>
LLM_MODEL_ID=<approved-model-id>
WIZARD_ACCESS_KEY=<student-access-key>
WIZARD_ADMIN_KEY=<instructor-export-key>
WIZARD_SESSION_SECRET=<random-session-signing-secret>
WIZARD_SESSION_HOURS=24
WIZARD_MAX_CALLS_PER_SESSION=10
WIZARD_MAX_REQUESTS_PER_MINUTE=20
WIZARD_DAILY_BUDGET_USD=5
WIZARD_RETENTION_DAYS=30
LLM_INPUT_USD_PER_M_TOKENS=<input-price>
LLM_OUTPUT_USD_PER_M_TOKENS=<output-price>
ALLOWED_ORIGIN=<deployed-site-origin>
```

## Cost And Abuse Controls

- Cap student input length and generated response length.
- Estimate cost per interaction, per student, and per class run.
- Add rate limits, cooldown copy, and graceful errors for overload or abuse.
- Enforce controls server-side: model allowlist, maximum input bytes, maximum
  output tokens, per-session/IP/class quotas, daily budget cap, usage counters,
  and a disable or maintenance fallback.
- Prefer mocked LLM responses during local testing.
- Provide a low-token fallback path.
- Require a specific `ALLOWED_ORIGIN` for hosted browser sessions; do not
  default public templates to wildcard CORS.

## Verification

- Test static navigation with no backend configured.
- Test successful LLM response in the selected output language.
- Test overlong input, empty input, out-of-scope input, and malformed backend
  response.
- Test missing, invalid, or expired auth if auth exists.
- Test unavailable backend, rate-limit response, and network failure.
- Test persistence, export, and deletion or reset behavior if data is stored.
- Test that retention behavior purges or excludes records older than the
  approved retention window.
- Test forged sessions, unsupported `interaction_id` values, replay or
  high-frequency requests, and unauthorized export access.
- Test that a shared access-key flow cannot claim arbitrary named student ids;
  use server-generated course-local ids unless real auth or LMS identity binding
  is implemented.
- Test that client-supplied system prompts, model names, parameters, or
  unrestricted context are ignored or rejected.
- Inspect built browser-visible files and representative network payloads.
- Confirm browser-visible files contain no secrets, private context, answer
  keys, personal information, or copied private source material.
- Confirm the generated artifact and bundle contain no prompt logs, model
  chatter, LLM-coauthor framing, or internal process notes.

Example endpoint tests:

```text
POST /api/auth-wizard with a valid access key
POST /api/auth-wizard with a client-supplied student_id
POST /api/auth-wizard with invalid keys until lockout behavior is seen
POST /api/ask-wizard with a valid session and interaction id
POST /api/ask-wizard with an expired session
POST /api/ask-wizard with overlong student_text
POST /api/ask-wizard with an unsupported interaction_id
POST /api/ask-wizard with client-supplied system/model/context/max_tokens fields
POST /api/save-progress with an invalid session
POST /api/feedback-wizard with overlong feedback
GET  /api/export-responses without instructor authorization
GET  /api/export-responses with Authorization bearer token and format=csv
POST /api/reset-student with a valid session
```
