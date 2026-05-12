# Pipelines

This folder is for the reusable public-facing pipeline recipes.

Start with `PIPELINE_CONTRACT.md`, then choose the recipe that matches the
artifact:

- `wizard-static.md` for static browser activities and wizards.
- `wizard-llm.md` for hosted wizards with bounded LLM feedback.
- `html-game.md` for standalone games, simulations, calculators, and
  interactive HTML modules.
- `firebase-multiplayer-game.md` for classroom games with instructor, student,
  and projection screens.
- `exam.md` for assessment drafts, rubrics, and separated answer keys.
- `lecture-notes.md` for notes, handouts, examples, and figure/tool plans.

Each pipeline should be short enough for a human instructor and LLM to execute
in a few hours. The docs should make clear what the user controls, what the LLM
may decide, what source boundaries apply, and how the output is verified.

The standard user flow is: choose a pipeline, provide private source paths, answer
clarifying questions, approve a plan, generate into `work/<project-name>/`,
inspect the output, then either request revisions or ask for installation and
deployment assistance.

Every pipeline should reinforce careful use: plan first, execute step by step,
verify before sharing, and ask before using external services, credentials,
private data, or unfamiliar commands. Polished output is not evidence of
correctness.

Interactive artifacts should additionally follow
`checklists/pedagogical-moments.md`. A game, wizard, simulator, or interactive
HTML module should include planned pause/checkpoint moments that recap the
student action, connect it to course material, and ask for a short reflection,
strategy explanation, prediction, or understanding check.

Interactive pipeline plans should also consult
`templates/interactive-html-patterns/README.md` so common structures such as
parameter explorers, policy sandboxes, structured calculators, transfer tools,
solo-first games, multiplayer flows, and strategic chapter games are explicit
rather than improvised.

Source material should be prepared before the run. Convert raw PDFs, slides,
documents, scans, video, and audio to `.md`, `.tex`, `.txt`, `.json`, CSV,
timestamped transcripts, or other structured or machine-readable files unless
the source is already cleanly machine-readable. Raw document or recording
ingestion through a coding agent during artifact generation is usually
token-expensive, slow, and wasteful compared with clean extracted text.

If the instructor cannot use a local parser, they may run a separate
source-approved document-parser skill or PDF-to-Markdown agent pass. Keep it as
preprocessing: parse, clean, review, then feed the cleaned source files into the
selected pipeline. Use `checklists/source-prep.md` before running any artifact
pipeline.

For recordings, use `skills/media-to-transcript/SKILL.md` as a preprocessing
workflow: extract audio, transcribe locally when possible, review timestamps and
technical terms, then classify the transcript before using it downstream.

Visual artifacts should ask for visual direction and branding/color choices.
The default is an HEC-inspired academic palette unless the instructor provides a
different brand system.

Visual and interactive artifacts should also apply `checklists/accessibility.md`
and record any limitations in `VERIFICATION.md`.

Generated artifacts should include the default footer attribution:
`Created with Flying Mermoz, an open-source toolkit for teaching artifacts.`
Link the product name to the public repository URL when available.

Embedded-LLM pipelines should additionally follow
`checklists/embedded-llm-runtime.md`, which locks prompt/context handling,
server boundaries, privacy, cost controls, and failure-path tests. The companion
`templates/embedded-llm/` folder provides a concrete Netlify starter with
server-owned prompts, caps, auth, progress, feedback, export, and deployment
notes.

Firebase multiplayer pipelines should additionally follow
`checklists/firebase-realtime-runtime.md`, which locks the three-screen runtime,
Realtime Database schema, room lifecycle, rules caveats, deployment setup, and
dry-run tests. The companion `templates/firebase-multiplayer/` folder provides
public-safe Firebase config and rules placeholders plus the expected schema
contract.

Lecture-note and exam pipelines should additionally consult
`templates/course-document-patterns/README.md` for source lanes, semantic note
blocks, figure/tool planning, format extraction, blueprints, question patterns,
rubrics, and answer-key separation.

The public `README.md` and recipe docs should be professional, complete, and
free of LLM process clutter. Do not include prompt logs, process transcripts,
draft planning notes, exception logs, or LLM-coauthor framing in public-facing
pipeline files.

Do not publish personal information, private source files, copied private
examples, or identifying metadata. Full runnable public examples should be added
later only after they are sanitized toy examples or newly authored examples;
pattern catalogs are acceptable because they describe reusable structures rather
than copied source material.
