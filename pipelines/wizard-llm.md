# LLM-Enabled HTML Wizard Pipeline

## Purpose

Produce an interactive teaching wizard that combines structured HTML scenes with
optional LLM reflection, feedback, progress persistence, export, and deployment
support.

Use this recipe alongside `checklists/embedded-llm-runtime.md` when hosted LLM
calls, student data, auth, persistence, or exports are involved.
Also use `templates/interactive-html-patterns/README.md` and
`checklists/pedagogical-moments.md` for the non-LLM learning flow.

## Suitable Use Cases

- A guided module where students submit reflections and receive bounded
  feedback.
- A course activity that needs instructor-visible progress or exports.
- A teaching wizard deployed through Netlify, a static site plus server
  functions, or another hosted environment.

## Inputs

- Course name, level, target audience, and prerequisites.
- Interaction language for the planning conversation.
- Output language for the wizard, prompts, and guides.
- Learning objectives and source packet or source paths, converted to `.md`,
  `.tex`, `.txt`, `.json`, CSV, or another machine-readable format before the
  agent run unless already cleanly machine-readable.
- Source hierarchy: canonical, supporting, assessment, private, quarantine.
- LLM usage mode: instructor-only, student reflection, feedback helper, or full
  teaching assistant.
- Pedagogical moments: which scenes need a checkpoint, concept reveal,
  instructor debrief, or bounded LLM reflection.
- Auth, persistence, logging, export, and privacy requirements.
- Deployment target: local prototype, Netlify, static site plus functions, LMS,
  or other hosting.
- Time/token budget, cost constraints, and verification depth.
- Output directory, normally `work/<project-name>/`.

## User Decisions

Ask the instructor to choose:

- Student audience, difficulty, and learning objectives.
- Interaction language and output language.
- Tone for student-facing copy and LLM feedback.
- Emoji use: off by default unless explicitly requested.
- Visual direction: no added visuals, diagrams only, instructor-provided images,
  AI-generated images, or a mixed visual package.
- Branding/colors: HEC-inspired academic palette by default unless another
  brand system is provided.
- Footer attribution: default Flying Mermoz footer, or instructor
  override/removal if needed.
- What the LLM may answer and what it must refuse or defer.
- Where LLM interaction points appear: end-of-act reflection, inline hint,
  feedback after exercise, summary coach, or another bounded pattern.
- Where non-LLM pedagogical moments appear, so the lesson still works if the
  backend or provider is unavailable.
- Context handling: public context embedded in the HTML, private context kept
  server-side, retrieval-backed context, or no source context.
- Provider/data-sharing policy: what student text and source-derived context may
  be sent to an external LLM provider, retention/logging settings, and whether
  a no-LLM or local-only alternative is required.
- Default brevity caps for student prompts, reflection answers, and LLM
  responses.
- Whether student data is collected, stored, exported, or avoided entirely.
- Auth mode: none, simple instructor-provided access code, hosted auth, or LMS
  gate.
- Persistence mode: none, browser local storage, server persistence, or export
  only.
- Runtime safeguards: rate limits, response caps, fallback copy, and what
  happens when the LLM or backend is unavailable.
- Storage/export policy: identifiers, consent or notice language, retention,
  deletion/reset behavior, export authorization, and who can access exports.
- Deployment platform and available secrets or services.

## LLM Autonomy Boundaries

The LLM may propose prompt boundaries, reflection points, fallback copy,
function names, storage schema placeholders, rate-limit behavior, export shape,
and deployment steps after the instructor approves the plan.

The instructor decides whether students can interact with an LLM, what source
material is canonical, whether student data is stored, which deployment platform
is acceptable, and who can see exported responses.

The LLM must not invent facts, expose private sources, place secrets in client
code, collect unnecessary student data, or make unbounded chat available inside
student modules. If private source-derived context is required, keep that
context server-side or retrieve only bounded snippets; do not embed private
course text in a public HTML file.

The LLM must not send student text, private source-derived context, assessment
material, or identifiable data to an external provider unless the instructor has
explicitly approved that data-sharing path. If approval is missing, use a static
activity, local-only workflow, mocked responses, or a provider-free fallback.

Hosted LLM calls require server-side auth/session validation. Do not rely on a
client-only access code for live LLM, persistence, export, or admin endpoints.
Minimum safeguards are session expiration, brute-force protection, origin or
same-site checks where applicable, per-session quotas, and separate student
access from instructor export/admin access.

Persistence and export must minimize student data. Prefer pseudonymous or
course-local identifiers, document consent or notice language, limit raw
prompt/response storage, define retention and deletion/reset behavior, and
restrict export access to authorized instructors.

The LLM must not add emojis or AI-generated images by default. Visuals should be
purposeful, polished, legible, accessible, and tied to the learning objectives.
Prefer clear diagrams over decorative filler.

Default colors should follow an HEC-inspired academic palette: deep navy
`#002855`, accent blue `#0072CE`, teal `#00AEC7`, light blue `#e6f1fa`, white,
and neutral grays. The instructor may replace this with another brand system.

Generated artifacts should include a small, unobtrusive footer by default:
"Created with Flying Mermoz, an open-source toolkit for educational content."
Link the product name to the public repository URL when configured.

Default brevity caps should keep the first version usable in class: short
student-facing questions, bounded reflection fields, and concise LLM feedback.
A practical starting point is 3-6 clarifying questions during planning, 500-800
characters for student questions, 1,200 characters for reflection answers, and a
150-250 word LLM response cap. The instructor may relax these caps.

For hosted LLM wizard starters, use these first-pass runtime caps unless the
instructor explicitly changes them after reviewing cost and privacy:

- 150 student words and 1,200 student characters per LLM request
- 450 output tokens for reflection feedback, targeting about 180-220 words
- 10 LLM calls per session
- 20 `ask-wizard` requests per minute per function instance
- 500 characters for optional free-text feedback
- 10 KB for saved progress JSON

The default runtime architecture should be static-first and server-mediated:
the HTML wizard works without live LLM calls, while hosted LLM features call a
server function or API proxy. The client sends only the minimum request payload,
such as course id, student id, interaction id, student text, locale, and session
token. The public starter generates the course-local student id during auth; do
not let a shared access key claim arbitrary named ids. The server owns secrets,
validates the request, selects approved prompts and context, enforces token and
rate limits, and returns a bounded response or friendly fallback.

Use explicit runtime contracts rather than ad hoc chat. Define:

- `interaction_id` values and where each appears in the wizard
- allowed student input length and response length
- system prompt responsibilities and refusal policy
- context source for each interaction
- provider/data-sharing approval and provider retention/logging assumptions
- auth/session requirements and expiration behavior
- persistence mode, storage schema, export format, and retention policy
- rate limits, abuse handling, budget caps, and unavailable-service fallback
- cost estimate per student, per interaction, and per class run

Example hosted deployment shape:

```text
work/<project-name>/
  index.html
  package.json
  netlify.toml
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

For the public Netlify starter, positive token price variables are required for
live LLM calls. If they are missing or zero, the backend fails closed because
the daily budget cannot be enforced. `ALLOWED_ORIGIN` is required for hosted
browser sessions; when it is missing, requests with an `Origin` header fail
closed instead of accepting wildcard CORS.

Example browser request to a hosted LLM endpoint:

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

The server should reject requests that include client-supplied system prompts,
model names, unrestricted context, token caps, temperature, API keys, admin
keys, or other server-only parameters.

## Step-By-Step Workflow

1. Ask clarifying questions about objectives, source hierarchy, language choices,
   tone, emoji preference, visual direction, branding/colors, footer
   attribution, student LLM access, interaction-point placement, context
   handling, pedagogical moments, provider/data-sharing policy, data storage,
   privacy, deployment, time/token budget, cost limits, and verification depth.
2. Draft a plan covering scenes, LLM reflection points, prompt boundaries,
   non-LLM pedagogical moments, context sources, default brevity caps,
   refusal/fallback behavior, auth, persistence, export, provider/data-sharing
   approval, rate limits, budget caps, expected files, and checks.
3. Wait for instructor approval before creating files.
4. Build a static working wizard first, without server dependency.
5. Add disabled or mocked LLM interaction boxes with character or word counters,
   loading states, fallback copy, and clear student instructions.
6. Add the server function or API proxy only after the static flow works.
7. Add auth, persistence, feedback logging, and export only as selected by the
   instructor.
8. Write deployment, privacy, cost, and runtime notes, including required
   environment variables as placeholders only.
9. Ask the instructor to inspect the wizard and guides.
10. Revise through another plan and production pass if comments are provided.
11. If there are no comments, offer help configuring Netlify, server functions,
    environment variables, auth, storage, or LMS deployment.

## Expected Outputs

Write to `work/<project-name>/` unless the instructor chooses another path:

- `index.html`
- optional server function or API handler templates such as
  `netlify/functions/auth-wizard.mjs`, `ask-wizard.mjs`,
  `save-progress.mjs`, `feedback-wizard.mjs`, and `export-responses.mjs`
- optional template contract copied from `templates/embedded-llm/`
- optional storage schema notes
- `PRIVACY.md` when student data, auth, logging, hosted LLM calls, or stored
  responses are used
- `COST_NOTES.md` when hosted LLM calls are used
- `USER_GUIDE.md`
- `DEPLOYMENT.md`
- `VERIFICATION.md`
- `SOURCE_NOTES.md`

`USER_GUIDE.md` should include a short optional invitation to share creations,
issues, or feedback at `https://github.com/dvbn/flyingmermoz`.

## Verification Gates

- Gate 0: unresolved questions about LLM scope, student data, secrets,
  interaction-point placement, context handling, provider/data-sharing,
  deployment, and time/token budget are answered or explicitly deferred.
- Gate 1: sources are classified and assessment/private material is separated
  from student-facing output.
- Gate 2: language choices, tone, emoji preference, visual direction,
  branding/colors, footer attribution, prompt boundaries, context sources,
  provider/data-sharing policy, pedagogical moments, brevity caps, runtime
  safeguards, data policy, time/token budget, deployment, and output path are
  locked.
- Gate 3: the wizard opens locally, non-LLM flow works, LLM calls fail
  gracefully when unavailable, visuals are polished and accessible, and no
  secrets or private context are exposed in client code.
- Gate 4: the bundle includes user, deployment, verification, source notes,
  privacy/cost notes when relevant, and the approved footer attribution unless
  disabled.
- Gate 5: the instructor reviews student-facing prompts, feedback, refusal
  behavior, non-LLM pedagogical checkpoints, provider/data-sharing language,
  privacy language, cost estimate, and deployment steps; comments trigger
  revision.
- Gate 6: public-facing files contain no personal information, copied private
  material, secrets, answer keys, prompt dumps, or process clutter.

## Review And Revision Loop

Ask the instructor to test both successful and failed LLM paths, inspect stored
or exported data if enabled, and review whether the assistant stays inside the
approved pedagogical role. If comments are provided, ask targeted follow-up
questions, revise the plan, update files, and rerun checks.
Remind the instructor that polished responses are not verification; they should
read, test, and edit the wizard before sharing it with students.

At minimum, the instructor should test one normal request, one overlong request,
one out-of-scope request, one missing/expired-auth request if auth is enabled,
one unavailable-backend path, and one export or persistence path if enabled.
For hosted endpoints, also test forged sessions, unsupported `interaction_id`
values, replay or high-frequency requests, unauthorized export access, and
attempts to submit client-controlled system prompts, model names, parameters, or
context.

## Installation Or Deployment Assistance

If the instructor has no further comments, offer setup help for:

- Netlify static hosting and functions
- environment variables and secret handling
- local testing without live LLM calls
- hosted persistence or export-only workflows
- provider data-sharing settings and institutional privacy review needs
- rate limits, cost caps, and monitoring expectations
- LMS linking or embedding

## Low-Token Path

- Build the static wizard first.
- Use short, bounded LLM reflection prompts and concise response caps.
- Avoid persistence unless necessary.
- Provide deployment placeholders rather than full platform automation.
- Use mocked LLM responses until the instructor approves live hosted calls.

## Enriched Path

- Add richer feedback modes, export summaries, accessibility testing, privacy
  statements, cost notes, runtime dashboards, and deployment-specific checks.
- Search official deployment or API documentation when current setup details
  are required.

## Failure Modes And Recovery

- LLM scope too broad: reduce to reflection prompts with bounded feedback.
- Secret exposure risk: move secrets server-side or remove hosted calls.
- Private context leak risk: move source-derived context server-side, summarize
  it, or remove it from the public artifact.
- External sharing not approved: disable hosted LLM calls, use mocked/static
  feedback, or switch to a local-only workflow.
- Data policy unclear: default to no storage or export-only until clarified.
- Cost uncertainty: estimate token use and add low-token fallback.
- Rate-limit or abuse risk: add request caps, cooldown copy, and server-side
  validation before launch.
- Deployment blocked: keep a static local version that works without backend.

## Public/Private Content Policy

The instructor is responsible for rights, student privacy, data collection, and
publication review. Do not publish private course files, student data, copied
readings, answer keys, secrets, credentials, or identifying metadata. Use
placeholders for all service configuration.

## Example Status And Sanitized Example Plan

Use invented source material, fake deployment identifiers, and dummy
environment-variable names. A typical hosted wizard plan can look like this:

- Pattern: static learning path plus bounded reflection feedback.
- Scenes: introduction, source-grounded explanation, student exercise,
  reflection prompt, LLM feedback, non-LLM summary, export or completion screen.
- Runtime contract: one `interaction_id` per LLM touchpoint, fixed server-side
  system prompt, approved context source, 150 student-word request cap, 450
  output-token cap, 10 calls per session, and friendly fallback if unavailable.
- Pedagogical moments: the student first answers without LLM help, then receives
  bounded feedback, then reads a short course-grounded recap that does not
  depend on the LLM.
- Verification: test normal, overlong, out-of-scope, unavailable-backend,
  forged-session, unsupported-interaction, and unauthorized-export paths.

## Public Presentation Requirements

Public outputs should read as professional teaching-technology documentation.
Do not include prompt logs, model chatter, internal process notes, private
source excerpts, or LLM-coauthor framing.
