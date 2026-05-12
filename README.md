# Flying Mermoz

![A vintage red biplane threading a snow-capped pass through the Andes](assets/flying-mermoz-andes.jpg)

AI gives educators new opportunities to make creative
course material: interactive explanations, calculators, web games, simulations,
wizards, and classroom activities that used to require a developer or a long
side project.

Flying Mermoz is a practical repo for educators with little to no hands-on
experience with AI agents or programming. Clone the repo, open it with Claude
Desktop in cowork mode, Claude Code, Codex, or another capable coding agent,
choose a pipeline, provide your course material, answer a short set of
clarifying questions, approve the plan, and let the agent produce a polished
HTML artifact or web game plus the user guide and verification notes. The goal
is a useful first version in half a day, with the instructor still controlling
pedagogy, sources, tone, deployment, and publication decisions.

## Quick Start

Install a capable coding agent that can read and write files in a local folder:
Claude Desktop with cowork mode, Claude Code, Codex, or an equivalent tool.
Then clone the repo:

```bash
git clone https://github.com/dvbn/flyingmermoz flyingmermoz
cd flyingmermoz
```

Start your preferred agent in that folder:

```bash
claude
# or: codex
```

If you use Claude Desktop, open the cloned folder in cowork mode and give it
the same prompt.

Then ask the agent to use one pipeline:

```text
Use the standalone HTML game pipeline in this repo.

My private course sources are in /path/to/my/sources outside the public repo.
Write outputs to ./work/my-game.
Use French for the artifact and English for our planning conversation.
Ask the required clarifying questions first, then write a plan for my approval.
```

You can use the same pattern with Codex or another capable coding agent:

```text
Use the lecture-notes pipeline in this repo.
Keep my source files private.
Output to ./work/week-4-notes.
Ask clarifying questions before drafting.
```

If you build something useful with Flying Mermoz, please share the creation,
feedback, issues, or improvement ideas on the GitHub repository:
<https://github.com/dvbn/flyingmermoz>.
Do not include private course material, student data, answer keys, secrets, or
copyrighted source excerpts in public issues or examples.

## How The Pipelines Work

Each pipeline should guide the agent through a controlled loop:

1. Ask concise clarifying questions about audience, learning objectives,
   interaction language, output language, tone, source boundaries, interaction
   style, visual direction, branding/colors, footer attribution, emoji
   preference, pedagogical pause/checkpoint moments, LLM use, deployment, and
   verification depth.
2. Write a concrete plan and list any unresolved assumptions.
3. Wait for user approval before production.
4. Produce the artifact under `work/<project-name>/`.
5. For interactive artifacts, include short pedagogical moments that recap what
   students just did, connect it to the course material, and ask them to reflect
   or check understanding before continuing.
6. Include supporting files such as `USER_GUIDE.md`, `VERIFICATION.md`,
   `SOURCE_NOTES.md`, and `DEPLOYMENT.md` when setup or hosting is relevant.
7. Ask the user to inspect the result and provide comments.
8. If comments are provided, revise through another question, plan, and
   production pass.
9. If no comments are provided, offer to help with installation or deployment
   when relevant, such as Netlify, Firebase, LMS upload, or local hosting.

## What You Get

A successful run produces a complete local bundle, not only the artifact:

- The teaching artifact: HTML, Markdown, LaTeX, assets, or backend functions
  depending on the selected pipeline.
- `USER_GUIDE.md` explaining how the instructor should run, share, and teach
  with the artifact.
- `VERIFICATION.md` listing what was tested and what still needs human review.
- `SOURCE_NOTES.md` recording source boundaries without copying private
  material into public-facing files.
- `DEPLOYMENT.md` when hosting, Firebase, Netlify, LMS upload, or other setup is
  relevant.
- `PRIVACY.md` and `COST_NOTES.md` when hosted LLM calls handle student input or
  stored responses.

## Work Carefully

<img src="assets/vibe-coding-kermit.jpg" alt="A frog at a desk with a chalkboard of pseudocode behind him, quietly reviewing the agent's output" align="right" width="260" />

Flying Mermoz assumes the instructor stays in the loop. A coding agent can read
files, write files, call tools, and make confident-looking mistakes. Treat the
plan as the anchor: review it, edit it, approve it, then make the agent execute
against it step by step.

Good runs are explicit about both direction and guardrails. State the goal,
source hierarchy, success criteria, output format, length, tone, and what the
agent must not do. When style or structure matters, give one concise example.
Ask the agent to surface uncertainty before it starts.

Generated work is not ready because it looks polished. Read it, test it, edit
it, and verify the claims before sharing with students or colleagues. Do not
delegate intent, source judgment, or final responsibility.

For security and privacy, give agents the least access needed for the task.
Treat web pages, PDFs, emails, and retrieved notes as untrusted inputs. Do not
approve commands, deployments, data sharing, or credential use that you do not
understand.

## Pipelines

Choose the recipe that matches the artifact you want:

| Goal | Start With | Typical Output | Main Risk To Control |
|---|---|---|---|
| Static browser activity or wizard | `pipelines/wizard-static.md` | One or more HTML files plus guide and verification notes | Source accuracy and accessibility |
| Hosted wizard with embedded LLM feedback | `pipelines/wizard-llm.md` | Static UI, Netlify functions, privacy and cost notes | Prompt policy, token caps, privacy, cost |
| Standalone teaching game or interactive HTML | `pipelines/html-game.md` | Self-contained game, simulator, calculator, or classroom module | Pedagogical value, testing, visual quality |
| Multiplayer classroom game | `pipelines/firebase-multiplayer-game.md` | Instructor, student, and projection screens with Firebase setup | Student data, rules, deployment, fallback |
| Exam or assessment draft | `pipelines/exam.md` | Questions, rubric, and separated answer key if requested | Assessment leakage and source alignment |
| Lecture notes or teaching handout | `pipelines/lecture-notes.md` | Markdown, LaTeX, or HTML notes with examples and tool links | Copyright, structure, claim verification |

The shared contract for public recipes is in
`pipelines/PIPELINE_CONTRACT.md`.

Runtime-specific checklists and starter structures are included for the
higher-risk pipelines: embedded LLM wizards and Firebase Realtime Database
multiplayer games. The embedded LLM template includes a concrete Netlify
function layout; the Firebase template includes config placeholders, rules
examples, schema guidance, and deployment checks.

Pattern catalogs are included for reusable design decisions:

- `templates/interactive-html-patterns/` for calculators, policy sandboxes,
  parameter explorers, solo-first games, multiplayer flows, and chapter games.
- `templates/course-document-patterns/` for lecture-note structure, semantic
  blocks, figure/tool plans, exam blueprints, and assessment separation.
- `checklists/accessibility.md` for publication-grade visual and interaction
  checks.

Preprocessing skills are included for common source-preparation tasks:

- `skills/pdf-to-markdown/` for approved chunk-first PDF extraction.
- `skills/media-to-transcript/` for approved local video/audio transcription.

## Examples And Screenshots

These live examples show the kind of artifacts the pipelines are designed to
produce. They are all currently in French.

| Example | What It Shows | Link |
|---|---|---|
| Cost-benefit tool | A structured interactive calculator for classroom reasoning | <https://www.davidbenatia.com/tools/cout-benefice/> |
| Value-transfer tool | A parameterized economics explainer with interactive controls | <https://www.davidbenatia.com/tools/transfert-valeurs/> |
| Wizard resources | Hosted wizard-style teaching resources; testing password available on request | <https://www.davidbenatia.com/wizard-resources/> |
| Multiplayer ESG game | Firebase-style classroom game with instructor flow; use password `prof` to test | <https://www.davidbenatia.com/tools/jeu-esg/> |
| Course chatbot | Embedded teaching assistant pattern; password available on request | <https://www.davidbenatia.com/tools/apps/ta-widget-econ20806.html> |

The chatbot deployment is designed to stay inexpensive for typical course use:
often below US$1 per semester per course, depending on class size, usage, model
prices, and token caps.

Screenshots should illustrate these artifact families: calculators and
structured decision tools, parameter explorers, solo games, multiplayer
instructor/student/projection flows, hosted wizards, and embedded LLM assistants.
Before adding screenshots, crop or redact backend URLs, Firebase config, room
codes, passwords, student names, private prompts, course identifiers, and source
text that should not be public.

## Output Layout

Generated projects should go under `work/<project-name>/`, which is ignored by
git.

Recommended bundle:

```text
work/<project-name>/
  artifact files
  USER_GUIDE.md
  DEPLOYMENT.md
  VERIFICATION.md
  SOURCE_NOTES.md
```

`DEPLOYMENT.md` is required when the artifact needs setup, hosting, Firebase,
Netlify, LMS upload, or other installation steps.

Visual artifacts use an HEC-inspired academic palette by default: deep navy,
accent blue, teal, light blue, white, and neutral grays. Instructors can replace
that default with any brand system they provide.

Generated artifacts should include a small footer by default:

```text
Created with Flying Mermoz, an open-source toolkit for teaching artifacts.
```

Link `Flying Mermoz` to the public repository URL when that URL is configured.

## Source And Copyright Responsibility

Bring your own educational material. Keep private course files outside the repo,
or under a gitignored folder such as `private_sources/` or `local_sources/`.
Use `work/` for generated outputs, not as the primary source archive.

Prepare source material before giving it to an agent. Convert PDFs, slides,
documents, scans, video, and audio into machine-readable `.md`, `.tex`, `.txt`,
`.json`, CSV, transcripts, or other structured files before the run unless the
source is already cleanly machine-readable. Handing raw documents or recordings
to a coding agent during artifact generation is usually token-expensive, slow,
wasteful, and less reliable than working from clean extracted text.

If local extraction is unavailable, a separate document-parser skill or agent
pass is acceptable when the instructor approves the source-sharing path. Treat
that as preprocessing, not artifact generation: parse first, clean and review
the extracted Markdown, then run the selected pipeline from the cleaned source.
This works, but it is usually the token-costly option. See
`checklists/source-prep.md` for the full preprocessing checklist and
`skills/pdf-to-markdown/SKILL.md` for a public-safe chunk-first parser workflow.
For video or audio recordings, see `skills/media-to-transcript/SKILL.md`.

You are responsible for ensuring that you have the right to use any source
material you provide and for reviewing outputs before sharing or publishing
them. Do not publish private course archives, student data, personal
information, answer keys, copyrighted readings, secrets, or deployment
credentials.

Live public examples are linked above, but their source material is not copied
into this repo. The repo includes public-safe pattern catalogs so agents have
concrete structure without copying private course material. Any future bundled
examples should be sanitized toy examples or newly authored examples.

## Contribution Standards

Contributions should keep the repository professional, source-safe, and easy to
run with a coding agent. Do not add private source files, copied course archive
material, assessment keys, student data, secrets, personal information, or
identifying metadata. New examples must be sanitized toy examples or newly
authored examples. New or revised pipelines should preserve the clone-and-run
workflow, the standard output bundle, the review/revision loop, and the
verification expectations in `pipelines/PIPELINE_CONTRACT.md`.

## License

Flying Mermoz is released under the MIT License. See `LICENSE`.

## Repository Structure

```text
AGENTS.md       Repo-level agent instructions
assets/         Public-safe images used in the README and docs
checklists/     Focused verification checklists
pipelines/      Public pipeline contract and recipes
skills/         Optional agent-skill instructions
templates/      Public-safe implementation contracts and starter structures
work/           Local generated projects, gitignored and created as needed
```

## Why Mermoz?

Mermoz is a reminder that delegation is not autopilot. When work slips out of
your hands and into an AI agent's, the instructor still needs to steer, recover,
and decide where to land:
[Mermoz](https://robertmerlozpilotedemontagne.fr/du-9-au-13-mars-1929-mermoz-et-collenot-survivent-a-un-crash-dans-les-andes-2/).
