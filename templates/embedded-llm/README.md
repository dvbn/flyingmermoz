# Embedded LLM Wizard Template

This is a public-safe Netlify starter for an LLM-enabled teaching wizard. Copy
the structure into `work/<project-name>/` when the instructor approves a hosted
LLM path, then edit the server-side runtime contract before connecting the
browser UI.

Provider approval is required before deployment. The default provider adapter
sends approved student text and approved context to Anthropic's Messages API;
confirm that this provider is acceptable for the institution before setting
`LLM_API_KEY`, or replace `netlify/lib/llm-provider.mjs` first.

The template is intentionally strict: the browser sends course id, display name,
session token, student text, locale, and an `interaction_id`; the server
generates the course-local student id and chooses the prompt, context, model,
token caps, storage policy, and response shape.

## File Layout

```text
work/<project-name>/
  index.html
  package.json
  package-lock.json
  netlify.toml
  netlify/lib/llm-provider.mjs
  netlify/lib/runtime-contract.mjs
  netlify/lib/wizard-utils.mjs
  netlify/functions/auth-wizard.mjs
  netlify/functions/ask-wizard.mjs
  netlify/functions/save-progress.mjs
  netlify/functions/feedback-wizard.mjs
  netlify/functions/reset-student.mjs
  netlify/functions/export-responses.mjs
  USER_GUIDE.md
  DEPLOYMENT.md
  PRIVACY.md
  COST_NOTES.md
  VERIFICATION.md
  SOURCE_NOTES.md
```

## Environment Variables

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

Use placeholders in documentation, never real keys. Configure real values only
in the hosting provider's environment-variable UI.

`ALLOWED_ORIGIN` is required for hosted browser sessions. Without it, function
requests that include an `Origin` header fail closed instead of allowing every
origin.

The starter ships with an Anthropic Messages API-compatible adapter in
`netlify/lib/llm-provider.mjs`. To use another provider, replace that adapter
while keeping the same `callLlm` return shape.

## Runtime Contract

Edit `netlify/lib/runtime-contract.mjs` before connecting the UI. Each
interaction must define:

- `interaction_id`
- screen location and purpose
- the non-LLM pedagogical moment it supports, if any
- maximum student words and characters
- maximum response tokens and target response words
- prompt policy and refusal rules
- server-side context key
- whether exchanges or feedback may be stored

Default caps are deliberately small:

```text
student_text: 150 words and 1,200 characters
llm_response: 450 output tokens, targeting about 180-220 words
calls: 10 LLM calls per session
burst limit: 20 ask-wizard requests per minute per function instance
feedback: 500 characters
progress payload: 10 KB JSON
```

The instructor may relax these caps only after reviewing cost, privacy, and
classroom-use constraints.

The starter's in-function burst maps and Netlify Blobs budget/session records
are classroom-scale soft guards. In a serverless environment they can be
process-local or non-atomic under concurrent traffic. For production, high
traffic, or high-stakes use, add provider or platform rate limits, durable
transactional counters, or a database with atomic writes.

## Pedagogical Contract

An embedded LLM should support the learning sequence, not become an unbounded
chat surface. For each LLM interaction, define:

- what the student did before requesting feedback
- what concept or source-backed idea the feedback should connect to
- what the static recap says if the LLM is unavailable
- what the student should do after reading the response
- what the assistant must refuse, defer, or redirect

The HTML should still contain the core explanation, checkpoint, and summary
without live LLM calls. The LLM may add bounded feedback, a hint, or a short
reflection response; it should not be the only place where the course concept is
explained.

Progress persistence is schema-limited by default. The starter stores only
`current_screen`, `completed_screens`, `local_answers`, `scores`, and `flags`;
it ignores unknown progress fields instead of storing arbitrary client payloads.

## Client-To-Server Request

Auth request:

```json
{
  "course_id": "DEMO_COURSE",
  "display_name": "Student 001",
  "access_key": "<student-access-key>"
}
```

The browser should send only the fields the server needs:

```json
{
  "course_id": "DEMO_COURSE",
  "student_id": "<server-generated-student-id>",
  "interaction_id": "act-2-reflection",
  "student_text": "I think the mechanism works because...",
  "locale": "en",
  "session_token": "<opaque-session-token>"
}
```

Reject any request that tries to send client-controlled system prompts, model
names, unrestricted context, API keys, admin keys, token caps, temperature, or
other server-only parameters.

Expected successful response:

```json
{
  "response": "Short bounded feedback for the student.",
  "interaction_id": "act-2-reflection",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "estimated_cost_usd": 0
  },
  "remaining_calls": 9
}
```

## Server Function Responsibilities

`auth-wizard.mjs`

- Validate the student access key server-side.
- Generate a course-local anonymous student id. Do not let a shared access key
  claim arbitrary named ids; named identity requires real hosted auth or LMS
  identity binding.
- Issue an opaque signed session token.
- Expire sessions using `WIZARD_SESSION_HOURS`.
- Apply brute-force protection or delegate it to the hosting layer.
- Store the minimum session record needed to validate later calls.

`ask-wizard.mjs`

- Validate method, origin or same-site assumptions, session token, payload size,
  `interaction_id`.
- Reject client-supplied system prompts, model names, context, temperature,
  token caps, API keys, admin keys, or arbitrary server parameters.
- Enforce student word/character limits, response token limits, per-session
  quotas, and daily budget caps.
- Select the approved system prompt and context server-side.
- Call the selected provider only after instructor-approved data-sharing rules
  are satisfied.
- Return a bounded response or a friendly fallback.
- Store raw exchanges only when the selected interaction explicitly allows it.

`save-progress.mjs`

- Store only approved progress fields.
- Avoid storing raw prompts/responses unless required and approved.
- Support reset or deletion when the selected privacy policy requires it.

`feedback-wizard.mjs`

- Accept only thumbs-up/down plus short optional feedback.
- Cap free-text feedback.
- Store feedback under the validated session only.

`export-responses.mjs`

- Require instructor/admin authorization.
- Accept the admin key only through `Authorization: Bearer <key>`.
- Export only approved fields.
- Purge records older than `WIZARD_RETENTION_DAYS` before export.
- Never expose answer keys, secrets, private source files, or unrelated student
  data.

`reset-student.mjs`

- Validate the student session.
- Delete that student's session, progress, feedback, and stored exchanges.
- Use this for student-initiated reset/deletion requests.

## Prompt Policy

All prompts are server-owned. Put pedagogical instructions in
`runtime-contract.mjs`, not in the browser. A good interaction prompt states:

- the assistant's limited teaching role
- the selected output language and tone
- target length and hard response cap
- source-grounding rule
- refusal rule for off-topic, answer-key, private-source, or unsupported claims
- style constraints, such as no emojis and no long bullet lists by default

The server should build the provider request from:

```text
approved system prompt
approved context summary or no context
student_text
locale
interaction metadata
```

The server should never build the provider request from browser-supplied
`system`, `prompt`, `context`, `model`, `temperature`, or `max_tokens` fields.

## Verification Commands

Use direct HTTP tests or an equivalent browser/API test runner:

```text
POST /api/auth-wizard with a valid access key
POST /api/auth-wizard with an invalid access key until lockout behavior is seen
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

The artifact is not ready until the static wizard works without a backend and
all hosted failure paths return safe, understandable messages.

## Installation

From the generated project directory:

```bash
npm install
npm run dev
```

For production, set environment variables in Netlify, deploy the static wizard
and functions, then run the verification commands above before sharing the link
with students.
