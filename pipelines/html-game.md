# Standalone HTML Teaching Game Pipeline

## Purpose

Produce a single-file HTML teaching game or interactive module with deterministic
JavaScript, a clear pedagogical arc, and no backend dependency.

Use this recipe with `templates/interactive-html-patterns/README.md` and
`checklists/pedagogical-moments.md`.

## Suitable Use Cases

- A classroom activity that lets students explore a model or concept.
- A homework mini-game that runs in a browser without installation.
- A teaching piece where the mechanics are fixed, transparent, and easy to
  verify.

## Inputs

- Course name, level, and target audience.
- Interaction language for the planning conversation.
- Output language for the game and guides.
- Learning objectives and source packet or source paths, converted to `.md`,
  `.tex`, `.txt`, `.json`, CSV, or another machine-readable format before the
  agent run unless already cleanly machine-readable.
- Source hierarchy: canonical, supporting, assessment, private, quarantine.
- Desired game type: simulation, quiz, scenario, calculator, decision game, or
  guided exploration.
- Preferred design pattern if known: parameter explorer, policy lever sandbox,
  structured decision calculator, transfer or benchmark tool, solo-first game
  engine, or strategic chapter game.
- Interaction density, session length, and classroom/homework context.
- Time/token budget.
- Deployment target and output directory, normally `work/<project-name>/`.
- Verification depth.

## User Decisions

Ask the instructor to choose:

- The concept or model students should understand.
- Interaction language and output language.
- Tone and emoji preference, with emojis off by default unless explicitly
  requested.
- Visual direction: no added visuals, diagrams only, instructor-provided images,
  AI-generated images, or a mixed visual package.
- Branding/colors: HEC-inspired academic palette by default unless another
  brand system is provided.
- Footer attribution: default Flying Mermoz footer, or instructor
  override/removal if needed.
- Brevity defaults: 3-6 planning questions at a time, concise instructions,
  and bounded student responses unless the instructor expands the scope.
- Game duration: five-minute activity, class exercise, or full lesson.
- Design pattern: slider explorer, policy sandbox, calculator, benchmark tool,
  solo game, strategic chapter game, or another instructor-specified pattern.
- Mechanics: choices, rounds, scoring, feedback, reveals, or simulation.
- Pedagogical moments: where students pause to interpret a result, state a
  strategy, compare assumptions, or connect the activity to the course source.
- Whether outputs should be printable, exportable, or resettable.
- Deployment target: local file, static site, LMS, or Netlify static hosting.

## LLM Autonomy Boundaries

The LLM may propose mechanics, screens, variables, feedback text, state
structure, and visual layout after the plan is approved.

The instructor decides the learning objectives, canonical model, assumptions,
difficulty, tone, language, and whether simplifications are pedagogically
acceptable.

The LLM must not invent domain facts, hide model assumptions, add backend
dependencies, copy private source material, or make scoring punitive when the
activity is intended to teach.

The LLM must not add emojis or AI-generated images by default. Visuals should be
purposeful, polished, legible, accessible, and tied to the game mechanics.
Prefer clear diagrams and well-rendered interface elements over decorative
filler.

Default colors should follow an HEC-inspired academic palette: deep navy
`#002855`, accent blue `#0072CE`, teal `#00AEC7`, light blue `#e6f1fa`, white,
and neutral grays. The instructor may replace this with another brand system.

Generated artifacts should include a small, unobtrusive footer by default:
"Created with Flying Mermoz, an open-source toolkit for educational content."
Link the product name to the public repository URL when configured.

Default brevity caps should keep the first playable version easy to review:
short planning questions, concise screen text, compact feedback, and bounded
student response fields. Expand only after instructor approval.

## Step-By-Step Workflow

1. Ask clarifying questions about concept, audience, source hierarchy, language
   choices, tone, emoji preference, visual direction, branding/colors, mechanics,
   footer attribution, brevity defaults, design pattern, duration, feedback
   style, pedagogical moments, time/token budget, and deployment.
2. Draft a plan with learning objectives, selected pattern, game loop, screens,
   variables, state, feedback, pedagogical moments, expected files, and
   verification checks.
3. Wait for instructor approval before creating files.
4. Build a minimal playable single-file HTML version.
5. Add visual hierarchy, explanations, feedback, reset behavior, pedagogical
   checkpoint screens or panels, and optional print/export.
6. Write the user guide, source notes, and verification report.
7. Ask the instructor to play through the game and provide comments.
8. Revise through another plan and production pass if comments are provided.
9. If there are no comments, offer help with LMS upload or static hosting.

## Expected Outputs

Write to `work/<project-name>/` unless the instructor chooses another path:

- `index.html`
- `USER_GUIDE.md`
- `VERIFICATION.md`
- `SOURCE_NOTES.md`
- `DEPLOYMENT.md` if hosting or LMS setup is requested

## Verification Gates

- Gate 0: unresolved questions about model assumptions, mechanics, output
  language, and time/token budget are answered or explicitly deferred.
- Gate 1: sources are classified and private material is excluded from public
  output.
- Gate 2: objectives, mechanics, language choices, tone, emoji preference,
  visual direction, branding/colors, brevity caps, time/token budget,
  deployment, selected pattern, pedagogical moments, and output path are locked,
  including footer attribution.
- Gate 3: `index.html` opens locally, game state updates correctly, reset works,
  visuals are polished and accessible, and no required local assets are missing.
- Gate 4: the output bundle includes user guide, verification notes, source
  notes, deployment notes when relevant, and the approved footer attribution
  unless disabled.
- Gate 5: the instructor reviews model assumptions, difficulty, feedback,
  pedagogical moments, and classroom fit; comments trigger revision.
- Gate 6: public files contain no personal information, copied private material,
  answer keys, secrets, or process clutter.

## Review And Revision Loop

Ask the instructor to play at least two full runs, including one intentionally
wrong or exploratory path. If comments are provided, ask targeted follow-up
questions, revise mechanics or copy, and rerun functional checks.
Remind the instructor that polished gameplay is not verification; they should
read, test, and edit the game before sharing it with students.

## Installation Or Deployment Assistance

If the instructor has no further comments, offer help with:

- opening locally from `index.html`
- uploading to an LMS
- publishing on a static course site
- deploying to Netlify without backend services

## Low-Token Path

- Use instructor-provided sources only.
- Build one game loop and 2-4 screens.
- Include at least one pedagogical checkpoint and one final debrief.
- Avoid external assets, libraries, and animation.
- Verify local play, reset, and guide completeness.

## Enriched Path

- Add richer visual design, optional diagrams, accessibility checks, mobile
  polish, and print/export behavior.
- Add pattern-specific depth, such as sensitivity charts, scenario presets,
  model calibration notes, method comparison checkpoints, or a chapter sequence
  that reveals formal vocabulary after experience.
- Search for public visual references or current examples only with approval or
  when time-sensitive facts are necessary.

## Failure Modes And Recovery

- Game is too complex: reduce variables, rounds, or branching.
- Concept is unclear: add an intuition screen before mechanics.
- Feedback only grades: rewrite feedback to teach the underlying concept.
- State bugs: simplify state into one object and retest every transition.
- Private material leak risk: replace copied examples with generic scenarios.

## Public/Private Content Policy

The instructor is responsible for source rights and publication review. Do not
publish private course files, copied readings, student data, answer keys,
secrets, personal information, or identifying metadata.

## Example Status And Sanitized Example Plan

Use public-safe patterns rather than copied course material. A typical plan can
look like this:

- Pattern: policy lever sandbox.
- Objective: students compare a baseline market with one intervention.
- Screens: instructions, baseline explorer, policy intervention, result
  comparison, final debrief.
- State: demand parameters, supply parameters, selected intervention, computed
  equilibrium, welfare metrics, student reflection text.
- Pedagogical moments: after the first intervention, ask what moved in the
  diagram and what welfare term changed; at the end, connect the observed result
  to the named course concept.
- Verification: compare baseline and intervention calculations by hand for one
  toy case, test reset, test mobile layout, and confirm the guide explains the
  assumptions.

## Public Presentation Requirements

Public outputs should read as professional teaching material. Do not include
prompt logs, internal notes, LLM-coauthor framing, model chatter, or private
source excerpts.
