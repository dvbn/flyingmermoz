# Static HTML Wizard Pipeline

## Purpose

Produce a self-contained HTML teaching wizard that guides students through a
structured sequence of scenes, explanations, exercises, reflection prompts, and
summary actions without relying on an embedded LLM or backend service.

Use this recipe with `templates/interactive-html-patterns/README.md` and
`checklists/pedagogical-moments.md`.

## Suitable Use Cases

- A concept walkthrough for one class session or homework activity.
- A guided exercise sequence that students can open locally or from a static
  site.
- A printable or exportable learning object that should work without accounts,
  APIs, or server persistence.

## Inputs

- Course name, level, and target audience.
- Interaction language for the planning conversation.
- Output language for the wizard and guides.
- Learning objectives and target concepts.
- Source packet or source paths supplied by the instructor, converted to `.md`,
  `.tex`, `.txt`, `.json`, CSV, or another machine-readable format before the
  agent run unless already cleanly machine-readable.
- Source hierarchy: canonical, supporting, assessment, private, quarantine.
- Desired module length and interaction density.
- Preferred pattern if known: strategic chapter game, parameter explorer,
  structured decision calculator, policy lever sandbox, or another guided
  sequence.
- Deployment target: local HTML, static site, LMS, or Netlify static hosting.
- Time/token budget.
- Output directory, normally `work/<project-name>/`.
- Verification depth: minimal, standard, or publication-grade.

## User Decisions

Ask the instructor to choose:

- The student audience, prerequisites, and target difficulty.
- Interaction language and output language.
- Tone: formal, conversational, playful, exam-prep, or another specified tone.
- Emoji use: off by default unless explicitly requested.
- Visual direction: no added visuals, diagrams only, instructor-provided images,
  AI-generated images, or a mixed visual package.
- Branding/colors: HEC-inspired academic palette by default unless another
  brand system is provided.
- Footer attribution: default Flying Mermoz footer, or instructor
  override/removal if needed.
- Wizard length: short module, class activity, or full lesson.
- Interaction density: light checks, standard exercises, or frequent branching.
- Pedagogical moments: concept reveal after experience, checkpoint after an
  exercise, reflection before summary, or instructor-led discussion pause.
- Default brevity caps for open-ended questions and student reflection fields.
- Progress behavior: none, browser-local progress, or printable completion
  summary.
- Deployment target and whether print/export behavior is required.

## LLM Autonomy Boundaries

The LLM may decide the scene structure, default HTML organization, copy-editing,
exercise placement, and simple local JavaScript behavior after the plan is
approved.

The instructor decides learning objectives, canonical source priority, language,
tone, difficulty, public/private boundaries, and whether any local progress data
is stored in the browser.

The LLM must not add backend services, embedded chat, analytics, external
dependencies, private source text, or assessment content unless the instructor
explicitly approves it.

The LLM must not add emojis or AI-generated images by default. Visuals should be
purposeful, polished, legible, accessible, and tied to the learning objectives.
Prefer clear diagrams over decorative filler.

Default colors should follow an HEC-inspired academic palette: deep navy
`#002855`, accent blue `#0072CE`, teal `#00AEC7`, light blue `#e6f1fa`, white,
and neutral grays. The instructor may replace this with another brand system.

Generated artifacts should include a small, unobtrusive footer by default:
"Created with Flying Mermoz, an open-source toolkit for teaching artifacts."
Link the product name to the public repository URL when configured.

Default brevity caps should keep the first version classroom-friendly: short
instructions, concise open-ended prompts, and bounded reflection fields. A
practical starting point is 3-6 planning questions and 1,200 characters for
student reflection answers. The instructor may relax these caps.

## Step-By-Step Workflow

1. Ask clarifying questions about audience, objectives, source hierarchy,
   interaction language, output language, tone, emoji preference, visual
   direction, branding/colors, footer attribution, module length, progress
   behavior, selected pattern, pedagogical moments, print/export needs,
   time/token budget, and deployment target.
2. Draft a plan with scene titles, learning objective mapping, exercises,
   pedagogical moments, default brevity caps, data stored locally if any,
   expected files, and verification checks.
3. Wait for instructor approval before creating files.
4. Build a minimal single-file HTML wizard first.
5. Add navigation, progress indicators, exercises, reflection boxes,
   pedagogical checkpoint screens, summary page, and print/export behavior if
   selected.
6. Write the user guide and verification notes.
7. Ask the instructor to inspect the wizard and provide comments.
8. Revise through another plan and production pass if comments are provided.
9. If there are no comments, offer help with local use, LMS upload, static
   hosting, or Netlify static deployment.

## Expected Outputs

Write to `work/<project-name>/` unless the instructor chooses another path:

- `index.html`
- `USER_GUIDE.md`
- `VERIFICATION.md`
- `SOURCE_NOTES.md`
- `DEPLOYMENT.md` if static hosting, Netlify, or LMS upload is requested

`USER_GUIDE.md` should include a short optional invitation to share creations,
issues, or feedback at `https://github.com/dvbn/flyingmermoz`.

## Verification Gates

- Gate 0: unresolved questions, including time/token budget, are answered or
  explicitly deferred.
- Gate 1: sources are classified by hierarchy and private material is excluded
  from public-facing output.
- Gate 2: artifact family, objectives, language choices, tone, emoji preference,
  visual direction, branding/colors, brevity caps, time/token budget, deployment,
  footer attribution, selected pattern, pedagogical moments, and output path are
  locked.
- Gate 3: `index.html` opens locally, navigation works, exercises respond, no
  required assets are missing, visuals are polished and accessible, and promised
  print/export behavior works.
- Gate 4: the output bundle includes the promised guide, verification notes,
  source notes, deployment notes when relevant, and the approved footer
  attribution unless disabled.
- Gate 5: the instructor reviews the wizard; comments trigger revision, and no
  comments trigger an offer to help with setup or deployment.
- Gate 6: no secrets, personal information, private course material, answer
  keys, copied readings, or process clutter appear in public-facing files.

## Review And Revision Loop

After the first working version, ask the instructor to open `index.html`, move
through every scene, test exercises, and review the language and tone. If the
instructor comments, ask only the follow-up questions needed to resolve those
comments, update the plan briefly, revise the files, and rerun verification.
Remind the instructor that polished screens are not verification; they should
read, test, and edit the wizard before sharing it with students.

## Installation Or Deployment Assistance

If the instructor has no further comments, offer to help with:

- local use by opening `index.html`
- uploading to an LMS
- static hosting on a course website
- Netlify static deployment without server functions

## Low-Token Path

- Use only the instructor-provided source packet.
- Produce a short wizard with 3-5 scenes.
- Include at least one checkpoint that connects student work back to a course
  concept.
- Keep prompts and reflection answers bounded by default.
- Avoid external assets and dependencies.
- Include only essential local checks and a concise guide.

## Enriched Path

- Add richer visual hierarchy, diagrams, optional animations, and stronger
  accessibility checks.
- Add print/export polish and LMS packaging notes.
- Search for public references only if the instructor approves or current facts
  are required.

## Failure Modes And Recovery

- Too much source material: ask the instructor to select canonical objectives
  and reduce to one module.
- Weak interaction design: convert passive text into checkpoints, short
  exercises, and reflection prompts.
- Broken navigation: simplify to linear scene navigation and retest.
- Private material leak risk: replace source text with summaries or placeholders.
- Mobile layout problems: reduce columns, enlarge controls, and retest.

## Public/Private Content Policy

The instructor is responsible for rights and source use. Do not publish private
course files, copied readings, student data, assessment keys, secrets, personal
information, or identifying metadata. Private source material may guide the
local artifact only when the instructor explicitly approves a local-only output.

## Example Status And Sanitized Example Plan

Use public-safe toy concepts and reusable patterns. A typical static wizard can
look like this:

- Pattern: strategic chapter game.
- Scenes: intuition, first decision, result comparison, formal concept reveal,
  final summary.
- Student actions: choose a strategy, explain why, compare the result with an
  alternative, then write one sentence using the formal term.
- Pedagogical moments: reveal the formal vocabulary only after the student has
  observed the mechanism; end with a short transfer question linked to the
  course objective.
- Verification: test every navigation branch, reset behavior, reflection length
  cap, print/export if promised, and mobile layout.

## Public Presentation Requirements

The recipe output should read as professional courseware documentation. Public
files should not include prompt logs, chat transcripts, process notes,
LLM-coauthor framing, model names, or internal production artifacts.
