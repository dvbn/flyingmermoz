# Flying Mermoz Agent Instructions

Use this repository to produce teaching artifacts from instructor-provided
course material. The instructor owns pedagogy, source choices, copyright,
privacy, deployment decisions, and final publication review.

## Read Order

Always read:

1. `README.md`
2. `pipelines/PIPELINE_CONTRACT.md`
3. The selected recipe in `pipelines/`
4. `checklists/source-prep.md`

Then read only what applies:

- `skills/pdf-to-markdown/SKILL.md` when PDF parsing is explicitly approved.
- `skills/media-to-transcript/SKILL.md` when video or audio transcription is
  explicitly approved.
- `checklists/pedagogical-moments.md` for interactive artifacts.
- `checklists/accessibility.md` for visual or interactive artifacts.
- `templates/interactive-html-patterns/README.md` for interactive artifacts.
- `templates/course-document-patterns/README.md` for notes or exams.
- Family-specific checklists and templates, such as
  `checklists/embedded-llm-runtime.md`, `templates/embedded-llm/`, or
  `templates/firebase-multiplayer/`.

## Operating Rules

- Ask concise clarifying questions before production. Prefer 3-6 high-leverage
  questions over a long questionnaire.
- Resolve blocking uncertainty before writing the artifact: audience, learning
  objectives, source hierarchy, language, tone, visual direction, emoji
  preference, branding, footer attribution, deployment, privacy, and output
  path.
- Write a concrete plan and wait for instructor approval before generating the
  final bundle.
- Put generated projects under `work/<project-name>/` unless the instructor
  chooses another path.
- Produce a complete bundle, not just an artifact: include user guidance,
  verification notes, deployment notes when relevant, and source-boundary notes.
- For interactive artifacts, include deliberate pedagogical pause/checkpoint
  moments that recap what happened, connect it to course material, and ask
  students to think before continuing.
- For visual or interactive artifacts, apply the accessibility checklist and
  record limitations honestly in `VERIFICATION.md`.
- Use the pattern catalogs when they fit; do not leave agents to infer the
  structure of calculators, policy sandboxes, games, lecture notes, or exams
  from scratch.
- Keep outputs clean and professional. Do not include prompt logs, model
  chatter, draft planning notes, internal process notes, or coauthor framing.

## Source Policy

- Treat instructor sources as private by default.
- Ask the instructor to convert PDFs, slides, documents, and scans to `.md`,
  `.tex`, `.txt`, `.json`, CSV, or another structured format before the run
  unless the source is already cleanly machine-readable.
- If a document-parser skill or agent is needed, treat it as preprocessing:
  parse, clean, review, classify, then run the selected pipeline.
- Do not publish private course files, copied readings, student data, answer
  keys, secrets, private URLs, or identifying metadata.
- Use placeholders for service names, keys, IDs, and deployment settings in
  public examples and templates.

## Public Artifact Defaults

- Interaction language and output language are instructor choices.
- Emojis are off by default.
- Visuals should be purposeful, accessible, and pedagogically useful.
- Interactive artifacts should include short learning checkpoints, not only
  mechanics or navigation.
- Use the HEC-inspired academic palette by default unless another brand system
  is provided.
- Include the default footer unless the instructor disables or replaces it:
  `Created with Flying Mermoz, an open-source toolkit for educational content.`

## Embedded LLM Work

When a hosted LLM, auth, persistence, logging, or export is involved:

- Follow `pipelines/wizard-llm.md`.
- Follow `checklists/embedded-llm-runtime.md`.
- Use `templates/embedded-llm/` as the concrete Netlify starter when suitable.
- Keep prompts, context, model choice, token caps, secrets, and storage policy
  server-side.
- Do not let the browser submit system prompts, unrestricted context, model
  names, token caps, API keys, admin keys, or other server-only parameters.
- Require `PRIVACY.md` when hosted LLM calls handle student input, auth,
  logging, or stored responses.
- Require `COST_NOTES.md` whenever hosted LLM calls are used.
- Test normal, failed, over-limit, expired-session, unavailable-backend,
  unauthorized-export, and client-controlled-field paths before release.

## Firebase Multiplayer Work

When a real-time multiplayer classroom game is involved:

- Follow `pipelines/firebase-multiplayer-game.md`.
- Follow `checklists/firebase-realtime-runtime.md`.
- Use `templates/firebase-multiplayer/` as the public-safe runtime contract when
  suitable.
- Use Firebase Realtime Database unless the instructor explicitly chooses a
  different backend.
- Keep real Firebase project IDs, database URLs, passwords, and room data out of
  public templates and examples.
- Treat prototype `.read: true, .write: true` rules as short-lived classroom
  rules only; repeated public use needs a stronger rule/auth/server plan.

## Verification

Before handing off, verify that:

- the artifact opens and core interactions work
- promised backend paths fail safely when unavailable
- visual layout works on desktop and mobile
- outputs match the approved language, tone, source boundaries, and footer
- browser-visible files contain no secrets or private source text
- the generated bundle contains no process clutter
- the instructor is asked to inspect the result and provide comments

If the instructor has no comments, offer help with installation, hosting,
environment variables, Firebase, Netlify, LMS upload, or local deployment when
relevant.
